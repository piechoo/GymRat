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
import ExcerciseDetails from './ExcerciseDetails'
import { useTranslation } from 'react-i18next'
import { WorkoutExcercise as WorkoutExcerciseType, Set } from '@/Store/types'
import Button from './Button'

interface Props {
  excercise: WorkoutExcerciseType
  removeExercise: (ex: WorkoutExcerciseType) => any
  editSerie: (ex: WorkoutExcerciseType, set: Set, selectedSet: Set) => any
  removeSerie: (ex: WorkoutExcerciseType, selectedSet: Set) => any
  addSerie: (ex: WorkoutExcerciseType, serie: Set) => any
  readOnly: boolean
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
  serie: { padding: 16, borderRadius: 10 },
})

const WorkoutExcercise = ({
  excercise,
  removeExercise,
  editSerie,
  removeSerie,
  addSerie,
  readOnly,
}: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isInfoVisible, setIsInfoVisible] = useState(false)
  const [isModalErrorVisible, setIsModalErrorVisible] = useState(false)
  const [selectedSerie, setSelectedSerie] = useState(null)
  const [weight, setWeight] = useState('0')
  const [reps, setReps] = useState('0')
  const { t } = useTranslation()

  const editSerieLocal = useCallback(() => {
    if (weight && reps) {
      editSerie(
        excercise,
        { weight: parseFloat(weight), reps: parseInt(reps) },
        selectedSerie,
      )

      setIsModalVisible(false)
    } else setIsModalErrorVisible(true)
  }, [selectedSerie, excercise, weight, reps])

  const addSerieLocal = useCallback(() => {
    if (weight && reps) {
      addSerie(excercise, { weight: parseFloat(weight), reps: parseInt(reps) })
      setIsModalVisible(false)
    } else setIsModalErrorVisible(true)
  }, [addSerie, excercise, weight, reps])

  const removeSerieLocal = useCallback(() => {
    removeSerie(excercise, selectedSerie)
    setIsModalVisible(false)
  }, [excercise, selectedSerie])

  const saveSerie = useMemo(() => {
    return readOnly ? null : (
      <Button
        mode="text"
        onPress={selectedSerie !== null ? editSerieLocal : addSerieLocal}
        fullWidth={false}
      >
        {t(`shared.save`)}
      </Button>
    )
  }, [addSerie, selectedSerie, editSerieLocal, addSerieLocal, readOnly])

  const openEditSerieModal = useCallback(
    (serieWeight: string, serieReps: string, serieIndex: number) => {
      setSelectedSerie(serieIndex)
      setWeight(serieWeight)
      setReps(serieReps)
      setIsModalVisible(true)
      setIsModalErrorVisible(false)
    },
    [],
  )

  const changeWeight = useCallback((text: string) => {
    setWeight(text)
    setIsModalErrorVisible(false)
  }, [])
  const changeReps = useCallback((text: string) => {
    setReps(text)
    setIsModalErrorVisible(false)
  }, [])

  const openInfoModal = useCallback(() => {
    setIsInfoVisible(true)
  }, [])
  const closeInfoModal = useCallback(() => {
    setIsInfoVisible(false)
  }, [])
  const removeSelectedExcercise = useCallback(() => {
    removeExercise(excercise)
  }, [removeExercise, excercise])

  const openAddSerieModal = useCallback(() => {
    setSelectedSerie(null)
    setIsModalErrorVisible(false)
    setIsModalVisible(true)
  }, [])
  const closeAddSerieModal = useCallback(() => {
    setIsModalVisible(false)
  }, [])

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge" onPress={openInfoModal}>
          {excercise.name}
        </Text>
        <Text variant="bodyMedium">{excercise.type}</Text>
        {!readOnly && (
          <IconButton
            style={styles.delete}
            icon="delete"
            onPress={removeSelectedExcercise}
          />
        )}
        <View style={styles.content}>
          {excercise?.sets?.map((serie: Set, i: number) => {
            return readOnly ? (
              <Surface
                style={styles.surface}
                elevation={1}
                key={excercise.name + i}
              >
                <View style={styles.serie}>
                  <View style={styles.setButton}>
                    <NumberValue value={serie.weight} desc="KG" />
                    <NumberValue value={serie.reps} desc="Reps" />
                  </View>
                </View>
              </Surface>
            ) : (
              <Surface
                style={styles.surface}
                elevation={1}
                key={excercise.name + i}
              >
                <TouchableRipple
                  onPress={() => {
                    if (!readOnly)
                      openEditSerieModal(serie.weight, serie.reps, i)
                  }}
                  style={styles.serie}
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
        {!readOnly && (
          <Button icon="plus" mode="elevated" onPress={openAddSerieModal}>
            {t(`workoutExcercise.addSerie`)}
          </Button>
        )}
        {readOnly ? null : (
          <Portal>
            <Modal
              isVisible={isModalVisible}
              setVisible={setIsModalVisible}
              buttons={saveSerie}
            >
              <>
                <Appbar.Header>
                  <Appbar.BackAction onPress={closeAddSerieModal} />
                  <Appbar.Content
                    title={`${t(`workoutExcercise.setEmpty`)} ${
                      selectedSerie !== null
                        ? selectedSerie + 1
                        : excercise?.sets?.length
                        ? excercise?.sets?.length + 1
                        : 1
                    }`}
                  />
                  {selectedSerie !== null && !readOnly && (
                    <Appbar.Action icon="delete" onPress={removeSerieLocal} />
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
              closeLabel="Close"
            >
              <>
                <Appbar.Header>
                  <Appbar.BackAction onPress={closeInfoModal} />
                  <Appbar.Content title={excercise.name} />
                </Appbar.Header>
                <ExcerciseDetails excerciseId={excercise.id} />
              </>
            </Modal>
          </Portal>
        )}
      </Card.Content>
    </Card>
  )
}

export default WorkoutExcercise
