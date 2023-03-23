import React, { useEffect } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '@/Hooks'
import { useDispatch, useSelector } from 'react-redux'
import {
  addUserWorkout,
  editUserWorkout,
  getUserDayWorkout,
} from '@/Store/User'
import { Button, FAB, Portal } from 'react-native-paper'
import { useState } from 'react'
import Modal from '@/Components/Modal'
import ExcercisesList from './ExcercisesList'
import { useCallback } from 'react'
import { defaultExcerciseValues } from '@/Store/Excercises/consts'
import { useMemo } from 'react'
import { AppState } from '@/Store/types'
import { useTranslation } from 'react-i18next'
import WorkoutExcercise from '../Components/WorkoutExcercise'

interface Props {
  date: string
  displayFab: boolean
}

const styles = StyleSheet.create({
  addButton: { paddingHorizontal: 10, paddingVertical: 5 },
  container: { height: '100%' },
  fabGroup: { paddingBottom: 50 },
})

const WorkoutContainer = React.memo(({ date, displayFab }: Props) => {
  console.log('displayfab', displayFab)
  const { Layout } = useTheme()
  const { t } = useTranslation()

  const workout = useSelector((state: AppState) =>
    getUserDayWorkout(state, date),
  )
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
      <Button mode="text" onPress={addExercises} style={styles.addButton}>
        {t(`shared.add`)}
      </Button>
    ) : undefined
  }, [addExercises, selectedExcercises])

  return (
    <View style={styles.container}>
      <ScrollView style={[Layout.fill, Layout.column]}>
        {workout?.excercises?.map(ex => (
          <WorkoutExcercise
            date={date}
            excercise={ex}
            removeExercise={removeExercise}
            addSerie={addSerie}
            key={ex.name}
          />
        ))}
      </ScrollView>
      <Portal>
        <FAB.Group
          open={isFabOpen}
          variant={'surface'}
          visible={displayFab}
          icon={isFabOpen ? 'close' : 'plus'}
          style={styles.fabGroup}
          actions={[
            {
              icon: 'dumbbell',
              label: t(`workoutExcercise.addFromList`),
              onPress: () => setIsModalVisible(true),
            },
            {
              icon: 'calendar-blank-multiple',
              label: t(`workoutExcercise.addFromDay`),
              onPress: () => console.log('Pressed star'),
            },
            {
              icon: 'account-multiple-plus',
              label: t(`Add a friend`),
              onPress: () => console.log('Pressed star'),
            },
          ]}
          onStateChange={onStateChange}
        />

        <Modal
          isVisible={isModalVisible}
          setVisible={setIsModalVisible}
          buttons={addExcercisesButton}
          shouldStretch
        >
          <ExcercisesList
            setIsModalVisible={setIsModalVisible}
            setSelectedExcercises={setSelectedExcercises}
            selectedExcercises={selectedExcercises}
          />
        </Modal>
      </Portal>
    </View>
  )
})

WorkoutContainer.displayName = 'WorkoutContainer'

export default WorkoutContainer
