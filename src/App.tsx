import 'react-native-gesture-handler'
import React from 'react'
import './Translations'
import { AuthProvider } from './Components/Authentication/AuthProvider'
import ApplicationNavigator from './Navigators/Application'

const App = () => (
  <AuthProvider>
    <ApplicationNavigator />
  </AuthProvider>
)

export default App
