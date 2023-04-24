import React, { useContext, useEffect } from 'react'
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
import firestore from '@react-native-firebase/firestore'

import WorkoutExcercise from '../Components/WorkoutExcercise'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import { getTotalLoad, getWorkoutTags } from '../Store/Excercises/consts'

const styles = StyleSheet.create({
  addButton: { paddingHorizontal: 10, paddingVertical: 5 },
  container: { height: '100%' },
  fabGroup: { paddingBottom: 50 },
})

const WorkoutContainer = React.memo(({ route, navigation }) => {
  const { currentDay, dayToCopy } = route.params
  const { user } = useContext(AuthContext)
  const [excercises, setExcercises] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (dayToCopy) {
      fetchWorkoutToCopy()
      navigation.addListener('focus', () => setLoading(!loading))
    }
  }, [navigation, loading, dayToCopy])

  const fetchWorkoutToCopy = async () => {
    try {
      await firestore()
        .collection('workouts')
        .where('userId', '==', user?.uid)
        .where('day', '==', dayToCopy)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const { excercises } = doc.data()

            setExcercises(excercises)
          })
        })

      if (loading) {
        setLoading(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const submitWorkout = async () => {
    const tags = getWorkoutTags(excercises)
    const load = getTotalLoad(excercises)

    firestore()
      .collection('workouts')
      .add({
        userId: user.uid,
        day: currentDay ?? new Date().toISOString().slice(0, 10),
        excercises: excercises,
        postTime: firestore.Timestamp.fromDate(new Date()),
        tags: tags,
        load: load,
        likes: null,
        comments: null,
      })
      .then(() => {
        navigation.navigate('Feed')
      })
      .catch(error => {
        console.log('Something went wrong with added post to firestore.', error)
      })
  }

  const { Layout } = useTheme()
  const { t } = useTranslation()

  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const onStateChange = ({ open }) => setIsFabOpen(open)

  const addExcerciseSerie = useCallback((excercise, serie) => {
    setExcercises(state => {
      return state.map(ex => {
        if (ex.id === excercise.id) {
          return { ...ex, sets: ex.sets ? [...ex.sets, serie] : [serie] }
        }
        return ex
      })
    })
  }, [])

  const editExcerciseSerie = useCallback((excercise, serie, index) => {
    setExcercises(state => {
      return state.map(ex => {
        if (ex.id === excercise.id) {
          const sets = [...ex.sets]

          sets[index] = serie
          return { ...ex, sets: sets }
        }
        return ex
      })
    })
  }, [])

  const removeExcerciseSerie = useCallback((excercise, index) => {
    setExcercises(state => {
      return state.map(ex => {
        if (ex.id === excercise.id) {
          const sets = [...ex.sets]
          sets.splice(index, 1)
          return { ...ex, sets: sets }
        }
        return ex
      })
    })
  }, [])

  const removeExercise = useCallback(excercise => {
    setExcercises(state => {
      return state.filter(ex => ex.id !== excercise.id)
    })
  }, [])

  return (
    <View style={styles.container}>
      <ScrollView style={[Layout.fill, Layout.column]}>
        {excercises?.map(ex => (
          <WorkoutExcercise
            excercise={ex}
            removeExercise={removeExercise}
            addSerie={addExcerciseSerie}
            editSerie={editExcerciseSerie}
            removeSerie={removeExcerciseSerie}
            key={ex.name}
          />
        ))}
        <Button onPress={submitWorkout}>Save workout</Button>
      </ScrollView>
      <Portal>
        <FAB.Group
          open={isFabOpen}
          variant={'surface'}
          visible
          icon={isFabOpen ? 'close' : 'plus'}
          style={styles.fabGroup}
          actions={[
            {
              icon: 'dumbbell',
              label: t(`workoutExcercise.addFromList`),
              onPress: () => setIsModalVisible(true),
            },
            // {
            //   icon: 'calendar-blank-multiple',
            //   label: t(`workoutExcercise.addFromDay`),
            //   onPress: () => console.log('Pressed star'),
            // },
            // {
            //   icon: 'account-multiple-plus',
            //   label: t(`Add a friend`),
            //   onPress: () => console.log('Pressed star'),
            // },
          ]}
          onStateChange={onStateChange}
        />

        <Modal
          isVisible={isModalVisible}
          setVisible={setIsModalVisible}
          // buttons={addExcercisesButton}
          closeLabel="Close"
          shouldStretch
        >
          <ExcercisesList
            setIsModalVisible={setIsModalVisible}
            setSelectedExcercises={setExcercises}
            selectedExcercises={excercises}
          />
        </Modal>
      </Portal>
    </View>
  )
})

WorkoutContainer.displayName = 'WorkoutContainer'

export default WorkoutContainer
