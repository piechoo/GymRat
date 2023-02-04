import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text } from 'react-native'
import { useTheme } from '@/Hooks'
import { Brand } from '@/Components'
import { setDefaultTheme } from '@/Store/Theme'
import { navigateAndSimpleReset } from '@/Navigators/utils'
import { useDispatch, useSelector } from 'react-redux'
import {
  addUserWorkout,
  editUserWorkout,
  getUserDayWorkout,
} from '@/Store/User'
import { Button, FAB, Portal, Provider } from 'react-native-paper'
import { useState } from 'react'
import Modal from '@/Components/Modal'
import ExcercisesList from './ExcercisesList'
import { useCallback } from 'react'
import { defaultExcerciseValues } from '@/Store/Excercises/consts'
import { useMemo } from 'react'

const WorkoutContainer = ({ date = 21 }) => {
  const { Layout, Gutters, Fonts } = useTheme()
  const workout = useSelector(state => getUserDayWorkout(state, date))
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedExcercises, setSelectedExcercises] = useState([])
  const dispatch = useDispatch()

  const addExercises = useCallback(() => {
    const newExcercises = workout?.excercises ?? []
    const filtered = newExcercises.filter(
      obj => !selectedExcercises.find(o => o.name === obj.name),
    )
    const exercisesWithNew = filtered.concat(
      selectedExcercises.map(ex => ({ ...ex, ...defaultExcerciseValues })),
    )
    const newWorkout = { ...workout, excercises: exercisesWithNew, date }
    if (workout) dispatch(editUserWorkout({ date, workout: newWorkout }))
    else dispatch(addUserWorkout({ workout: newWorkout }))
    setIsModalVisible(false)
  }, [workout, date, selectedExcercises])

  const onStateChange = ({ open }) => setIsFabOpen(open)

  const addExcercisesButton = useMemo(() => {
    return selectedExcercises ? (
      <Button
        mode="text"
        onPress={addExercises}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      >
        Add
      </Button>
    ) : undefined
  }, [addExercises, selectedExcercises])

  return (
    <Provider>
      <Portal>
        <FAB.Group
          open={isFabOpen}
          variant={'surface'}
          visible
          icon={isFabOpen ? 'close' : 'plus'}
          actions={[
            {
              icon: 'dumbbell',
              label: 'Add from list',
              onPress: () => setIsModalVisible(true),
            },
            {
              icon: 'calendar-blank-multiple',
              label: 'Add from day',
              onPress: () => console.log('Pressed star'),
            },
          ]}
          onStateChange={onStateChange}
        />

        <View style={[Layout.fill, Layout.column]}>
          {workout?.excercises?.map(ex => (
            <View>
              <Text>{ex.name}</Text>
            </View>
          ))}
        </View>
        <Modal
          isVisible={isModalVisible}
          setVisible={setIsModalVisible}
          buttons={addExcercisesButton}
        >
          <ExcercisesList
            setSelectedExcercises={setSelectedExcercises}
            selectedExcercises={selectedExcercises}
          />
        </Modal>
      </Portal>
    </Provider>
  )
}

export default WorkoutContainer
