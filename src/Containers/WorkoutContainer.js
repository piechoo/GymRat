import React, { useContext, useEffect } from 'react'
import { View, ScrollView, StyleSheet } from 'react-native'
import { useTheme } from '@/Hooks'
import { useDispatch, useSelector } from 'react-redux'
import {
  addUserWorkout,
  editUserWorkout,
  getUserDayWorkout,
} from '@/Store/User'
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
import { useCallback } from 'react'
import { defaultExcerciseValues } from '@/Store/Excercises/consts'
import { useMemo } from 'react'
import { AppState } from '@/Store/types'
import { useTranslation } from 'react-i18next'
import firestore from '@react-native-firebase/firestore'

import WorkoutExcercise from '../Components/WorkoutExcercise'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import { getTotalLoad, getWorkoutTags } from '../Store/Excercises/consts'
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
})

const WorkoutContainer = React.memo(({ route, navigation }) => {
  const { Layout } = useTheme()
  const { t } = useTranslation()
  const { user } = useContext(AuthContext)
  const currentDay = route?.params?.currentDay
  const dayToCopy = route?.params?.dayToCopy
  // const userId = route?.params?.userId

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

  useEffect(() => {
    setExcercises([])
  }, [userId, dayToCopy])

  useFocusEffect(
    React.useCallback(() => {
      // setLoading(true)
      today = new Date().toISOString().slice(0, 10)
      if (dayToCopy) {
        fetchWorkoutToCopy(dayToCopy)
      } else fetchWorkoutToCopy(today)
      fetchCalendarWorkouts()

      setDisplayFab(true)
      return () => {
        setDisplayFab(false)
        navigation.setParams({ userId: null, dayToCopy: null })
      }
    }, [dayToCopy]),
  )

  const fetchCalendarWorkouts = async () => {
    try {
      const list = {}
      // setLoading(true)

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

      if (loading) {
        // setLoading(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  const fetchWorkoutToCopy = async day => {
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

            setExcercises(excercises)
          })
        })

      setLoading(false)
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
        setExcercises([])
        navigation.navigate('Feed')
      })
      .catch(error => {
        console.log('Something went wrong with added post to firestore.', error)
      })
  }

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

  return (
    <View style={styles.container}>
      <SimpleUserPreview
        userId={userId}
        date={currentDay ?? new Date().toISOString().slice(0, 10)}
      />
      {loading && excercises.length === 0 && (
        <ActivityIndicator
          animating={true}
          size={'large'}
          style={{ marginTop: 30 }}
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
                <Text
                  variant="titleLarge"
                  style={{ paddingVertical: 30, textAlign: 'center' }}
                >
                  Create new Workout!
                </Text>
              ) : (
                <Button
                  onPress={submitWorkout}
                  labelStyle={styles.saveButtonLabel}
                  mode="contained"
                >
                  Save workout
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
          actions={[
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
            // {
            //   icon: 'account-multiple-plus',
            //   label: t(`Add a friend`),
            //   onPress: () => console.log('Pressed star'),
            // },
          ]}
          onStateChange={onStateChange}
        />
        <Modal
          isVisible={isFromDayVisible}
          setVisible={setIsFromDayVisible}
          buttons={selectDayButton}
          // shouldStretch
          closeLabel="Close"
        >
          <>
            <Appbar.Header>
              <Appbar.BackAction
                onPress={() => {
                  if (selectedDate) setSelectedDate(null)
                  else setIsFromDayVisible(false)
                }}
              />
              <Appbar.Content title={'Workout to copy'} />
            </Appbar.Header>
            {!selectedDate && (
              <Calendar
                markedDates={calendarWorkouts}
                onDayPress={day => {
                  if (calendarWorkouts[day?.dateString]) onSelectDate(day)
                }}
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
