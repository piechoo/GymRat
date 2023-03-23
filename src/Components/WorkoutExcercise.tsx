import React from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'
import {
  IconButton,
  Card,
  Text,
  TextInput,
  Portal,
  Surface,
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
import ExcerciseDetails from './ExcerciseDetails'
import { useTranslation } from 'react-i18next'
import { WorkoutExcercise as WorkoutExcerciseType, Set } from '@/Store/types'
import Button from './Button'

interface Props {
  excercise: WorkoutExcerciseType
  date: string
  removeExercise: (ex: WorkoutExcerciseType) => any
  addSerie: (ex: WorkoutExcerciseType, serie: Set) => any
}

const styles = StyleSheet.create({
  saveButton: { paddingHorizontal: 10, paddingVertical: 5 },
  card: { marginVertical: 10, marginHorizontal: 5 },
  delete: { position: 'absolute', top: 5, right: 0 },
  content: { flexDirection: 'row', flexWrap: 'wrap' },
  surface: { margin: 2, borderRadius: 10 },
  setButton: { flexDirection: 'column', padding: 5, borderRadius: 10 },
  modalContent: { paddingHorizontal: 20 },
  divider: { padding: 5 },
})

const WorkoutExcercise = ({
  excercise,
  date,
  removeExercise,
  addSerie,
}: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [isModalErrorVisible, setIsModalErrorVisible] = useState(false)
  const [selectedSerie, setSelectedSerie] = useState(null)
  const [weight, setWeight] = useState('0')
  const [reps, setReps] = useState('0')
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const editSerie = useCallback(() => {
    if (weight && reps) {
      dispatch(
        editUserExcerciseSerie({
          date,
          index: selectedSerie,
          excercise,
          serie: { weight: parseFloat(weight), reps: parseInt(reps) },
        }),
      )
      setIsModalVisible(false)
    } else setIsModalErrorVisible(true)
  }, [date, selectedSerie, excercise, weight, reps])

  const addSerieLocal = useCallback(() => {
    if (weight && reps) {
      addSerie(excercise, { weight: parseFloat(weight), reps: parseInt(reps) })
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
        onPress={selectedSerie !== null ? editSerie : addSerieLocal}
        fullWidth={false}
      >
        {t(`shared.save`)}
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
    <Card style={styles.card}>
      <Card.Content>
        <Text
          variant="titleLarge"
          onPress={() => {
            setIsInfoVisible(true)
          }}
        >
          {excercise.name}
        </Text>
        <Text variant="bodyMedium">{excercise.type}</Text>
        <IconButton
          style={styles.delete}
          icon="delete"
          onPress={() => removeExercise(excercise)}
        />
        <View style={styles.content}>
          {excercise?.sets?.map((serie, i) => {
            return (
              <Surface
                style={styles.surface}
                elevation={1}
                key={excercise.name + i}
              >
                <TouchableRipple
                  onPress={() =>
                    openEditSerieModal(serie.weight, serie.reps, i)
                  }
                  style={{ padding: 20, borderRadius: 10 }}
                  rippleColor="#474747"
                  borderless
                >
                  <View style={styles.setButton}>
                    <NumberValue value={serie.weight} desc="KG" />
                    <NumberValue value={serie.reps} desc="Reps" />
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
            setSelectedSerie(null)
            setIsModalErrorVisible(false)
            setIsModalVisible(true)
          }}
        >
          {t(`workoutExcercise.addSerie`)}
        </Button>
        <Portal>
          <Modal
            isVisible={isModalVisible}
            setVisible={setIsModalVisible}
            buttons={saveSerie}
          >
            <>
              <Appbar.Header>
                <Appbar.BackAction
                  onPress={() => {
                    setIsModalVisible(false)
                  }}
                />
                <Appbar.Content
                  title={`${t(`workoutExcercise.setEmpty`)} ${
                    selectedSerie !== null
                      ? selectedSerie + 1
                      : excercise?.sets?.length + 1
                  }`}
                />
                {selectedSerie !== null && (
                  <Appbar.Action icon="delete" onPress={removeSerie} />
                )}
              </Appbar.Header>
              <View style={styles.modalContent}>
                <TextInput
                  label={t(`workoutExcercise.weight`)}
                  value={`${weight}`}
                  onChangeText={changeWeight}
                  right={<TextInput.Affix text="KG" />}
                  inputMode={'decimal'}
                  keyboardType={'decimal-pad'}
                />
                <View style={styles.divider} />
                <TextInput
                  label={t(`workoutExcercise.reps`)}
                  value={`${reps}`}
                  onChangeText={changeReps}
                  inputMode={'decimal'}
                  keyboardType={'decimal-pad'}
                />
              </View>
              <HelperText type="error" visible={isModalErrorVisible}>
                {t(`workoutExcercise.cantBeEmpty`)}
              </HelperText>
            </>
          </Modal>

          <Modal
            isVisible={isInfoVisible}
            setVisible={setIsInfoVisible}
            buttons={saveSerie}
          >
            <>
              <Appbar.Header>
                <Appbar.BackAction
                  onPress={() => {
                    setIsInfoVisible(false)
                  }}
                />
                <Appbar.Content title={excercise.name} />
              </Appbar.Header>
              <ExcerciseDetails excerciseId={excercise.id} />
            </>
          </Modal>
        </Portal>
      </Card.Content>
    </Card>
  )
}

export default WorkoutExcercise
