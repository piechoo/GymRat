import React, { useState, useContext, useCallback } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'

import firestore from '@react-native-firebase/firestore'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import { useTranslation } from 'react-i18next'
import Button from '../Components/Button'
import FeedContainer from './FeedContainer'
import { useFocusEffect } from '@react-navigation/native'
import Modal from '../Components/Modal'
import UsersList from '../Components/UsersList'

export const ProfileContainer = ({ navigation, route }) => {
  const { user, logout, setUser } = useContext(AuthContext)
  const { t } = useTranslation()
  const [modalTitle, setModalTitle] = useState('')
  const [userData, setUserData] = useState(null)
  const [selectedUserIds, setSelectedUserIds] = useState(null)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [userWorkoutCount, setUserWorkoutCount] = useState(null)

  const getUser = useCallback(() => {
    return firestore()
      .collection('users')
      .doc(route.params?.userId ? route.params.userId : user.uid)
      .onSnapshot(documentSnapshot => {
        if (documentSnapshot?.exists) {
          setUserData(documentSnapshot.data())
        }
      })
  }, [route.params?.userId, user.uid])

  const getWorkoutCount = useCallback(() => {
    return firestore()
      .collection('workouts')
      .where(
        'userId',
        '==',
        route.params?.userId ? route.params.userId : user.uid,
      )
      .count()
      .get()
      .then(documentSnapshot => {
        const userWrks = documentSnapshot.data().count
        setUserWorkoutCount(userWrks)
      })
  }, [route.params?.userId, user.uid])

  useFocusEffect(
    React.useCallback(() => {
      const subscriber = getUser()
      getWorkoutCount()

      return () => {
        subscriber()
      }
    }, [route.params?.userId, user.uid]),
  )

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        navigation.setParams({ userId: null })
        setUserData({})
      }
    }, []),
  )

  const handleFollow = useCallback(async () => {
    if (route.params?.userId) {
      if (!user?.followed?.includes?.(route.params?.userId)) {
        firestore()
          .collection('users')
          .doc(route.params.userId)
          .update({
            followedBy: firestore.FieldValue.arrayUnion(user.uid),
          })
        firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            followed: firestore.FieldValue.arrayUnion(route.params.userId),
          })
        setUser({
          ...user,
          followed: [...user.followed, route.params.userId],
        })
      } else {
        firestore()
          .collection('users')
          .doc(route.params.userId)
          .update({
            followedBy: firestore.FieldValue.arrayRemove(user.uid),
          })
        firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            followed: firestore.FieldValue.arrayRemove(route.params.userId),
          })
        setUser({
          ...user,
          followed: user.followed.filter(usr => usr !== route.params.userId),
        })
      }
    }
  }, [route.params?.userId, user])

  const headerComponent = (
    <View style={styles.container}>
      <Image
        style={styles.userImg}
        source={
          userData?.userImg
            ? {
                uri: userData.userImg,
              }
            : require('../Assets/Images/avatar.png')
        }
      />
      <Text style={styles.userName}>
        {userData ? userData.fname || 'New' : 'New'}{' '}
        {userData ? userData.lname || 'User' : 'User'}
      </Text>
      {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
      <Text style={styles.aboutUser}>
        {userData ? userData.about || 'No details added.' : ''}
      </Text>
      <View style={styles.userBtnWrapper}>
        {route.params?.userId && route.params?.userId !== user.uid ? (
          <>
            <Button
              mode="outlined"
              width={'40%'}
              fullWidth={false}
              onPress={handleFollow}
            >
              {t(
                !user?.followed?.includes?.(route.params.userId)
                  ? `Follow`
                  : 'Unfollow',
              )}
            </Button>
          </>
        ) : (
          <>
            <Button
              mode="outlined"
              fullWidth={false}
              width={'40%'}
              onPress={() => {
                navigation.navigate('EditProfile')
              }}
            >
              {t(`Edit`)}
            </Button>
            <Button
              width={'40%'}
              mode="outlined"
              fullWidth={false}
              onPress={() => {
                logout()
              }}
            >
              {t(`Logout`)}
            </Button>
          </>
        )}
      </View>

      <View style={styles.userInfoWrapper}>
        <View style={styles.userInfoItem}>
          <Text style={styles.userInfoTitle}>{userWorkoutCount ?? 0}</Text>
          <Text style={styles.userInfoSubTitle}>Workouts</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setSelectedUserIds(userData?.followedBy)
            setIsModalVisible(true)
            setModalTitle('Followers')
          }}
        >
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>
              {userData?.followedBy?.length ?? 0}
            </Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedUserIds(userData?.followed)
            setIsModalVisible(true)
            setModalTitle('Following')
          }}
        >
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>
              {userData?.followed?.length ?? 0}
            </Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.safeArea}>
      <FeedContainer
        headerComponent={headerComponent}
        navigation={navigation}
        userId={route.params?.userId ? route.params.userId : user.uid}
      />

      <Modal
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        closeLabel="Close"
        shouldStretch
      >
        <UsersList
          setIsModalVisible={setIsModalVisible}
          selectedUsersIds={selectedUserIds}
          title={modalTitle}
        />
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  userImg: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  aboutUser: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  userBtnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  userBtn: {
    borderColor: '#2e64e5',
    borderWidth: 2,
    borderRadius: 3,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 5,
  },
  userBtnTxt: {
    color: '#2e64e5',
  },
  userInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  userInfoItem: {
    justifyContent: 'center',
  },
  userInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userInfoSubTitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 5,
    marginHorizontal: 5,
    width: '40%',
    borderRadius: 5,
  },
})
