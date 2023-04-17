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
import { ScrollView } from 'react-native-gesture-handler'

const windowDimensions = Dimensions.get('window')

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const FeedContainer = React.memo(
  ({ navigation, height = windowDimensions.height, userId }) => {
    const [loading, setLoading] = useState(true)
    const [isFriendsOnly, setIsFriendsOnly] = useState(true)
    const { user } = useContext(AuthContext)

    const [calendarWorkouts, setCalendarWorkouts] = useState({})

    const fetchWorkouts = async () => {
      try {
        const list = {}

        if (userId)
          await firestore()
            .collection('workouts')
            .where('userId', '==', userId)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                const { day, excercises, tags, load, userId } = doc.data()
                list[day] = {
                  day,
                  excercises,
                  tags,
                  load,
                  marked: true,
                  dotColor: 'red',
                  userId,
                }
              })
            })
        else if (isFriendsOnly && user.followed?.length) {
          await firestore()
            .collection('workouts')
            .where('userId', 'in', user.followed)
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                const { day, excercises, tags, load, userId } = doc.data()
                list[day] = {
                  day,
                  excercises,
                  tags,
                  load,
                  marked: true,
                  dotColor: 'red',
                  userId,
                }
              })
            })
        } else
          await firestore()
            .collection('workouts')
            .get()
            .then(querySnapshot => {
              querySnapshot.forEach(doc => {
                const { day, excercises, tags, load, userId } = doc.data()
                list[day] = {
                  day,
                  excercises,
                  tags,
                  load,
                  marked: true,
                  dotColor: 'red',
                  userId,
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

    useEffect(() => {
      fetchWorkouts()
      navigation.addListener('focus', () => setLoading(!loading))
    }, [navigation, loading])

    return (
      <ScrollView>
        {!loading &&
          Object.values(calendarWorkouts)?.map?.((work, i) => {
            return (
              <SimpleWorkoutPreview workout={work} key={`${work.day}--${i}`} />
            )
          })}
      </ScrollView>
    )
  },
)

FeedContainer.displayName = 'FeedContainer'

export default FeedContainer
