import React, { memo, useState, useEffect, useCallback } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { navigate } from '../Navigators/utils'
import firestore from '@react-native-firebase/firestore'

interface Props {
  userId: string
  date: string
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  labelsContainer: { flexDirection: 'column', paddingLeft: 10 },
})

const SimpleUserPreview = memo(({ userId, date }: Props) => {
  const [userData, setUserData] = useState({})

  const getUser = useCallback(async () => {
    await firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
        }
      })
  }, [userId])

  useEffect(() => {
    if (userId) {
      getUser()
    }
  }, [userId])

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() =>
          navigate('Profile', {
            userId: userId,
          })
        }
        style={styles.button}
      >
        <Image
          style={styles.image}
          source={
            userData?.userImg
              ? {
                  uri: userData?.userImg,
                }
              : require('../Assets/Images/avatar.png')
          }
        />
        <View style={styles.labelsContainer}>
          <Text variant="titleLarge">
            {userData?.fname} {userData?.lname}
          </Text>
          {date && <Text variant="labelSmall">{date}</Text>}
        </View>
      </TouchableOpacity>
    </View>
  )
})

SimpleUserPreview.displayName = 'Modal'
export default SimpleUserPreview
