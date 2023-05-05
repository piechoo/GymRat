import React, { useContext, useEffect, useState, useMemo, useRef } from 'react'
import { View, StyleSheet, Dimensions, FlatList } from 'react-native'

import { Agenda, Calendar } from 'react-native-calendars'
import { useCallback } from 'react'
import {
  ActivityIndicator,
  Appbar,
  Portal,
  Provider,
  Text,
} from 'react-native-paper'
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

const limit = 5

const FeedContainer = React.memo(
  ({
    navigation,
    height = windowDimensions.height,
    userId,
    headerComponent,
  }) => {
    // const [loading, setLoading] = useState(true)
    const [isFriendsOnly, setIsFriendsOnly] = useState(true)
    const { user } = useContext(AuthContext)

    const [calendarWorkouts, setCalendarWorkouts] = useState({})
    const [documentData, setDocumentData] = useState([])
    const [lastVisible, setLastVisible] = useState('')
    const [refreshing, setRefreshing] = useState(false)
    const isAllLoaded = useRef(false)

    const retrieveData = async () => {
      try {
        // Set State: Loading
        setRefreshing(true)
        console.log('Retrieving Data')
        // Cloud Firestore: Query
        let initialQuery
        if (userId)
          initialQuery = await firestore()
            .collection('workouts')
            .where('userId', '==', userId)
            .orderBy('postTime', 'desc')
            .limit(limit)
        else if (isFriendsOnly && user.followed?.length)
          initialQuery = await firestore()
            .collection('workouts')
            .where('userId', 'in', user.followed)
            .orderBy('postTime', 'desc')
            .limit(limit)
        else
          initialQuery = await firestore()
            .collection('workouts')
            .orderBy('postTime', 'desc')
            .limit(limit)
        // Cloud Firestore: Query Snapshot
        let documentSnapshots = await initialQuery.get()
        // Cloud Firestore: Document Data
        let documentLocalData = documentSnapshots.docs.map(document =>
          document.data(),
        )
        if (documentLocalData.length !== limit) isAllLoaded.current = true
        let lastLocalVisible =
          documentLocalData[documentLocalData.length - 1].postTime
        // Set State
        setDocumentData(documentLocalData)
        setLastVisible(lastLocalVisible)
        setRefreshing(false)
      } catch (error) {
        console.log(error)
      }
    }

    const retrieveMore = async () => {
      // console.log(isAllLoaded.current)
      if (!isAllLoaded.current) {
        try {
          // Set State: Refreshing
          setRefreshing(true)
          console.log('Retrieving additional Data')
          // Cloud Firestore: Query (Additional Query)

          let additionalQuery
          if (userId)
            additionalQuery = await firestore()
              .collection('workouts')
              .where('userId', '==', userId)
              .orderBy('postTime', 'desc')
              .startAfter(lastVisible)
              .limit(limit)
          else if (isFriendsOnly && user.followed?.length)
            additionalQuery = await firestore()
              .collection('workouts')
              .where('userId', 'in', user.followed)
              .orderBy('postTime', 'desc')
              .startAfter(lastVisible)
              .limit(limit)
          else
            additionalQuery = await firestore()
              .collection('workouts')
              .orderBy('postTime', 'desc')
              .startAfter(lastVisible)
              .limit(limit)

          // Cloud Firestore: Query Snapshot
          let documentSnapshots = await additionalQuery.get()
          // Cloud Firestore: Document Data
          let documentLocalData = documentSnapshots.docs.map(document =>
            document.data(),
          )
          if (documentLocalData.length !== limit) isAllLoaded.current = true

          if (documentLocalData.length > 0) {
            // Cloud Firestore: Last Visible Document (Document ID To Start From For Proceeding Queries)
            let lastLocalVisible =
              documentLocalData[documentLocalData.length - 1].postTime
            // Set State
            setDocumentData([...documentData, ...documentLocalData])
            setLastVisible(lastLocalVisible)
          }
          setRefreshing(false)
        } catch (error) {
          console.log(error)
        }
      }
    }

    const fetchWorkouts = async () => {
      try {
        const list = {}

        if (userId)
          await firestore()
            .collection('workouts')
            .where('userId', '==', userId)
            .orderBy('postTime', 'desc')
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
            .orderBy('postTime', 'desc')
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
            .orderBy('postTime', 'desc')
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
      // fetchWorkouts()
      retrieveData()
      // navigation.addListener('focus', () => setRefreshing(!refreshing))
    }, [navigation])

    const renderFooter = useCallback(() => {
      return refreshing ? (
        <ActivityIndicator
          animating={true}
          size={'large'}
          style={{ marginTop: 30 }}
        />
      ) : null
    }, [refreshing])

    return (
      <FlatList
        // nestedScrollEnabled
        // Data
        data={documentData}
        // Render Items
        renderItem={({ item }) => <SimpleWorkoutPreview workout={item} />}
        // Item Key
        keyExtractor={(item, index) => `${item.day}--${index}`}
        // Header (Title)
        ListHeaderComponent={headerComponent}
        // Footer (Activity Indicator)
        ListFooterComponent={renderFooter}
        // On End Reached (Takes a function)
        onEndReached={retrieveMore}
        // How Close To The End Of List Until Next Data Request Is Made
        onEndReachedThreshold={0}
        onRefresh={() => {
          isAllLoaded.current = false
          console.log('refresh')
          retrieveData()
        }}
        // Refreshing (Set To True When End Reached)
        refreshing={refreshing}
      />
      // <ScrollView style={{ width: '100%' }}>
      //   {/* {loading && (
      //     <ActivityIndicator
      //       animating={true}
      //       size={'large'}
      //       style={{ marginTop: 30 }}
      //     />
      //   )} */}
      //   {!loading && (
      //     // Object.values(calendarWorkouts)?.map?.((work, i) => {
      //     //   return (
      //     //     <SimpleWorkoutPreview workout={work} key={`${work.day}--${i}`} />
      //     //   )
      //     // })
      //     <FlatList
      //       // Data
      //       data={documentData}
      //       // Render Items
      //       renderItem={({ item }) => (
      //         <SimpleWorkoutPreview workout={item} key={`${work.day}--${i}`} />
      //       )}
      //       // Item Key
      //       keyExtractor={(item, index) => `${item.day}--${index}`}
      //       // Header (Title)
      //       // ListHeaderComponent={this.renderHeader}
      //       // Footer (Activity Indicator)
      //       ListFooterComponent={renderFooter}
      //       // On End Reached (Takes a function)
      //       onEndReached={retrieveMore}
      //       // How Close To The End Of List Until Next Data Request Is Made
      //       onEndReachedThreshold={0}
      //       // Refreshing (Set To True When End Reached)
      //       refreshing={refreshing}
      //     />
      //   )}
      // </ScrollView>
    )
  },
)

FeedContainer.displayName = 'FeedContainer'

export default FeedContainer
