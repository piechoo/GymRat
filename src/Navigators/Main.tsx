import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'
import { ProfileContainer } from '../Containers/ProfileContainer'
import FeedContainer from '../Containers/FeedContainer'
import { IconButton } from 'react-native-paper'
import Modal from '../Components/Modal'
import UsersList from '../Components/UsersList'
import { WorkoutContainer } from '../Containers'
import LeaderboardContainer from '../Containers/LeaderboardContainer'

const Tab = createBottomTabNavigator()

// @refresh reset
const MainNavigator = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      <Tab.Navigator
        tabBarOptions={{
          style: {
            backgroundColor: 'transparent',
          },
        }}
      >
        <Tab.Screen
          name="Feed"
          component={FeedContainer}
          options={{
            tabBarIconStyle: { display: 'none' },
            tabBarLabelPosition: 'beside-icon',
            headerRight: () => (
              <IconButton
                icon="magnify"
                size={30}
                onPress={() => setIsModalVisible(true)}
              />
            ),
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
        <Tab.Screen
          name="Leaderboard"
          component={LeaderboardContainer}
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
      <Modal
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        closeLabel="Close"
        shouldStretch
      >
        <UsersList setIsModalVisible={setIsModalVisible} />
      </Modal>
    </View>
  )
}

export default MainNavigator
