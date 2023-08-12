import React, {
  memo,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react'
import { View, StyleSheet } from 'react-native'
import {
  Appbar,
  HelperText,
  IconButton,
  MD3Colors,
  ProgressBar,
  Surface,
  Text,
  TextInput,
} from 'react-native-paper'

import { Set } from '../Store/types'
import { GamificationRecord } from '../Store/Gamification/types'
import SimpleUserPreview, { UserPreviewSize } from './SimpleUserPreview'
import { findNameFromId } from '../Store/Excercises/consts'
import NumberValue from './NumberValue'
import Modal from './Modal'
import Button from './Button'
import ExcercisesList from '../Containers/ExcercisesList'
import { useTranslation } from 'react-i18next'
import firestore from '@react-native-firebase/firestore'

import UsersList from './UsersList'
import { AuthContext } from './Authentication/AuthProvider'

interface Props {
  isModalVisible: boolean
  afterSaveCallback: () => void
  setIsModalVisible: (is: boolean) => void
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

const CreateTaskModal = memo(
  ({ isModalVisible, setIsModalVisible, afterSaveCallback }: Props) => {
    const [weight, setWeight] = useState('0')
    const [isExcerciseVisible, setIsExcerciseVisible] = useState(false)
    const [isUserVisible, setIsUserVisible] = useState(false)
    const [selectedExcercises, setSelectedExcercises] = useState([])
    const [selectedUser, setSelectedUser] = useState(null)
    const { user } = useContext(AuthContext)

    const [reps, setReps] = useState('0')
    const [isModalErrorVisible, setIsModalErrorVisible] = useState(false)
    const { t } = useTranslation()
    useEffect(() => {
      setWeight('0')
      setReps('0')
      setSelectedExcercises([])
      setSelectedUser(null)
      setIsModalErrorVisible(false)
    }, [isModalVisible])
    const changeWeight = useCallback((text: string) => {
      setWeight(text)
      setIsModalErrorVisible(false)
    }, [])
    const changeReps = useCallback((text: string) => {
      setReps(text)
      setIsModalErrorVisible(false)
    }, [])
    const saveTask = useCallback(() => {
      if (
        selectedExcercises.length < 1 ||
        parseInt(weight) < 1 ||
        parseInt(reps) < 1 ||
        !selectedUser ||
        selectedUser === user.uid
      )
        setIsModalErrorVisible(true)
      else
        firestore()
          .collection('activeTasks')
          .add({
            userId: selectedUser,
            excerciseId: selectedExcercises[0].id,
            reps: parseInt(reps),
            weight: parseInt(weight),
            taskCreator: user.uid,
            creationDate: firestore.Timestamp.fromDate(new Date()),
          })
          .then(() => {
            afterSaveCallback()
            setIsModalVisible(false)
          })
    }, [
      afterSaveCallback,
      user,
      selectedUser,
      selectedExcercises,
      weight,
      reps,
    ])

    const saveButtion = useMemo(() => {
      return (
        <Button mode="text" onPress={saveTask} fullWidth={false}>
          Save
        </Button>
      )
    }, [saveTask])

    return (
      <>
        <Modal
          isVisible={isModalVisible}
          setVisible={setIsModalVisible}
          buttons={saveButtion}
        >
          <>
            <Appbar.Header>
              <Appbar.BackAction
                onPress={() => {
                  setIsModalVisible(false)
                }}
              />
              <Appbar.Content title={'Create new task'} />
            </Appbar.Header>
            <View style={styles.modalContent}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {selectedUser ? (
                  <SimpleUserPreview
                    userId={selectedUser}
                    size={UserPreviewSize.small}
                    disabled
                  />
                ) : (
                  <Text> Select user: </Text>
                )}

                <IconButton
                  icon="magnify"
                  size={30}
                  onPress={() => setIsUserVisible(true)}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {selectedExcercises.length > 0 ? (
                  <Text>{selectedExcercises[0].name} </Text>
                ) : (
                  <Text> Select excercise: </Text>
                )}

                <IconButton
                  icon="magnify"
                  size={30}
                  onPress={() => setIsExcerciseVisible(true)}
                />
              </View>
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
              Please fill form with correct data!
            </HelperText>
          </>
        </Modal>
        <Modal
          isVisible={isExcerciseVisible}
          setVisible={setIsExcerciseVisible}
          closeLabel="Close"
          shouldStretch
        >
          <ExcercisesList
            setIsModalVisible={setIsExcerciseVisible}
            setSelectedExcercises={setSelectedExcercises}
            selectedExcercises={selectedExcercises}
            singleChoice
          />
        </Modal>
        <Modal
          isVisible={isUserVisible}
          setVisible={setIsUserVisible}
          closeLabel="Close"
          shouldStretch
        >
          <UsersList
            setIsModalVisible={setIsUserVisible}
            onSelect={setSelectedUser}
          />
        </Modal>
      </>
    )
  },
)

CreateTaskModal.displayName = 'CreateTaskModal'
export default CreateTaskModal
