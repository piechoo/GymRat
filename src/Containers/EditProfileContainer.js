import React, { useEffect, useContext, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Animated from 'react-native-reanimated'
import BottomSheet from 'reanimated-bottom-sheet'
import ImagePicker from 'react-native-image-crop-picker'

import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { Button } from 'react-native-paper'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import { useTranslation } from 'react-i18next'

const EditProfileScreen = () => {
  const { user } = useContext(AuthContext)
  const [image, setImage] = useState(null)
  // const [uploading, setUploading] = useState(false)
  // const [transferred, setTransferred] = useState(0)
  const [userData, setUserData] = useState(null)
  const { t } = useTranslation()

  const uploadImage = useCallback(async () => {
    if (image == null) {
      return null
    }
    const uploadUri = image
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1)

    // Add timestamp to File Name
    const extension = filename.split('.').pop()
    const name = filename.split('.').slice(0, -1).join('.')
    filename = name + Date.now() + '.' + extension

    // setUploading(true)
    // setTransferred(0)

    const storageRef = storage().ref(`photos/${filename}`)
    const task = storageRef.putFile(uploadUri)

    // Set transferred state
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      )

      // setTransferred(
      //   Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
      //     100,
      // )
    })

    try {
      await task

      const url = await storageRef.getDownloadURL()

      // setUploading(false)
      setImage(null)

      Alert.alert(
        'Image uploaded!',
        'Your image has been updated Successfully!',
      )
      return url
    } catch (e) {
      console.log(e)
      return null
    }
  }, [])

  const handleUpdate = useCallback(async () => {
    let imgUrl = await uploadImage()

    if (imgUrl == null && userData.userImg) {
      imgUrl = userData.userImg
    }

    firestore()
      .collection('users')
      .doc(user.uid)
      .update({
        fname: userData.fname ?? '',
        lname: userData.lname ?? '',
        about: userData.about ?? '',
        phone: userData.phone ?? '',
        country: userData.country ?? '',
        city: userData.city ?? '',
        userImg: imgUrl ?? '',
      })
      .then(() => {
        console.log('User Updated!')
        Alert.alert(
          'Profile Updated!',
          'Your profile has been updated successfully.',
        )
      })
  }, [user.uid, uploadImage])

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image)
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path
      setImage(imageUri)
      this.bs.current.snapTo(1)
    })
  }

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
    }).then(image => {
      console.log(image)
      const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path
      setImage(imageUri)
      this.bs.current.snapTo(1)
    })
  }

  renderInner = () => (
    <View style={styles.panel}>
      <View style={styles.centeredContainer}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
      </View>
      <Button
        mode="elevated"
        style={styles.button}
        onPress={takePhotoFromCamera}
      >
        {t(`Take Photo`)}
      </Button>
      <Button
        mode="elevated"
        style={styles.button}
        onPress={choosePhotoFromLibrary}
      >
        {t(`Choose From Library`)}
      </Button>
      <Button
        mode="elevated"
        style={styles.button}
        onPress={() => this.bs.current.snapTo(1)}
      >
        {t(`Cancel`)}
      </Button>
    </View>
  )

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  )

  bs = React.createRef()
  fall = new Animated.Value(1)

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={this.bs}
        snapPoints={[330, -5]}
        renderContent={this.renderInner}
        renderHeader={this.renderHeader}
        initialSnap={1}
        callbackNode={this.fall}
        enabledGestureInteraction={true}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(this.fall, 1.0)),
        }}
      >
        <View style={styles.centeredContainer}>
          <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
            <View style={styles.imageContainer}>
              <ImageBackground
                source={
                  userData?.userImg
                    ? {
                        uri: userData.userImg,
                      }
                    : require('../Assets/Images/avatar.png')
                }
                style={{ height: 100, width: 100 }}
                imageStyle={{ borderRadius: 15 }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera"
                    size={35}
                    color="#fff"
                    style={styles.cameraIcon}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>
            {userData ? userData.fname : ''} {userData ? userData.lname : ''}
          </Text>
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="First Name"
            autoCorrect={false}
            value={userData ? userData.fname : ''}
            onChangeText={txt => setUserData({ ...userData, fname: txt })}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <FontAwesome name="user-o" size={20} />
          <TextInput
            placeholder="Last Name"
            value={userData ? userData.lname : ''}
            onChangeText={txt => setUserData({ ...userData, lname: txt })}
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <Ionicons name="ios-clipboard-outline" size={20} />
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="About Me"
            value={userData ? userData.about : ''}
            onChangeText={txt => setUserData({ ...userData, about: txt })}
            autoCorrect={true}
            style={[styles.textInput, { height: 40 }]}
          />
        </View>
        <Button mode="outlined" style={styles.button} onPress={handleUpdate}>
          {t(`Update`)}
        </Button>
      </Animated.View>
    </View>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({
  centeredContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  userName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 100,
    width: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    opacity: 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  panel: {
    padding: 20,
    paddingTop: 20,
    width: '100%',
  },
  header: {
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
  },
  button: {
    marginTop: 15,
    width: '100%',
    borderRadius: 5,
  },
})
