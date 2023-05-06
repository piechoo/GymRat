import React, { useContext, useEffect, useCallback, useMemo } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '@/Hooks'
import {
  ActivityIndicator,
  Appbar,
  FAB,
  Portal,
  Text,
} from 'react-native-paper'
import { useState } from 'react'
import Modal from '@/Components/Modal'
import ExcercisesList from './ExcercisesList'
import { useTranslation } from 'react-i18next'
import firestore from '@react-native-firebase/firestore'
import WorkoutExcercise from '../Components/WorkoutExcercise'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import {
  findNewBestLifts,
  getTotalLoad,
  getWorkoutTags,
} from '../Store/Excercises/consts'
import { Calendar } from 'react-native-calendars'
import SimpleWorkoutPreview from '../Components/SimpleWorkoutPreview'
import Button from '../Components/Button'
import { useFocusEffect } from '@react-navigation/native'
import SimpleUserPreview from '../Components/SimpleUserPreview'

const styles = StyleSheet.create({
  addButton: { paddingHorizontal: 10, paddingVertical: 5 },
  container: { height: '100%' },
  fabGroup: { paddingBottom: 50 },
  saveButtonWrapper: { paddingBottom: 20, width: '80%', alignSelf: 'center' },
  saveButtonLabel: { fontWeight: '600', fontSize: 20 },
  activityIndicator: { marginTop: 30 },
  createWorkout: { paddingVertical: 30, textAlign: 'center' },
})

