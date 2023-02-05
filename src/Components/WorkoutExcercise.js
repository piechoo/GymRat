import React from 'react'
import PropTypes from 'prop-types'
import { View, Image } from 'react-native'
import { useTheme } from '@/Hooks'
import {
  IconButton,
  Button,
  Card,
  Text,
  TextInput,
  Portal,
} from 'react-native-paper'
import { useCallback } from 'react'
import { useState } from 'react'
import Modal from './Modal'
import { useMemo } from 'react'
const LeftContent = props => <IconButton {...props} icon="delete" />

const WorkoutExcercise = ({
  excercise,
  date,
  mode,
  removeExercise,
  addSerie,
  deleteSerie,
  editSerie,
}) => {
  const { Layout, Images } = useTheme()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedSerie, setSelectedSerie] = useState()
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(0)

  const saveSerie = useMemo(() => {
    return (
      <Button
        mode="text"
        onPress={
          selectedSerie
            ? undefined
            : () => addSerie(excercise, { weight, reps })
        }
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      >
        Save
      </Button>
    )
  }, [addSerie, selectedSerie])

  return (
    <Card style={{ marginVertical: 10 }}>
      <Card.Content>
        <Text variant="titleLarge">{excercise.name}</Text>
        <Text variant="bodyMedium">{excercise.type}</Text>
        <IconButton
          style={{ position: 'absolute', top: 5, right: 0 }}
          icon="delete"
          onPress={() => removeExercise(excercise)}
        />
        {excercise?.sets?.map((serie, i) => {
          return (
            <Text>
              {serie.weight}
              {serie.reps}
            </Text>
          )
        })}
        <Button
          icon="plus"
          mode="elevated"
          onPress={() => {
            setSelectedSerie(null)
            setIsModalVisible(true)
          }}
        >
          Add new serie
        </Button>
        <Portal>
          <Modal
            isVisible={isModalVisible}
            setVisible={setIsModalVisible}
            buttons={saveSerie}
          >
            <TextInput
              label="Weight"
              value={weight}
              onChangeText={text => setWeight(text)}
              right={<Text>KG</Text>}
              inputMode={'decimal'}
              keyboardType={'decimal-pad'}
            />
            <TextInput
              label="reps"
              value={reps}
              onChangeText={text => setReps(text)}
              inputMode={'decimal'}
              keyboardType={'decimal-pad'}
            />
            <Text>TUTAJ DODAWANJIE SERJI</Text>
          </Modal>
        </Portal>
      </Card.Content>
      {/* <Card.Cover source={{ uri: 'https://picsum.photos/700' }} /> */}
      {/* <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions> */}
    </Card>
  )
}

WorkoutExcercise.propTypes = {
  height: PropTypes.number,
  mode: PropTypes.oneOf(['contain', 'cover', 'stretch', 'repeat', 'center']),
  width: PropTypes.number,
}

export default WorkoutExcercise
