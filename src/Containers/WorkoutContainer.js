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
      const list = []

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
    // const imageUrl = await uploadImage()
    // console.log('Image Url: ', imageUrl)
    // console.log('Post: ', post)

    firestore()
      .collection('workouts')
      .add({
        userId: user.uid,
        day: currentDay ?? new Date().toISOString().slice(0, 10),
        excercises: excercises,
        // postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      })
      .then(() => {
        // console.log('Post Added!')
        // Alert.alert(
        //   'Post published!',
        //   'Your post has been published Successfully!',
        // )
        // setPost(null)
        navigation.navigate('Feed')
      })
      .catch(error => {
        console.log('Something went wrong with added post to firestore.', error)
      })
  }

  const { Layout } = useTheme()
  const { t } = useTranslation()

  // const workout = useSelector((state: AppState) =>
  //   getUserDayWorkout(state, date),
  // )

  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  // const [selectedExcercises, setSelectedExcercises] = useState(
  //   workout?.excercises ?? [],
  // )

  // useEffect(() => {
  //   setSelectedExcercises(workout?.excercises ?? [])
  // }, [workout?.excercises])
  const dispatch = useDispatch()

  // const addExercises = useCallback(() => {
  //   const newExcercises = workout?.excercises ?? []
  //   const filteredSelected = selectedExcercises.filter(
  //     obj => !newExcercises.find(o => o.name === obj.name),
  //   )
  //   const exercisesWithNew = newExcercises.concat(
  //     filteredSelected.map(ex => ({ ...ex, ...defaultExcerciseValues })),
  //   )
  //   const newWorkout = { ...workout, excercises: exercisesWithNew, date }
  //   if (workout) dispatch(editUserWorkout({ date, workout: newWorkout }))
  //   else dispatch(addUserWorkout({ workout: newWorkout }))
  //   setIsModalVisible(false)
  // }, [workout, date, selectedExcercises])

  // const removeExercise = useCallback(
  //   excercise => {
  //     const newExcercises = workout?.excercises ?? []
  //     const filtered = newExcercises.filter(obj => obj.id !== excercise.id)
  //     const newWorkout = { ...workout, excercises: filtered, date }
  //     dispatch(editUserWorkout({ date, workout: newWorkout }))
  //   },
  //   [workout, date, selectedExcercises],
  // )

  // const addSerie = useCallback(
  //   (excercise, serie) => {
  //     const newExcercises = workout?.excercises ?? []
  //     const filtered = newExcercises.map(obj => {
  //       if (obj.id !== excercise.id) return obj
  //       const copy = { ...obj }
  //       copy.sets = [...copy.sets, serie]
  //       return copy
  //     })
  //     const newWorkout = { ...workout, excercises: filtered, date }

  //     dispatch(editUserWorkout({ date, workout: newWorkout }))
  //   },
  //   [workout],
  // )

  const onStateChange = ({ open }) => setIsFabOpen(open)

  // const addExcercisesButton = useMemo(() => {
  //   return selectedExcercises ? (
  //     <Button mode="text" onPress={addExercises} style={styles.addButton}>
  //       {t(`shared.add`)}
  //     </Button>
  //   ) : undefined
  // }, [addExercises, selectedExcercises])

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
            // date={date}
            excercise={ex}
            removeExercise={removeExercise}
            addSerie={addExcerciseSerie}
            editSerie={editExcerciseSerie}
            removeSerie={removeExcerciseSerie}
            key={ex.name}
          />
        ))}
        <Button onPress={submitWorkout}> ZAPISZ WOKROUIT</Button>
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
