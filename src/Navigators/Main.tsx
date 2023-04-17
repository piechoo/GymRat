import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  AgendaContainer,
  ExampleContainer,
  ExcercisesListContainer,
  WorkoutContainer,
} from '@/Containers'
import { View } from 'react-native'
import { ProfileContainer } from '../Containers/ProfileContainer'
import StartWorkoutContainer from '../Containers/StartWorkoutContainer'
import FeedContainer from '../Containers/FeedContainer'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = ({ navigation }) => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Tab.Navigator>
        {/* <Tab.Screen
          name="Home"
          component={ExampleContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        /> */}

        {/* <Tab.Screen
          name="Bodyparts"
          component={ExcercisesListContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        /> */}
        <Tab.Screen
          name="Feed"
          component={FeedContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        />
        <Tab.Screen
          name="Agenda"
          component={StartWorkoutContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        />
      </Tab.Navigator>
    </View>
  )
}

export default MainNavigator
