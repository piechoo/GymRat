import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'
import { StyleSheet, FlatList, View, ScrollView } from 'react-native'
import { ActivityIndicator, Text } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import SimpleWorkoutPreview from '../Components/SimpleWorkoutPreview'
import LeaderboardResult from '../Components/LeaderboardResult'
import Button from '../Components/Button'
import Modal from '../Components/Modal'
import CreateTaskModal from '../Components/CreateTaskModal'
import TaskItem from '../Components/TaskItem'

const styles = StyleSheet.create({
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  saveButtonLabel: { fontWeight: '600', fontSize: 20 },
})

const limit = 30

const LeaderboardContainer = React.memo(({ headerComponent }) => {
  const [isFriendsOnly, setIsFriendsOnly] = useState(true)
  const { user } = useContext(AuthContext)

  const [documentData, setDocumentData] = useState([])
  const [activeTasks, setActiveTasks] = useState([])
  const [gamification, setGamification] = useState([])
  const [lastVisible, setLastVisible] = useState('')
  const [bestResult, setBestResult] = useState(0)
  const [isStreakModalVisible, setIsStreakModalVisible] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [canCreateTask, setCanCreateTask] = useState(false)
  const [createTaskModalVisible, setCreateTaskModalVisible] = useState(false)
  const isAllLoaded = useRef(false)

  const retrieveData = async () => {
    try {
      // Set State: Loading
      setRefreshing(true)
      console.log('Retrieving Data')
      // Cloud Firestore: Query
      let initialQuery
      if (!isFriendsOnly)
        initialQuery = await firestore()
          .collection('gamification')
          // .where('userId', '==', userId)
          .orderBy('overall', 'desc')
          .limit(limit)
      else if (isFriendsOnly)
        initialQuery = await firestore()
          .collection('gamification')
          .where('userId', 'in', [...user.followed, user.uid])
          .orderBy('overall', 'desc')
          .limit(limit)
      // else
      //   initialQuery = await firestore()
      //     .collection('gamification')
      //     .orderBy('postTime', 'desc')
      //     .limit(limit)
      // Cloud Firestore: Query Snapshot
      let documentSnapshots = await initialQuery.get()
      // Cloud Firestore: Document Data
      let documentLocalData = documentSnapshots.docs.map(document =>
        document.data(),
      )
      if (documentLocalData.length !== limit) isAllLoaded.current = true
      let lastLocalVisible =
        documentLocalData[documentLocalData.length - 1].postTime

      const userGamification = documentLocalData.find(
        el => el.userId === user.uid,
      )
      setGamification(userGamification)
      // Set State
      console.log(JSON.stringify(documentLocalData))

      setDocumentData(documentLocalData)
      setLastVisible(lastLocalVisible)
      setRefreshing(false)
      setBestResult(documentLocalData[0]?.overall)
    } catch (error) {
      console.log(error)
    }
  }
  const fetchUserTasks = useCallback(async () => {
    const list = []

    try {
      await firestore()
        .collection('activeTasks')
        .where(
          'creationDate',
          '>',
          firestore.Timestamp.fromDate(
            new Date(new Date().setDate(new Date().getDate() - 1)),
          ),
        )
        .where('userId', '==', user?.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            list.push({ ...doc.data(), id: doc.id })
          })
        })
      setActiveTasks(list)
    } catch (e) {
      console.log(e)
    }
  }, [user?.uid])

  const canUserCreateTask = useCallback(async () => {
    const list = []

    try {
      await firestore()
        .collection('activeTasks')
        .where(
          'creationDate',
          '>',
          firestore.Timestamp.fromDate(
            new Date(new Date().setDate(new Date().getDate() - 1)),
          ),
        )
        .where('taskCreator', '==', user?.uid)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            list.push({ ...doc.data(), id: doc.id })
          })
        })
      console.log('lista moich', list.length)
      if (list.length > 0) setCanCreateTask(false)
      else setCanCreateTask(true)
    } catch (e) {
      console.log(e)
    }
  }, [user?.uid])

  // const fetchUserGamification = useCallback(async () => {
  //   try {
  //     await firestore()
  //       .collection('gamification')
  //       .doc(user.uid)
  //       .get()
  //       .then(documentSnapshot => {
  //         if (documentSnapshot.exists) {
  //           setGamification(documentSnapshot.data())
  //         }
  //       })
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }, [user?.uid])

  const retrieveMore = async () => {
    if (!isAllLoaded.current) {
      try {
        setRefreshing(true)

        let additionalQuery
        if (userId)
          additionalQuery = await firestore()
            .collection('gamification')
            .where('userId', '==', userId)
            .orderBy('overall', 'desc')
            .startAfter(lastVisible)
            .limit(limit)
        else if (isFriendsOnly && user.followed?.length)
          additionalQuery = await firestore()
            .collection('gamification')
            .where('userId', 'in', user.followed)
            .orderBy('overall', 'desc')
            .startAfter(lastVisible)
            .limit(limit)
        else
          additionalQuery = await firestore()
            .collection('gamification')
            .orderBy('overall', 'desc')
            .startAfter(lastVisible)
            .limit(limit)

        // Cloud Firestore: Query Snapshot
        let documentSnapshots = await additionalQuery.get()
        // Cloud Firestore: Document Data
        let documentLocalData = documentSnapshots.docs.map(document =>
          document.data(),
        )
        if (documentLocalData.length !== limit) isAllLoaded.current = true
        console.log(JSON.stringify(documentLocalData))

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
  const receiveBonus = useCallback(() => {
    const bonusToAdd = (gamification.excerciseDayStreak + 1) * 1000
    const bonusToSet = gamification.dailyBonus + bonusToAdd
    firestore()
      .collection('gamification')
      .doc(user.uid)
      .update({
        dailyBonus: bonusToSet,
        overall: gamification.overall + bonusToAdd,
        loginBonusDate: firestore.Timestamp.fromDate(new Date()),
      })
      .then(() => {
        retrieveData()
      })
  }, [gamification, retrieveData])
  useEffect(() => {
    setDocumentData([])
    fetchUserTasks()
    // fetchUserGamification()
    setLastVisible('')
    canUserCreateTask()
    retrieveData()
  }, [])

  const renderFooter = useCallback(() => {
    const diffInTime =
      new Date().getTime() -
      gamification?.loginBonusDate?.toDate?.().getTime?.()

    // To calculate the no. of days between two dates
    const diffInDays = diffInTime / (1000 * 3600 * 24)

    return (
      <View style={{ marginHorizontal: 20 }}>
        {diffInDays > 1 ? (
          <Button
            onPress={() => {
              receiveBonus()
            }}
            labelStyle={styles.saveButtonLabel}
            mode="contained"
          >
            Receive today's bonus !
          </Button>
        ) : null}
        <Button
          onPress={() => {
            setIsStreakModalVisible(true)
          }}
          labelStyle={styles.saveButtonLabel}
          mode="contained"
        >
          Show active tasks
        </Button>
        {canCreateTask ? (
          <Button
            onPress={() => {
              setCreateTaskModalVisible(true)
            }}
            labelStyle={styles.saveButtonLabel}
            mode="contained"
          >
            Create new task
          </Button>
        ) : null}
      </View>
    )
  }, [refreshing, gamification, canCreateTask])

  const onRefresh = useCallback(() => {
    isAllLoaded.current = false
    retrieveData()
    fetchUserTasks()
    canUserCreateTask()
  }, [])

  return (
    <>
      <FlatList
        data={documentData}
        renderItem={({ item }) => (
          <LeaderboardResult
            gamification={item}
            currentUserId={user.uid}
            bestResult={bestResult}
          />
        )}
        keyExtractor={item => item.userId}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={renderFooter}
        onEndReached={retrieveMore}
        onEndReachedThreshold={0}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      <Modal
        isVisible={isStreakModalVisible}
        setVisible={setIsStreakModalVisible}
        closeLabel="Close"
      >
        {activeTasks.length > 0 ? (
          <ScrollView
            style={{ height: '100%', paddingVertical: 20 }}
            contentContainerStyle={{
              alignItems: 'center',
            }}
          >
            <>
              <Text variant="headlineMedium">Active tasks:</Text>
              {activeTasks.map(el => {
                return (
                  <TaskItem
                    task={{
                      completedTask: el,
                    }}
                    key={el.creationDate}
                  />
                )
              })}
            </>
          </ScrollView>
        ) : (
          <Text variant="headlineMedium" style={{ padding: 20 }}>
            You don't have any active tasks!
          </Text>
        )}
      </Modal>
      <CreateTaskModal
        setIsModalVisible={setCreateTaskModalVisible}
        isModalVisible={createTaskModalVisible}
        afterSaveCallback={() => {
          setCanCreateTask(false)
        }}
      />
    </>
  )
})

LeaderboardContainer.displayName = 'LeaderboardContainer'

export default LeaderboardContainer
