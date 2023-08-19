import React, { useContext, useEffect, useCallback, useMemo } from 'react'
import firestore from '@react-native-firebase/firestore'
import { getCompletedTasks } from './utils'

export const useUpdateActiveTasks = () => {
  const updateActiveTasks = useCallback(
    async (excercises, activeTasks = [], batch) => {
      const completedTasks = getCompletedTasks(excercises, activeTasks)
      const tasksToDelete = []
      const tasksCreators = []
      if (completedTasks.length > 0) {
        completedTasks.forEach(task => {
          tasksToDelete.push(task.completedTask.id)
          tasksCreators.push(task.completedTask.taskCreator)
        })
      }

      tasksCreators.forEach(creator => {
        const creatorRef = firestore().collection('gamification').doc(creator)
        batch.update(creatorRef, {
          friendBonus: firestore.FieldValue.increment(1),
          overall: firestore.FieldValue.increment(10000),
        })
      })

      tasksToDelete.forEach(taskToDelete => {
        const deletingTask = firestore()
          .collection('activeTasks')
          .doc(taskToDelete)
        batch.delete(deletingTask)
      })

      return completedTasks
    },
    [],
  )

  return updateActiveTasks
}
