import React, { useContext, useEffect, useCallback, useMemo } from 'react'
import firestore from '@react-native-firebase/firestore'
import { getCompletedTasks } from './utils'

export const useUpdateActiveTasks = (excercises, activeTasks, batch) => {
  const updateActiveTasks = useCallback(async () => {
    const completedTasks = getCompletedTasks(excercises, (activeTasks = []))
    const tasksToDelete = []
    const tasksCreators = []
    if (completedTasks.length > 0) {
      completedTasks.forEach(task => {
        tasksToDelete.push(task.completedTask.id)
        tasksCreators.push(task.completedTask.tasksCreators)
      })
    }

    tasksCreators.forEach(creator => {
      const creatorRef = firestore().collection('gamification').doc(creator)
      batch.update(creatorRef, {
        friendBonus: firestore.FieldValue.increment(1),
      })
    })

    tasksToDelete.forEach(taskToDelete => {
      const deletingTask = firestore()
        .collection('activeTasks')
        .doc(taskToDelete)
      batch.delete(deletingTask)
    })

    return completedTasks

    // Commit the batch

    // await firestore()
    //   .collection('users')
    //   .doc(user.uid)
    //   .update({
    //     bestLifts: newBestLifts,
    //   })
    //   .then(() => {
    //     setUser?.({ ...user, bestLifts: newBestLifts })
    //   })

    // if (isWorkoutSaved)
    //   firestore()
    //     .collection('workouts')
    //     .doc(editedWorkoutId)
    //     .update({
    //       excercises: excercises,
    //       tags: tags,
    //       load: load,
    //     })
    //     .then(() => {
    //       navigation.navigate('Feed')
    //     })
    // else
    //   firestore()
    //     .collection('workouts')
    //     .add({
    //       userId: user.uid,
    //       day: currentDay ?? new Date().toISOString().slice(0, 10),
    //       excercises: excercises,
    //       postTime: firestore.Timestamp.fromDate(new Date()),
    //       tags: tags,
    //       load: load,
    //     })
    //     .then(() => {
    //       const diffInTime =
    //         new Date().getTime() -
    //         gamification.lastExcerciseDay.toDate().getTime()

    //       // To calculate the no. of days between two dates
    //       const diffInDays = diffInTime / (1000 * 3600 * 24)

    //       let daysStreak = gamification.excerciseDayStreak
    //       if (diffInDays <= 1) {
    //         daysStreak++
    //       }

    //       let currentTasksCompleted = gamification.tasksCompleted
    //       if (completedTasks.length > 0) {
    //         currentTasksCompleted += completedTasks.length
    //       }
    //       firestore()
    //         .collection('gamification')
    //         .doc(user.uid)
    //         .update({
    //           excerciseDayStreak: daysStreak,
    //           lastExcerciseDay: firestore.Timestamp.fromDate(new Date()),
    //           tasksCompleted: currentTasksCompleted,
    //           totalLoad: gamification.totalLoad + load,
    //           overall: gamification.overall + load,
    //         })
    //       navigation.navigate('Feed')
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
  }, [])

  return updateActiveTasks
}
