import React, { useContext, useEffect, useState, useMemo } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import { Agenda, Calendar } from 'react-native-calendars'
import { useCallback } from 'react'
import { Appbar, Portal, Provider, Text } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import Button from '../Components/Button'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import Modal from '../Components/Modal'
import SimpleWorkoutPreview from '../Components/SimpleWorkoutPreview'
import WorkoutContainer from './WorkoutContainer'

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: height,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const StartWorkoutContainer = React.memo(({ navigation }) => {
  const [workoutDate, setWorkoutDate] = useState(null)
  const [startNew, setStartNew] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useContext(AuthContext)

  const [workouts, setWorkouts] = useState([])
  const [calendarWorkouts, setCalendarWorkouts] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const onSelectDate = useCallback(day => {
    setSelectedDate(day?.dateString)
  }, [])

  const fetchWorkoutToCopy = async () => {
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

      if (loading) {
        setLoading(false)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const fetchToday = async () => {
    try {
      const today = new Date().toISOString().slice(0, 10)
      await firestore()
        .collection('workouts')
        .where('userId', '==', user?.uid)
        .where('day', '==', today)
        .count()
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.data().count > 0) {
            // navigation.navigate('WorkoutCreator', {
            //   dayToCopy: today,
            // })
            setWorkoutDate(today)
          }
        })

      if (loading) {
        setLoading(false)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchWorkoutToCopy()
    fetchToday()
    navigation.addListener('focus', () => setLoading(!loading))
  }, [navigation, loading])

  const selectDayButton = useMemo(() => {
    return (
      <Button
        mode="text"
        onPress={() => {
          navigation.navigate('WorkoutCreator', {
            dayToCopy: selectedDate,
          })
          setWorkoutDate(selectedDate)
          setSelectedDate(null)
        }}
      >
        Select
      </Button>
    )
  }, [navigation, selectedDate])

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          // navigation.navigate('WorkoutCreator', {
          //   dayToCopy: selectedDate,
          // })
          setStartNew(true)
        }}
      >
        <Text>Start new workout</Text>
      </Button>
      <Button
        onPress={() => {
          setShowCalendar(!showCalendar)
        }}
      >
        <Text>Choose from day</Text>
      </Button>
      {showCalendar && (
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
      {(workoutDate || startNew) && (
        <WorkoutContainer
          navigation={navigation}
          route={{ params: { dayToCopy: workoutDate } }}
        />
      )}
      {selectedDate && (
        <Portal>
          <Modal
            isVisible={selectedDate}
            setVisible={setSelectedDate}
            buttons={selectDayButton}
            // shouldStretch
            closeLabel="Close"
          >
            <>
              <Appbar.Header>
                <Appbar.BackAction
                  onPress={() => {
                    setSelectedDate(null)
                  }}
                />
                <Appbar.Content title={'Workout to copy'} />
              </Appbar.Header>
              <SimpleWorkoutPreview workout={calendarWorkouts[selectedDate]} />
            </>
          </Modal>
        </Portal>
      )}
    </View>
  )
})

StartWorkoutContainer.displayName = 'AgendaContainer'

export default StartWorkoutContainer
