import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'

import Onboarding from 'react-native-onboarding-swiper'

interface dotsProps {
  selected: boolean
}

const Dots = ({ selected }: dotsProps) => {
  let backgroundColor

  backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)'

  return (
    <View
      style={{
        width: 6,
        height: 6,
        marginHorizontal: 3,
        backgroundColor,
      }}
    />
  )
}

const Skip = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Skip</Text>
  </TouchableOpacity>
)

const Next = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Next</Text>
  </TouchableOpacity>
)

const Done = ({ ...props }) => (
  <TouchableOpacity style={{ marginHorizontal: 10 }} {...props}>
    <Text style={{ fontSize: 16 }}>Done</Text>
  </TouchableOpacity>
)

const OnboardingScreen = ({ navigation }) => {
  return (
    <Onboarding
      SkipButtonComponent={Skip}
      NextButtonComponent={Next}
      DoneButtonComponent={Done}
      DotComponent={Dots}
      onSkip={() => navigation.replace('Login')}
      onDone={() => navigation.navigate('Login')}
      pages={[
        {
          backgroundColor: '#a6e4d0',
          image: <Image source={require('../Assets/Images/onboard1.png')} />,
          title: 'Workout Smart',
          subtitle: 'Keep track of your training sessions',
        },
        {
          backgroundColor: '#fdeb93',
          image: <Image source={require('../Assets/Images/onboard2.png')} />,
          title: 'Be Motivated',
          subtitle: 'See your progress in chosen excercises',
        },
        {
          backgroundColor: '#e9bcbe',
          image: <Image source={require('../Assets/Images/onboard3.png')} />,
          title: 'Become The Star',
          subtitle: 'Share Your training with friends and other users',
        },
      ]}
    />
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
