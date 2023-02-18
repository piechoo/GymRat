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
  Chip,
  Surface,
  List,
  TouchableRipple,
  HelperText,
  Appbar,
} from 'react-native-paper'
import { useCallback } from 'react'
import { useState } from 'react'
import Modal from './Modal'
import { useMemo } from 'react'
import NumberValue from './NumberValue'
import { useDispatch } from 'react-redux'
import { editUserExcerciseSerie } from '@/Store/User'
const LeftContent = props => <IconButton {...props} icon="delete" />

const WorkoutExcercise = ({
  excercise,
  date,
  mode,
  removeExercise,
  addSerie,
}) => {
  const { Layout, Images } = useTheme()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isModalErrorVisible, setIsModalErrorVisible] = useState(false)
  const [selectedSerie, setSelectedSerie] = useState()
  const [weight, setWeight] = useState(0)
  const [reps, setReps] = useState(0)
  const dispatch = useDispatch()

  const editSerie = useCallback(() => {
    if (weight && reps) {
      dispatch(
        editUserExcerciseSerie({
          date,
          index: selectedSerie,
          excercise,
          serie: { weight, reps },
        }),
      )
      setIsModalVisible(false)
    } else setIsModalErrorVisible(true)
  }, [date, selectedSerie, excercise, weight, reps])

  const addSerieLocal = useCallback(() => {
    if (weight && reps) {
      addSerie(excercise, { weight, reps })
      setIsModalVisible(false)
    } else setIsModalErrorVisible(true)
  }, [addSerie, excercise, weight, reps])

  const removeSerie = useCallback(() => {
    dispatch(
      editUserExcerciseSerie({
        date,
        index: selectedSerie,
        excercise,
        serie: null,
      }),
    )
    setIsModalVisible(false)
  }, [date, excercise, selectedSerie])

  const saveSerie = useMemo(() => {
    return (
      <Button
        mode="text"
        onPress={selectedSerie !== undefined ? editSerie : addSerieLocal}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      >
        Save
      </Button>
    )
  }, [addSerie, selectedSerie, editSerie, addSerieLocal])

  const openEditSerieModal = useCallback(
    (serieWeight, serieReps, serieIndex) => {
      setSelectedSerie(serieIndex)
      setWeight(serieWeight)
      setReps(serieReps)
      setIsModalVisible(true)
      setIsModalErrorVisible(false)
    },
    [],
  )

  const changeWeight = useCallback(text => {
    setWeight(text)
    setIsModalErrorVisible(false)
  }, [])
  const changeReps = useCallback(text => {
    setReps(text)
    setIsModalErrorVisible(false)
  }, [])

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
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {excercise?.sets?.map((serie, i) => {
            return (
              <Surface
                style={{ margin: 2, borderRadius: 10 }}
                elevation={4}
                key={excercise.name + i}
              >
                <TouchableRipple
                  onPress={() =>
                    openEditSerieModal(serie.weight, serie.reps, i)
                  }
                  rippleColor="green"
                >
                  <View style={{ flexDirection: 'column', padding: 20 }}>
                    <NumberValue value={serie.weight} desc="KG" />
                    <NumberValue value={serie.reps} desc="reps" />
                  </View>
                </TouchableRipple>
              </Surface>
            )
          })}
        </View>
        <Button
          icon="plus"
          mode="elevated"
          onPress={() => {
            setSelectedSerie(undefined)
            setIsModalErrorVisible(false)
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
            <Appbar.Header>
              <Appbar.BackAction
                onPress={() => {
                  setIsModalVisible(false)
                }}
              />
              <Appbar.Content
                title={`Set number ${
                  selectedSerie !== undefined
                    ? selectedSerie + 1
                    : excercise?.sets?.length + 1
                }`}
              />
              {selectedSerie !== undefined && (
                <Appbar.Action icon="delete" onPress={removeSerie} />
              )}
            </Appbar.Header>
            <View style={{ paddingHorizontal: 20 }}>
              <TextInput
                label="Weight"
                value={weight}
                onChangeText={changeWeight}
                right={<TextInput.Affix text="KG" />}
                inputMode={'decimal'}
                keyboardType={'decimal-pad'}
              />
              <View style={{ padding: 5 }} />
              <TextInput
                label="reps"
                value={reps}
                onChangeText={changeReps}
                inputMode={'decimal'}
                keyboardType={'decimal-pad'}
              />
            </View>
            <HelperText type="error" visible={isModalErrorVisible}>
              Weight and reps cannot be equal 0!
            </HelperText>
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
