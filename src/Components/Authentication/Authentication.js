import React, { useState } from 'react'
import { Button, Image, Text, TouchableOpacity, View } from 'react-native'
import auth from '@react-native-firebase/auth'
import { useTheme } from '@/Hooks'
import { signIn } from './utils'

export function Authentication() {
  const [authenticated, setAuthenticated] = useState(false)
  const { Common, Fonts, Gutters, Layout } = useTheme()

  auth().onAuthStateChanged(user => {
    if (user) {
      setAuthenticated(true)
    } else {
      setAuthenticated(false)
    }
  })

  if (authenticated) {
    const user = auth().currentUser
    return (
      <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
        <Text style={Fonts.titleRegular}>You're Logged In</Text>
        <Image
          source={{ uri: user?.photoURL }}
          style={{
            height: 80,
            width: 80,
          }}
        />
        <Text style={Fonts.textRegular}>{user?.displayName}</Text>
        <Text style={Fonts.textRegular}>{user?.email}</Text>
        <View style={{ marginTop: 30 }}>
          <TouchableOpacity
            style={[Common.button.outlineRounded, Gutters.regularBMargin]}
            onPress={() => auth().signOut()}
          >
            <Text style={Fonts.textRegular}>Signout</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  return (
    <View style={[[Layout.colCenter, Gutters.smallHPadding]]}>
      <Button
        title="Facebook Sign-In"
        onPress={() =>
          signIn().then(() => console.log('Signed in with Facebook!'))
        }
      />
    </View>
  )
}
