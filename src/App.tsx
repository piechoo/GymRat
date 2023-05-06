import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import './Translations'
import { AuthProvider } from './Components/Authentication/AuthProvider'
import ApplicationNavigator from './Navigators/Application'

const App = () => (
  <AuthProvider>
    <ApplicationNavigator />
  </AuthProvider>
)

export default App
