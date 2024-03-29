import React, { useContext, useEffect, useState, useRef } from 'react'
import { StyleSheet, FlatList } from 'react-native'
import { useCallback } from 'react'
import { ActivityIndicator } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import SimpleWorkoutPreview from '../Components/SimpleWorkoutPreview'

const limit = 5

const FeedContainer = React.memo(({ userId, headerComponent }) => {
  const [isFriendsOnly, setIsFriendsOnly] = useState(true)
  const { user } = useContext(AuthContext)

  const [documentData, setDocumentData] = useState([])
  const [lastVisible, setLastVisible] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const isAllLoaded = useRef(false)

  const retrieveData = async () => {
    try {
      setRefreshing(true)
      console.log('Retrieving Data')
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
      let documentSnapshots = await initialQuery.get()
      let documentLocalData = documentSnapshots.docs.map(document =>
        document.data(),
      )
      if (documentLocalData.length !== limit) isAllLoaded.current = true
      let lastLocalVisible =
        documentLocalData[documentLocalData.length - 1].postTime
      setDocumentData(documentLocalData)
      setLastVisible(lastLocalVisible)
      setRefreshing(false)
    } catch (error) {
      console.log(error)
    }
  }

  const retrieveMore = async () => {
    if (!isAllLoaded.current) {
      try {
        setRefreshing(true)

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

        let documentSnapshots = await additionalQuery.get()
        let documentLocalData = documentSnapshots.docs.map(document =>
          document.data(),
        )
        if (documentLocalData.length !== limit) isAllLoaded.current = true

        if (documentLocalData.length > 0) {
          let lastLocalVisible =
            documentLocalData[documentLocalData.length - 1].postTime
          setDocumentData([...documentData, ...documentLocalData])
          setLastVisible(lastLocalVisible)
        }
        setRefreshing(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  useEffect(() => {
    setDocumentData([])
    setLastVisible('')
    retrieveData()
  }, [userId])

  const renderFooter = useCallback(() => {
    return refreshing ? (
      <ActivityIndicator
        animating={true}
        size={'large'}
        style={{ marginTop: 30 }}
      />
    ) : null
  }, [refreshing])

  const onRefresh = useCallback(() => {
    isAllLoaded.current = false
    retrieveData()
  }, [])

  return (
    <FlatList
      data={documentData}
      renderItem={({ item }) => <SimpleWorkoutPreview workout={item} />}
      keyExtractor={(item, index) => `${item.day}--${index}`}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={renderFooter}
      onEndReached={retrieveMore}
      onEndReachedThreshold={1}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  )
})

FeedContainer.displayName = 'FeedContainer'

export default FeedContainer
