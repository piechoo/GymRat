export const getCompletedTasks = (excercises, tasks) => {
  let completedTasks = []

  tasks.forEach(element => {
    const excerciseFromTasks = excercises.find(
      ex => ex.id === element.excerciseId,
    )
    if (excerciseFromTasks) {
      const completedTaskSet = excerciseFromTasks.sets.find(
        set => set.weight >= element.weight && set.reps >= element.reps,
      )
      if (completedTaskSet)
        completedTasks.push({
          completedTask: element,
          completedTaskSet,
        })
    }
  })
  return completedTasks
}
