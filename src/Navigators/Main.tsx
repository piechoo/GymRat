import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  AgendaContainer,
  ExampleContainer,
  ExcercisesListContainer,
  WorkoutContainer,
} from '@/Containers'
import { Authentication } from '@/Components/Authentication/Authentication'
import { View } from 'react-native'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={ExampleContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        />
        <Tab.Screen
          name="Login"
          component={Authentication}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        />
        <Tab.Screen
          name="Bodyparts"
          component={ExcercisesListContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        />
        <Tab.Screen
          name="Agenda"
          component={AgendaContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
          }}
        />
        <Tab.Screen
          name="Workout"
          component={WorkoutContainer}
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
