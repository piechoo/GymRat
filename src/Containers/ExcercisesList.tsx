import React, { useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { bodyParts, excercises } from '@/Store/Excercises/consts'
import { Appbar, List } from 'react-native-paper'
import { WorkoutExcercise } from '../Store/types'
import { useTheme } from '../Hooks'

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

interface Props {
  setSelectedExcercises: (stateFunction: (state: any) => void) => void
  selectedExcercises: WorkoutExcercise[]
  setIsModalVisible: (isVisible: boolean) => void
  singleChoice: boolean
}

const ExcercisesList = ({
  setSelectedExcercises,
  selectedExcercises,
  setIsModalVisible,
  singleChoice,
}: Props) => {
  const [selectedBodypart, setSelectedBodypart] = useState(null)
  const { t } = useTranslation()
  const { darkMode } = useTheme()

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
        {/* <Appbar.Action icon="magnify" onPress={() => {}} /> */}
      </Appbar.Header>
      {!selectedBodypart && (
        <FlatList
          data={Object.values(bodyParts)}
          renderItem={({ item }) => (
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
                  return state.filter((n: WorkoutExcercise) => n.id !== item.id)
                })
                if (singleChoice) setIsModalVisible(false)
              }}
              style={{
                backgroundColor: !!selectedExcercises.find(
                  el => el.id === item.id,
                )
                  ? darkMode
                    ? 'rgba(200, 200, 200, .32)'
                    : 'rgba(0, 0, 0, .32)'
                  : undefined,
              }}
            />
          )}
        />
      )}
    </View>
  )
}

export default ExcercisesList
