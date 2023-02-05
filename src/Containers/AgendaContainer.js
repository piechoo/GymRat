import React, { useState, useEffect } from 'react'
import { View, StyleSheet, FlatList, Text, Modal, Button } from 'react-native'

import { bodyParts } from '@/Store/Excercises/consts'
import ListItem from '@/Components/ListItem/ListItem'
import { Agenda } from 'react-native-calendars'
import WorkoutContainer from './WorkoutContainer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const AgendaContainer = () => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  return (
    <View style={styles.container}>
      <Agenda
        // The list of items that have to be displayed in agenda. If you want to render item as empty date
        // the value of date key has to be an empty array []. If there exists no value for date key it is
        // considered that the date in question is not yet loaded
        items={{
          '2022-02-02': [{ name: 'item 1 - any js object' }],
          '2023-02-02': [{ name: 'item 1 - any js object' }],
          '2023-02-03': [{ name: 'item 2 - any js object', height: 80 }],
          '2023-02-05': [
            { name: 'item 3 - any js object' },
            { name: 'any js object' },
          ],
          '2023-02-06': [
            { name: 'item 3 - any js object' },
            { name: 'any js object' },
          ],

          '2023-02-08': [
            { name: 'item 3 - any js object' },
            { name: 'any js object' },
          ],
          '2023-02-09': [
            { name: 'item 3 - any js object' },
            { name: 'any js object' },
          ],
          '2023-02-10': [
            { name: 'item 3 - any js object' },
            { name: 'any js object' },
          ],
        }}
        // renderEmptyDate={() => {
        //   console.log(selectedDate)
        //   return (
        //     <View>
        //       <Text>DUPA</Text>
        //     </View>
        //   )
        // }}
        renderEmptyData={() => {
          console.log(selectedDate)

          return (
            <View>
              <WorkoutContainer date={selectedDate?.dateString} />
              {/* <Text style={{ color: 'black' }}>DUPppA</Text> */}
            </View>
          )
        }}
        // Callback that gets called when items for a certain month should be loaded (month became visible)
        // loadItemsForMonth={month => {
        //   console.log('trigger items loading')
        // }}
        // // Callback that fires when the calendar is opened or closed
        // onCalendarToggled={calendarOpened => {
        //   console.log(calendarOpened)
        // }}
        // // Callback that gets called on day press
        onDayPress={day => {
          setSelectedDate(day)
        }}
        // // Callback that gets called when day changes while scrolling agenda list
        // onDayChange={day => {
        //   console.log('day changed')
        // }}
        // // Initially selected day
        // selected={'2012-05-16'}
        // // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
        // minDate={'2012-05-10'}
        // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
        // maxDate={'2012-05-30'}
        // // Max amount of months allowed to scroll to the past. Default = 50
        // pastScrollRange={50}
        // // Max amount of months allowed to scroll to the future. Default = 50
        // futureScrollRange={50}
        // // Specify how each item should be rendered in agenda
        // renderItem={(item, firstItemInDay) => {
        //   return <View />
        // }}
        // // Specify how each date should be rendered. day can be undefined if the item is not first in that day
        // renderDay={(day, item) => {
        //   return <View />
        // }}
        // // Specify how empty date content with no items should be rendered
        // renderEmptyDate={() => {
        //   return <View />
        // }}
        // // Specify how agenda knob should look like
        // renderKnob={() => {
        //   return <View />
        // }}
        // // Override inner list with a custom implemented component
        // renderList={listProps => {
        //   console.log(listProps.selectedDay.toString())
        //   return (
        //     <>
        //       <FlatList
        //         data={Object.values(listProps.items)}
        //         renderItem={({ item }) =>
        //           item.map(element => <ListItem item={element.name} />)
        //         }
        //       />
        //       <Button title="Press me" onPress={() => setModalVisible(true)} />
        //     </>
        //   )
        // }}
        // // Specify what should be rendered instead of ActivityIndicator
        // renderEmptyData={() => {
        //   return <View />
        // }}
        // // Specify your item comparison function for increased performance
        // rowHasChanged={(r1, r2) => {
        //   return r1.text !== r2.text
        // }}
        // // Hide knob button. Default = false
        // hideKnob={true}
        // // When `true` and `hideKnob` prop is `false`, the knob will always be visible and the user will be able to drag the knob up and close the calendar. Default = false
        // showClosingKnob={false}
        // // By default, agenda dates are marked if they have at least one item, but you can override this if needed
        // markedDates={{
        //   '2012-05-16': { selected: true, marked: true },
        //   '2012-05-17': { marked: true },
        //   '2012-05-18': { disabled: true },
        // }}
        // // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
        // disabledByDefault={true}
        // // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly
        // onRefresh={() => console.log('refreshing...')}
        // // Set this true while waiting for new data from a refresh
        // refreshing={false}
        // // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView
        refreshControl={null}
        // // Agenda theme
        // theme={{
        //   // ...calendarTheme,
        //   agendaDayTextColor: 'yellow',
        //   agendaDayNumColor: 'green',
        //   agendaTodayColor: 'red',
        //   agendaKnobColor: 'blue',
        // }}
        // // Agenda container style
        // style={{}}
      />

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(true)}
      >
        <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', flex: 1 }}>
          <View style={{ backgroundColor: 'orange', padding: 40, margin: 80 }}>
            <Text>This is a modal</Text>
            <Button title="close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default AgendaContainer
