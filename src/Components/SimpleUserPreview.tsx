import React, { memo, useState, useEffect, useCallback } from 'react'
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { Text } from 'react-native-paper'
import { navigate } from '../Navigators/utils'
import firestore from '@react-native-firebase/firestore'

interface Props {
  userId: string
  date?: string
  size?: UserPreviewSize
  disabled?: boolean
}

export enum UserPreviewSize {
  small = 1,
  medium = 2,
  big = 3,
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageMedium: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
  imageSmall: {
    height: 25,
    width: 25,
    borderRadius: 25,
  },
  labelsContainer: { flexDirection: 'column', paddingLeft: 10 },
})

const SimpleUserPreview = memo(
  ({ userId, date, size = UserPreviewSize.medium, disabled }: Props) => {
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

    const onPress = useCallback(() => {
      navigate('Profile', {
        userId: userId,
      })
    }, [userId])

    return (
      <View style={size == UserPreviewSize.medium ? styles.container : null}>
        <TouchableOpacity
          onPress={onPress}
          style={styles.button}
          disabled={disabled}
        >
          <Image
            style={
              size == UserPreviewSize.medium
                ? styles.imageMedium
                : size == UserPreviewSize.small
                ? styles.imageSmall
                : undefined
            }
            source={
              userData?.userImg
                ? {
                    uri: userData?.userImg,
                  }
                : require('../Assets/Images/avatar.png')
            }
          />
          <View style={styles.labelsContainer}>
            <Text
              variant={
                size == UserPreviewSize.medium ? 'titleLarge' : 'bodyMedium'
              }
            >
              {userData?.fname} {userData?.lname}
            </Text>
            {date && <Text variant="labelSmall">{date}</Text>}
          </View>
        </TouchableOpacity>
      </View>
    )
  },
)

SimpleUserPreview.displayName = 'Modal'
export default SimpleUserPreview
