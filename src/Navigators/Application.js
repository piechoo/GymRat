import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView, StatusBar, View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { StartupContainer } from '@/Containers'
import { useTheme } from '@/Hooks'
import MainNavigator from './Main'
import { navigationRef } from './utils'
import { Provider } from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import AuthStack from './AuthStack'
import EditProfileScreen from '../Containers/EditProfileContainer'
import { WorkoutContainer } from '../Containers'
import firestore from '@react-native-firebase/firestore'

const Stack = createStackNavigator()

const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme()
  const { colors } = NavigationTheme

  const { user, setUser } = useContext(AuthContext)
  const [initializing, setInitializing] = useState(true)

  const onAuthStateChanged = async user => {
    if (user) {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            const { followed, followedBy, bestLifts } = documentSnapshot.data()
            setUser?.({ ...user._user, followed, followedBy, bestLifts })
          }
        })
    }

    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
    return subscriber
  }, [])

  if (initializing) return null

  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Provider>
          {!user ? (
            <AuthStack />
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Startup" component={StartupContainer} />
              <Stack.Screen
                name="Main"
                component={MainNavigator}
                options={{
                  animationEnabled: false,
                }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{
                  animationEnabled: false,
                }}
              />
              <Stack.Screen
                name="WorkoutCreator"
                component={WorkoutContainer}
                options={{
                  animationEnabled: false,
                }}
              />
            </Stack.Navigator>
          )}
        </Provider>
      </NavigationContainer>
    </SafeAreaView>
  )
}

export default ApplicationNavigator
