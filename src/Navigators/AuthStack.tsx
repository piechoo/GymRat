import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { IconButton } from 'react-native-paper'
import LoginScreen from '../Containers/LoginContainer'
import SignupScreen from '../Containers/Signup'
import OnboardingScreen from '../Containers/Onboarding'

const Stack = createStackNavigator()

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | never>(null)
  let routeName

  useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value == null) {
        AsyncStorage.setItem('alreadyLaunched', 'true')
        setIsFirstLaunch(true)
      } else {
        setIsFirstLaunch(false)
      }
    })

    GoogleSignin.configure({
      webClientId:
        '999882760125-j3rhgi2jsbvefp4dbni2buii9pngvqd7.apps.googleusercontent.com',
    })
  }, [])

  if (isFirstLaunch === null) {
    return null
  } else if (isFirstLaunch == true) {
    routeName = 'Onboarding'
  } else {
    routeName = 'Login'
  }

  return (
    <Stack.Navigator initialRouteName={routeName}>
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ header: () => null }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={({ navigation }) => ({
          title: '',
          headerStyle: {
            elevation: 0,
          },
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <IconButton
                icon="arrow-left"
                size={25}
                onPress={() => navigation.navigate('Login')}
              />
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  )
}

export default AuthStack
