import 'react-native-gesture-handler'
import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '@/Store'
import ApplicationNavigator from '@/Navigators/Application'
import './Translations'
import { AuthProvider } from './Components/Authentication/AuthProvider'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <AuthProvider>
        <ApplicationNavigator />
      </AuthProvider>
    </PersistGate>
  </Provider>
)

export default App
