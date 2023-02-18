import React, { useState, useEffect } from 'react'
import {
  View,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Brand } from '@/Components'
import { useTheme } from '@/Hooks'
import { changeTheme } from '@/Store/Theme'
import { getBodypartExcercises } from '@/Store/Excercises'
import { bodyParts, excercises } from '@/Store/Excercises/consts'
import ListItem from '@/Components/ListItem/ListItem'
import { Appbar, List } from 'react-native-paper'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

const ExcercisesList = ({
  setSelectedExcercises,
  selectedExcercises,
  setIsModalVisible,
}) => {
  const [selectedBodypart, setSelectedBodypart] = useState(null)
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
      <Appbar.Header>
        {selectedBodypart ? (
          <Appbar.BackAction
            onPress={() => {
              setSelectedBodypart(null)
            }}
          />
        ) : (
          <Appbar.BackAction
            onPress={() => {
              setIsModalVisible(false)
            }}
          />
        )}
        <Appbar.Content
          title={
            selectedBodypart ? t(`bodyparts.${selectedBodypart}`) : 'Bodyparts'
          }
        />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      {!selectedBodypart && (
        <FlatList
          data={Object.values(bodyParts)}
          renderItem={({ item }) => (
            // <ListItem
            //   item={item}
            //   title={t(`bodyparts.${item}`)}
            //   onClick={setSelectedBodypart}
            // />
            <List.Item
              title={t(`bodyparts.${item}`)}
              description={`${excercises[item]?.length} excercises`}
              left={props => <List.Icon {...props} icon="folder" />}
              onPress={() => {
                setSelectedBodypart(item)
              }}
            />
          )}
        />
      )}
      {selectedBodypart && (
        <FlatList
          data={excercises[selectedBodypart]}
          renderItem={({ item }) => (
            <List.Item
              title={item.name}
              description={item.type}
              left={props => <List.Icon {...props} icon="weight-lifter" />}
              onPress={() => {
                setSelectedExcercises(state => {
                  if (state.indexOf(item) === -1) return [...state, item]
                  return state.filter(n => n.id !== item.id)
                })
              }}
              style={{
                backgroundColor: !!selectedExcercises.find(
                  el => el.id === item.id,
                )
                  ? 'rgba(0, 0, 0, .32)'
                  : undefined,
              }}
            />
            // <ListItem
            // item={item}
            // title={item.name}
            // selected={!!selectedExcercises.find(el => el.name === item.name)}
            // onClick={item => {
            //   console.log(selectedExcercises)
            //   setSelectedExcercises(state => {
            //     if (state.indexOf(item) === -1) return [...state, item]
            //     return state.filter(n => n.name !== item.name)
            //   })
            // }}
            // />
          )}
        />
      )}
    </View>
  )
}

export default ExcercisesList
