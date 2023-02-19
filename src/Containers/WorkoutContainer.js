import React, { useEffect } from 'react'
import { ActivityIndicator, View, Text, ScrollView } from 'react-native'
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
import WorkoutExcercise from '@/Components/WorkoutExcercise'

const WorkoutContainer = React.memo(({ date }) => {
  const { Layout, Gutters, Fonts } = useTheme()
  const workout = useSelector(state => getUserDayWorkout(state, date))
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedExcercises, setSelectedExcercises] = useState(
    workout?.excercises ?? [],
  )

  useEffect(() => {
    setSelectedExcercises(workout?.excercises ?? [])
  }, [workout?.excercises])
  const dispatch = useDispatch()

  const addExercises = useCallback(() => {
    const newExcercises = workout?.excercises ?? []
    // const filtered = newExcercises.filter(
    //   obj => !selectedExcercises.find(o => o.name === obj.name),
    // )
    const filteredSelected = selectedExcercises.filter(
      obj => !newExcercises.find(o => o.name === obj.name),
    )
    const exercisesWithNew = newExcercises.concat(
      filteredSelected.map(ex => ({ ...ex, ...defaultExcerciseValues })),
    )
    const newWorkout = { ...workout, excercises: exercisesWithNew, date }
    if (workout) dispatch(editUserWorkout({ date, workout: newWorkout }))
    else dispatch(addUserWorkout({ workout: newWorkout }))
    setIsModalVisible(false)
  }, [workout, date, selectedExcercises])

  const removeExercise = useCallback(
    excercise => {
      const newExcercises = workout?.excercises ?? []
      const filtered = newExcercises.filter(obj => obj.id !== excercise.id)
      const newWorkout = { ...workout, excercises: filtered, date }
      dispatch(editUserWorkout({ date, workout: newWorkout }))
    },
    [workout, date, selectedExcercises],
  )

  const addSerie = useCallback(
    (excercise, serie) => {
      const newExcercises = workout?.excercises ?? []
      const filtered = newExcercises.map(obj => {
        if (obj.id !== excercise.id) return obj
        const copy = { ...obj }
        copy.sets = [...copy.sets, serie]
        return copy
      })
      const newWorkout = { ...workout, excercises: filtered, date }

      dispatch(editUserWorkout({ date, workout: newWorkout }))
    },
    [workout],
  )

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
    <View style={{ height: '100%' }}>
      {/* <Provider> */}
      <ScrollView style={[Layout.fill, Layout.column]}>
        {workout?.excercises?.map(ex => (
          <WorkoutExcercise
            date={date}
            excercise={ex}
            removeExercise={removeExercise}
            addSerie={addSerie}
            key={ex.name}
          />
          // <View>
          //   <Text>{ex.name}</Text>
          // </View>
        ))}
      </ScrollView>
      <Portal>
        <FAB.Group
          open={isFabOpen}
          variant={'surface'}
          visible
          icon={isFabOpen ? 'close' : 'plus'}
          style={{ paddingBottom: 50 }}
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
        <Modal
          isVisible={isModalVisible}
          setVisible={setIsModalVisible}
          buttons={addExcercisesButton}
          stretch
        >
          <ExcercisesList
            setIsModalVisible={setIsModalVisible}
            setSelectedExcercises={setSelectedExcercises}
            selectedExcercises={selectedExcercises}
          />
        </Modal>
      </Portal>
      {/* </Provider> */}
    </View>
  )
})

WorkoutContainer.type.displayName = 'WorkoutContainer'

export default WorkoutContainer
