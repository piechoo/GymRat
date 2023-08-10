import React, { createContext, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
// import { LoginManager, AccessToken } from 'react-native-fbsdk'

type AuthContextType = {
  user?: string
  setUser?: Function
  login?: (email: string, password: string, fallback: () => void) => void
  register?: (
    email: string,
    password: string,
    fname: string,
    lname: string,
  ) => void
  googleLogin?: () => any
  logout?: () => any
}

export const AuthContext = createContext<AuthContextType>({})

type Props = {
  children: string | JSX.Element | JSX.Element[]
}
export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState('')

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (
          email: string,
          password: string,
          fallback: () => void,
        ) => {
          try {
            await auth().signInWithEmailAndPassword(email, password)
          } catch (e) {
            console.log(e)
            fallback()
          }
        },
        googleLogin: async () => {
          try {
            const { idToken } = await GoogleSignin.signIn()
            const googleCredential = auth.GoogleAuthProvider.credential(idToken)
            await auth()
              .signInWithCredential(googleCredential)
              .then(() => {
                const currentGoogleUser = auth().currentUser
                const firstName = currentGoogleUser?.displayName?.includes(' ')
                  ? currentGoogleUser?.displayName.split(' ')[0]
                  : currentGoogleUser?.displayName
                const lastName = currentGoogleUser?.displayName?.includes(' ')
                  ? currentGoogleUser?.displayName.split(' ')[1]
                  : 'Last Name'

                firestore()
                  .collection('users')
                  .doc(currentGoogleUser?.uid)
                  .get()
                  .then(documentSnapshot => {
                    if (!documentSnapshot.exists) {
                      firestore()
                        .collection('users')
                        .doc(currentGoogleUser?.uid)
                        .set({
                          fname: firstName,
                          lname: lastName,
                          email: currentGoogleUser?.email,
                          createdAt: firestore.Timestamp.fromDate(new Date()),
                          userImg: currentGoogleUser?.photoURL,
                        })
                        .catch(error => {
                          console.log(
                            'Something went wrong with added user to firestore: ',
                            error,
                          )
                        })

                      firestore()
                        .collection('gamification')
                        .doc(auth()?.currentUser?.uid)
                        .set({
                          userId: currentGoogleUser?.uid,
                          dailyBonus: 0,
                          excerciseDayStreak: 0,
                          friendBonus: 0,
                          lastExcerciseDay: firestore.Timestamp.fromDate(
                            new Date(),
                          ),
                          loginBonusDate: firestore.Timestamp.fromDate(
                            new Date(),
                          ),
                          tasksCompleted: 0,
                          totalLoad: 0,
                          overall: 0,
                        })
                    }
                  })
              })
              .catch(error => {
                console.log('Something went wrong with sign up: ', error)
              })
          } catch (error) {
            console.log({ error })
          }
        },
        register: async (
          email: string,
          password: string,
          fname: string = '',
          lname: string = '',
        ) => {
          try {
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                firestore()
                  .collection('users')
                  .doc(auth()?.currentUser?.uid)
                  .set({
                    fname: fname,
                    lname: lname,
                    email: email,
                    createdAt: firestore.Timestamp.fromDate(new Date()),
                    userImg: null,
                  })
                  .then(() => {
                    firestore()
                      .collection('gamification')
                      .doc(auth()?.currentUser?.uid)
                      .set({
                        userId: auth()?.currentUser?.uid,
                        dailyBonus: 0,
                        excerciseDayStreak: 0,
                        friendBonus: 0,
                        lastExcerciseDay: firestore.Timestamp.fromDate(
                          new Date(),
                        ),
                        loginBonusDate: firestore.Timestamp.fromDate(
                          new Date(),
                        ),
                        tasksCompleted: 0,
                        totalLoad: 0,
                        overall: 0,
                      })
                    auth().signInWithEmailAndPassword(email, password)
                  })
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    )
                  })
              })
              .catch(error => {
                console.log('Something went wrong with sign up: ', error)
              })
          } catch (e) {
            console.log(e)
          }
        },
        logout: async () => {
          try {
            await auth().signOut()
            setUser('')
          } catch (e) {
            console.log(e)
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
