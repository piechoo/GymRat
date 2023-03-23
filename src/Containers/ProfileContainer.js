// import React, { useState } from 'react'
// import { Button, Image, Text, TouchableOpacity, View } from 'react-native'
// import auth from '@react-native-firebase/auth'
// import { useTheme } from '@/Hooks'

// export function ProfileContainer() {
//   const [authenticated, setAuthenticated] = useState(false)

//   const { Common, Fonts, Gutters, Layout } = useTheme()

//   auth().onAuthStateChanged(user => {
//     if (user) {
//       setAuthenticated(true)
//     } else {
//       setAuthenticated(false)
//     }
//   })

//   const user = auth().currentUser
//   return (
//     <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
//       <Text style={Fonts.titleRegular}>You're Logged In</Text>
//       <Image
//         source={{ uri: user?.photoURL }}
//         style={{
//           height: 80,
//           width: 80,
//         }}
//       />
//       <Text style={Fonts.textRegular}>{user?.displayName}</Text>
//       <Text style={Fonts.textRegular}>{user?.email}</Text>
//       <View style={{ marginTop: 30 }}>
//         <TouchableOpacity
//           style={[Common.button.outlineRounded, Gutters.regularBMargin]}
//           onPress={() => auth().signOut()}
//         >
//           <Text style={Fonts.textRegular}>Signout</Text>
//         </TouchableOpacity>
//         {/* <TouchableOpacity
//             style={[Common.button.outlineRounded, Gutters.regularBMargin]}
//             onPress={() => getFriends(user.uid, authToken)}
//           >
//             <Text style={Fonts.textRegular}>Get Friends</Text>
//           </TouchableOpacity> */}
//       </View>
//     </View>
//   )
// }

import React, { useState, useEffect, useContext } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native'
// import FormButton from '../components/FormButton'

import firestore from '@react-native-firebase/firestore'
// import PostCard from '../components/PostCard'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import { useTranslation } from 'react-i18next'
import Button from '../Components/Button'

export const ProfileContainer = ({ navigation, route }) => {
  const { user, logout } = useContext(AuthContext)
  const { t } = useTranslation()

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleted, setDeleted] = useState(false)
  const [userData, setUserData] = useState(null)

  const fetchPosts = async () => {
    try {
      const list = []

      await firestore()
        .collection('posts')
        .where('userId', '==', route.params ? route.params.userId : user.uid)
        .orderBy('postTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total Posts: ', querySnapshot.size);

          querySnapshot.forEach(doc => {
            const { userId, post, postImg, postTime, likes, comments } =
              doc.data()
            list.push({
              id: doc.id,
              userId,
              userName: 'Test Name',
              userImg:
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
              postTime: postTime,
              post,
              postImg,
              liked: false,
              likes,
              comments,
            })
          })
        })

      setPosts(list)

      if (loading) {
        setLoading(false)
      }

      console.log('Posts: ', posts)
    } catch (e) {
      console.log(e)
    }
  }

  const getUser = async () => {
    await firestore()
      .collection('users')
      .doc(route.params ? route.params.userId : user.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          console.log('User Data', documentSnapshot.data())
          setUserData(documentSnapshot.data())
        }
      })
  }

  useEffect(() => {
    getUser()
    fetchPosts()
    navigation.addListener('focus', () => setLoading(!loading))
  }, [navigation, loading])

  const handleDelete = () => {}

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          style={styles.userImg}
          source={{
            uri: userData
              ? userData.userImg ||
                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
              : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
          }}
        />
        <Text style={styles.userName}>
          {userData ? userData.fname || 'Test' : 'Test'}{' '}
          {userData ? userData.lname || 'User' : 'User'}
        </Text>
        {/* <Text>{route.params ? route.params.userId : user.uid}</Text> */}
        <Text style={styles.aboutUser}>
          {userData ? userData.about || 'No details added.' : ''}
        </Text>
        <View style={styles.userBtnWrapper}>
          {route.params ? (
            <>
              <Button
                mode="outlined"
                width={'40%'}
                fullWidth={false}
                onPress={() => {}}
              >
                {t(`Message`)}
              </Button>
              <Button
                mode="outlined"
                width={'40%'}
                fullWidth={false}
                onPress={() => {}}
              >
                {t(`Follow`)}
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
                onPress={() => logout()}
              >
                {t(`Logout`)}
              </Button>
            </>
          )}
        </View>

        <View style={styles.userInfoWrapper}>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>{posts.length}</Text>
            <Text style={styles.userInfoSubTitle}>Workouts</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>10,000</Text>
            <Text style={styles.userInfoSubTitle}>Followers</Text>
          </View>
          <View style={styles.userInfoItem}>
            <Text style={styles.userInfoTitle}>100</Text>
            <Text style={styles.userInfoSubTitle}>Following</Text>
          </View>
        </View>

        {/* {posts.map(item => (
          <PostCard key={item.id} item={item} onDelete={handleDelete} />
        ))} */}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
