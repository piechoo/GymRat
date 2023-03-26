import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import { Agenda, Calendar } from 'react-native-calendars'
import { useCallback } from 'react'
import { Portal, Provider, Text } from 'react-native-paper'
import { useFocusEffect } from '@react-navigation/native'
import Button from '../Components/Button'

const { height } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    height: height,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const StartWorkoutContainer = React.memo(({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const onSelectDate = useCallback(day => {
    setSelectedDate(day?.dateString)
  }, [])
  // useEffect(() => {
  //   navigation.addListener('focus', () => {
  //     setDisplayFab(true)
  //     console.log('sraka')
  //   })
  // }, [navigation])

  return (
    <View style={styles.container}>
      <Button
        onPress={() => {
          navigation.navigate('WorkoutCreator', {
            dayToCopy: selectedDate,
          })
        }}
      >
        <Text>Start new workout</Text>
      </Button>
      <Button
        onPress={() => {
          setShowCalendar(true)
        }}
      >
        <Text>Choose from day</Text>
      </Button>
      {showCalendar && (
        <Calendar
          markedDates={{
            '2012-05-16': {
              selected: true,
              marked: true,
              selectedColor: 'blue',
            },
            '2012-05-17': { marked: true },
            '2012-05-18': { marked: true, dotColor: 'red', activeOpacity: 0 },
            '2012-05-19': { disabled: true, disableTouchEvent: true },
          }}
          // Initially visible month. Default = now
          initialDate={'2012-03-01'}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={'2012-05-10'}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={'2012-05-30'}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={day => {
            console.log('selected day', day)
            onSelectDate(day)
            // open modal with short workout desc
          }}
          // Handler which gets executed on day long press. Default = undefined
          onDayLongPress={day => {
            console.log('selected day', day)
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          //   monthFormat={'yyyy MM'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={month => {
            console.log('month changed', month)
          }}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
          firstDay={1}
          // Show week numbers to the left. Default = false
          //   showWeekNumbers={true}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={true}
          // Enable the option to swipe between months. Default = false
          enableSwipeMonths={true}
        />
      )}
    </View>
  )
})

StartWorkoutContainer.displayName = 'AgendaContainer'

export default StartWorkoutContainer
