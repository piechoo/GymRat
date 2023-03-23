import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View, StyleSheet } from 'react-native'
import { Button, FAB, Portal } from 'react-native-paper'
import { SvgXml } from 'react-native-svg'
import ExcercisesList from '../Containers/ExcercisesList'
import Modal from './Modal'

const styles = StyleSheet.create({
  addButton: { paddingHorizontal: 10, paddingVertical: 5 },
  container: { height: '100%' },
  fabGroup: { paddingBottom: 50 },
})

interface Props {
  height: number
  width: number
}

interface onState {
  open: boolean
}

const Fab = ({ height = 200, width = 200 }: Props) => {
  const { t } = useTranslation()
  const [isFabOpen, setIsFabOpen] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedExcercises, setSelectedExcercises] = useState(
    workout?.excercises ?? [],
  )

  const addExcercisesButton = useMemo(() => {
    return selectedExcercises ? (
      <Button mode="text" onPress={addExercises} style={styles.addButton}>
        {t(`shared.add`)}
      </Button>
    ) : undefined
  }, [addExercises, selectedExcercises])

  const onStateChange = ({ open }: onState) => setIsFabOpen(open)

  return (
    <Portal>
      <FAB.Group
        open={isFabOpen}
        variant={'surface'}
        visible //={displayFab}
        icon={isFabOpen ? 'close' : 'plus'}
        style={styles.fabGroup}
        actions={[
          {
            icon: 'dumbbell',
            label: t(`workoutExcercise.addFromList`),
            onPress: () => setIsModalVisible(true),
          },
          {
            icon: 'calendar-blank-multiple',
            label: t(`workoutExcercise.addFromDay`),
            onPress: () => console.log('Pressed star'),
          },
          {
            icon: 'account-multiple-plus',
            label: t(`Add a friend`),
            onPress: () => console.log('Pressed star'),
          },
        ]}
        onStateChange={onStateChange}
      />

      <Modal
        isVisible={isModalVisible}
        setVisible={setIsModalVisible}
        buttons={addExcercisesButton}
        shouldStretch
      >
        <ExcercisesList
          setIsModalVisible={setIsModalVisible}
          setSelectedExcercises={setSelectedExcercises}
          selectedExcercises={selectedExcercises}
        />
      </Modal>
    </Portal>
  )
}

export default Fab
