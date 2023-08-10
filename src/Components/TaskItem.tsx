import React, { memo } from 'react'
import { View, StyleSheet } from 'react-native'
import { Surface, Text } from 'react-native-paper'

import { Set } from '../Store/types'
import { ActiveTaskRecord } from '../Store/Gamification/types'
import SimpleUserPreview, { UserPreviewSize } from './SimpleUserPreview'
import { findNameFromId } from '../Store/Excercises/consts'
import NumberValue from './NumberValue'

interface Props {
  task: {
    completedTaskSet: Set
    completedTask: ActiveTaskRecord
  }
}

export const defaultTask = {
  completedTask: {
    id: 'essa',
    userId: 'xfzY3WbiwSZeokUN5fAFDm6881h2',
    taskCreatorUserId: '9hrqoQRsLfeDGeh2s9pqj5b6lOn2',
    excerciseId: 1,
    weight: 12,
    reps: 8,
    creationDate: Date.now(),
  },
  completedTaskSet: {
    weight: 120,
    reps: 8,
  },
}

const styles = StyleSheet.create({
  container: {
    marginLeft: 10,
    marginTop: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  surface: {
    marginHorizontal: '5%',
    width: '90%',
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
  },
  setButton: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },
})

const TaskItem = memo(({ task }: Props) => {
  return (
    <Surface style={styles.surface} elevation={1}>
      <Text variant="titleLarge" style={{ padding: 5 }}>
        Task in excercise
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <Text variant="bodyMedium" style={{ padding: 5 }}>
            {findNameFromId(task.completedTask.excerciseId)}
          </Text>
          <SimpleUserPreview
            userId={task.completedTask.taskCreatorUserId}
            size={UserPreviewSize.small}
            disabled
          />
        </View>
        <View style={styles.setButton}>
          <NumberValue value={task.completedTaskSet.weight} desc="KG" />
          <NumberValue value={task.completedTaskSet.reps} desc="Reps" />
        </View>
      </View>
    </Surface>
  )
})

TaskItem.displayName = 'TaskItem'
export default TaskItem
