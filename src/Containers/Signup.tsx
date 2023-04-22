import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { HelperText, TextInput } from 'react-native-paper'
import { AuthContext } from '../Components/Authentication/AuthProvider'
import Button from '../Components/Button'

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fname, setFname] = useState('')
  const [lname, setLname] = useState('')
  const [isErrorVisible, setIsErrorVisible] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')

  const { register, googleLogin } = useContext(AuthContext)
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>

      <View style={styles.modalContent}>
        <TextInput
          label="First Name"
          placeholder="First Name"
          value={fname}
          onChangeText={userEmail => {
            setFname(userEmail)
            setIsErrorVisible(false)
          }}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <View style={styles.divider} />
        <TextInput
          label="Last Name"
          placeholder="First Name"
          value={lname}
          onChangeText={userEmail => {
            setLname(userEmail)
            setIsErrorVisible(false)
          }}
          autoCapitalize="words"
          autoCorrect={false}
        />
        <View style={styles.divider} />
        <TextInput
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
          // right={<TextInput.Icon icon="account" />}
        />
        <View style={styles.divider} />

        <TextInput
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
        <View style={styles.divider} />

        <TextInput
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={userPassword => {
            setConfirmPassword(userPassword)
            setIsErrorVisible(false)
          }}
          autoCorrect={false}
          secureTextEntry={true}
        />
        <View style={styles.divider} />
      </View>
      <HelperText type="error" visible={isErrorVisible}>
        {t(`Please fill required data`)}
      </HelperText>
      <Button
        mode="elevated"
        onPress={() => {
          if (
            !email ||
            !password ||
            password != confirmPassword ||
            !lname ||
            !fname
          ) {
            console.log(password)
            console.log(confirmPassword)
            console.log(password != confirmPassword)

            setIsErrorVisible(true)
          } else register?.(email, password, fname, lname)
        }}
      >
        {t(`Sign Up`)}
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

      <Button onPress={() => navigation.navigate('Login')}>
        {'Have an account? Sign In'}
      </Button>

      {/* <View style={styles.textPrivate}>
        <Text style={styles.color_textPrivate}>
          By registering, you confirm that you accept our{' '}
        </Text>
        <TouchableOpacity onPress={() => alert('Terms Clicked!')}>
          <Text style={[styles.color_textPrivate, { color: '#de4d41' }]}>
            Terms of service
          </Text>
        </TouchableOpacity>
        <Text style={styles.color_textPrivate}> and </Text>
        <Text style={[styles.color_textPrivate, { color: '#de4d41' }]}>
          Privacy Policy
        </Text>
      </View> */}
    </View>
  )
}

export default SignupScreen

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
  textPrivate: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 35,
    justifyContent: 'center',
  },
  color_textPrivate: {
    fontSize: 13,
    fontWeight: '400',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
  modalContent: { paddingHorizontal: 10, width: '100%' },
  divider: { padding: 5 },
  button: {
    marginTop: 15,
    width: '100%',
    borderRadius: 5,
  },
})
