import React, { useContext, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native'
import { HelperText, TextInput } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import SocialButton from '../Components/SocialButton'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import Logo from '../Components/Logo'
import Button from '../Components/Button'

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isErrorVisible, setIsErrorVisible] = useState(false)

  const { login, googleLogin } = useContext(AuthContext)
  const { t } = useTranslation()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Logo />

      <Text style={styles.text}>Gym Rat</Text>

      {/* <TextInput
        label="Email input"
        placeholder="Email"
        value={email}
        onChangeText={userEmail => setEmail(userEmail)}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        right={<TextInput.Icon icon="account" />}
      /> */}
      <TextInput
        style={{ width: '100%' }}
        label="Email"
        placeholder="Email"
        value={email}
        onChangeText={userEmail => {
          setEmail(userEmail)
          setIsErrorVisible(false)
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        right={<TextInput.Icon icon="account" />}
      />
      <View style={styles.divider} />

      <TextInput
        style={{ width: '100%' }}
        label="Password"
        placeholder="Password"
        value={password}
        onChangeText={userPassword => {
          setPassword(userPassword)
          setIsErrorVisible(false)
        }}
        autoCorrect={false}
        secureTextEntry={true}
      />
      <HelperText type="error" visible={isErrorVisible}>
        {t(`Please fill required data`)}
      </HelperText>

      <Button
        mode="elevated"
        onPress={() => {
          if (!email || !password) setIsErrorVisible(true)
          else login?.(email, password)
        }}
      >
        {t(`Sign In`)}
      </Button>

      <Button
        mode="elevated"
        onPress={() => googleLogin?.()}
        buttonColor="#f5e7ea"
        textColor="#de4d41"
        icon="google"
      >
        {'Sign In with Google'}
      </Button>

      <Button onPress={() => navigation.navigate('Signup')}>
        {"Don't have an acount? Create here"}
      </Button>
    </ScrollView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    // color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  button: {
    marginTop: 15,
    width: '100%',
    borderRadius: 5,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  divider: { padding: 5 },
})