const WorkoutContainer = React.memo(({ route, navigation }) => {
  const { Layout } = useTheme()
  const { t } = useTranslation()
  const { user, setUser } = useContext(AuthContext)
  const currentDay = route?.params?.currentDay
  const dayToCopy = route?.params?.dayToCopy

  const userId = route?.params?.userId ? route?.params?.userId : user.uid

  const readOnly = userId !== user.uid

  const [isFabOpen, setIsFabOpen] = useState(false)
  const [displayFab, setDisplayFab] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isFromDayVisible, setIsFromDayVisible] = useState(false)
  const onStateChange = ({ open }) => setIsFabOpen(open)
  const [calendarWorkouts, setCalendarWorkouts] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const onSelectDate = useCallback(day => {
    setSelectedDate(day?.dateString)
  }, [])
  const [excercises, setExcercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [editedWorkoutId, setEditedWorkoutId] = useState(null)
  const [isTodayWorkoutDone, setIsTodayWorkoutDone] = useState(false)
  const isWorkoutSaved = (editedWorkoutId && dayToCopy) || isTodayWorkoutDone

  useEffect(() => {
    setExcercises([])
  }, [userId, dayToCopy])

  useFocusEffect(
    React.useCallback(() => {
      today = new Date().toISOString().slice(0, 10)
      if (dayToCopy) {
        fetchWorkoutToCopy(dayToCopy)
      } else fetchWorkoutToCopy(today, true)
      fetchCalendarWorkouts()

      setDisplayFab(true)
      return () => {
        setDisplayFab(false)
        setEditedWorkoutId(null)
        navigation.setParams({ userId: null, dayToCopy: null })
      }
    }, [dayToCopy]),
  )

  const fetchCalendarWorkouts = useCallback(async () => {
    try {
      const list = {}

      await firestore()
        .collection('workouts')
        .where('userId', '==', user?.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const { day, excercises, tags, load } = doc.data()
            list[day] = {
              day,
              excercises,
              tags,
              load,
              marked: true,
              dotColor: 'red',
            }
          })
        })
      setCalendarWorkouts(list)
    } catch (e) {
      console.log(e)
    }
  }, [user?.uid])

  const fetchWorkoutToCopy = useCallback(
    async (day, isToday) => {
      try {
        setLoading(true)

        await firestore()
          .collection('workouts')
          .where('userId', '==', userId)
          .where('day', '==', day)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              const { excercises } = doc.data()
              setEditedWorkoutId(doc.id)
              setExcercises(excercises)
              setIsTodayWorkoutDone(isToday)
            })
          })

        setLoading(false)
      } catch (e) {
        console.log(e)
      }
    },
    [userId],
  )

  const deleteWorkout = useCallback(async () => {
    try {
      setLoading(true)

      await firestore()
        .collection('workouts')
        .doc(editedWorkoutId)
        .delete()
        .then(() => {
          navigation.navigate('Feed')
          setLoading(false)
          setExcercises([])
        })
    } catch (e) {
      console.log(e)
    }
  }, [editedWorkoutId])

  const submitWorkout = useCallback(async () => {
    const tags = getWorkoutTags(excercises)
    const load = getTotalLoad(excercises)
    const newBestLifts = findNewBestLifts(excercises, user.bestLifts ?? [])
    setExcercises([])
    setLoading(true)

    await firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        bestLifts: newBestLifts,
      })
      .then(() => {
        setUser?.({ ...user, bestLifts: newBestLifts })
      })

    if (isWorkoutSaved)
      firestore()
        .collection('workouts')
        .doc(editedWorkoutId)
        .update({
          excercises: excercises,
          tags: tags,
          load: load,
        })
        .then(() => {
          navigation.navigate('Feed')
        })
    else
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
          console.log(error)
        })
  }, [excercises, user.bestLifts, user.uid, editedWorkoutId])

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

  const selectDayButton = useMemo(() => {
    return selectedDate ? (
      <Button
        mode="text"
        fullWidth={false}
        onPress={() => {
          fetchWorkoutToCopy(selectedDate)
          setSelectedDate(null)
          setIsFromDayVisible(false)
        }}
      >
        Select
      </Button>
    ) : null
  }, [selectedDate])

  const fabActions = useMemo(() => {
    return [
      {
        icon: 'dumbbell',
        label: t(`workoutExcercise.addFromList`),
        onPress: () => setIsModalVisible(true),
      },
      {
        icon: 'calendar-blank-multiple',
        label: t(`workoutExcercise.addFromDay`),
        onPress: () => setIsFromDayVisible(true),
      },
      ...(isWorkoutSaved
        ? [
            {
              icon: 'delete-outline',
              label: t(`workoutExcercise.delete`),
              onPress: () => deleteWorkout(),
            },
          ]
        : []),
    ]
  }, [isWorkoutSaved])

  const modalBack = useCallback(() => {
    if (selectedDate) setSelectedDate(null)
    else setIsFromDayVisible(false)
  }, [selectedDate])

  const onCalendarSelect = useCallback(
    day => {
      if (calendarWorkouts[day?.dateString]) onSelectDate(day)
    },
    [calendarWorkouts],
  )

  return (
    <View style={styles.container}>
      <SimpleUserPreview
        userId={userId}
        date={dayToCopy ?? new Date().toISOString().slice(0, 10)}
      />
      {loading && excercises.length === 0 && (
        <ActivityIndicator
          animating={true}
          size={'large'}
          style={styles.activityIndicator}
        />
      )}

      <ScrollView style={[Layout.fill, Layout.column]}>
        {excercises?.map(ex => (
          <WorkoutExcercise
            excercise={ex}
            removeExercise={removeExercise}
            addSerie={addExcerciseSerie}
            editSerie={editExcerciseSerie}
            removeSerie={removeExcerciseSerie}
            key={ex.name}
            readOnly={readOnly}
          />
        ))}
        {!readOnly && (
          <View style={styles.saveButtonWrapper}>
            {!loading &&
              (excercises.length === 0 ? (
                <Text variant="titleLarge" style={styles.createWorkout}>
                  Create new Workout!
                </Text>
              ) : (
                <Button
                  onPress={submitWorkout}
                  labelStyle={styles.saveButtonLabel}
                  mode="contained"
                >
                  {isWorkoutSaved ? 'Update Workout' : 'Save workout'}
                </Button>
              ))}
          </View>
        )}
      </ScrollView>
      <Portal>
        <FAB.Group
          open={isFabOpen}
          variant={'surface'}
          visible={displayFab && !readOnly}
          icon={isFabOpen ? 'close' : 'plus'}
          style={styles.fabGroup}
          actions={fabActions}
          onStateChange={onStateChange}
        />
        <Modal
          isVisible={isFromDayVisible}
          setVisible={setIsFromDayVisible}
          buttons={selectDayButton}
          closeLabel="Close"
        >
          <>
            <Appbar.Header>
              <Appbar.BackAction onPress={modalBack} />
              <Appbar.Content title={'Workout to copy'} />
            </Appbar.Header>
            {!selectedDate && (
              <Calendar
                markedDates={calendarWorkouts}
                onDayPress={onCalendarSelect}
                firstDay={1}
                disableAllTouchEventsForDisabledDays={true}
                enableSwipeMonths={true}
              />
            )}
            {selectedDate && (
              <SimpleWorkoutPreview workout={calendarWorkouts[selectedDate]} />
            )}
          </>
        </Modal>

        <Modal
          isVisible={isModalVisible}
          setVisible={setIsModalVisible}
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
