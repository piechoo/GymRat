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
            // Get the users ID token
            const { idToken } = await GoogleSignin.signIn()

            // Create a Google credential with the token
            const googleCredential = auth.GoogleAuthProvider.credential(idToken)

            // Sign-in the user with the credential
            await auth()
              .signInWithCredential(googleCredential)
              // Use it only when user Sign's up,
              // so create different social signup function
              .then(() => {
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
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
                        //ensure we catch any errors at this stage to advise us if something does go wrong
                        .catch(error => {
                          console.log(
                            'Something went wrong with added user to firestore: ',
                            error,
                          )
                        })
                    }
                  })
              })
              //we need to catch the whole sign up process if it fails too.
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
                //Once the user creation has happened successfully, we can add the currentUser into firestore
                //with the appropriate details.
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
                    auth().signInWithEmailAndPassword(email, password)
                  })
                  //ensure we catch any errors at this stage to advise us if something does go wrong
                  .catch(error => {
                    console.log(
                      'Something went wrong with added user to firestore: ',
                      error,
                    )
                  })
              })
              //we need to catch the whole sign up process if it fails too.
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
