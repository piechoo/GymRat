import { BestLift, WorkoutExcercise } from '../types'

const execiseType = {
  weight: 'weight - reps',
  distance: 'distance - time',
}

export const defaultExcerciseValues = {
  sets: [],
}
export enum bodyParts {
  chest = 'chest',
  back = 'back',
  legs = 'legs',
  shoulders = 'shoulders',
  biceps = 'biceps',
  triceps = 'triceps',
  abs = 'abs',
}

export const findNewBestLifts = (
  excercisesList: Array<WorkoutExcercise>,
  currentBestLifts: Array<BestLift>,
): Array<BestLift> => {
  const newBestLifts: Array<BestLift> = []
  excercisesList.forEach(ex => {
    let biggestLiftInSet = 0
    ex.sets.forEach(element => {
      if (element.weight > biggestLiftInSet) biggestLiftInSet = element.weight
    })
    newBestLifts.push({ id: ex.id, value: biggestLiftInSet })
  })

  const bestWithoutBetter = newBestLifts.filter(
    el =>
      !currentBestLifts.find(
        curr => curr.id === el.id && curr.value > el.value,
      ),
  )

  return currentBestLifts
    .filter(curr => !bestWithoutBetter.find(el => el.id === curr.id))
    .concat(bestWithoutBetter)
}

export const findNameFromId = (id: number) => {
  const bodyPart = getExcerciseBodypart({ id })
  if (bodyPart) return excercises?.[bodyPart].find(ex => ex.id === id)?.name
  return undefined
}
export const getBodypartColor = bodypart => {
  const colors = [
    '#e44e43',
    '#c94e62',
    '#ab5179',
    '#894b72',
    '#51344e',
    '#9d8bf4',
    '#edb890',
  ]
  if (bodypart === bodyParts.chest) return colors[1]
  if (bodypart === bodyParts.back) return colors[3]
  if (bodypart === bodyParts.legs) return colors[0]
  if (bodypart === bodyParts.shoulders) return colors[4]
  if (bodypart === bodyParts.biceps) return colors[2]
  if (bodypart === bodyParts.triceps) return colors[6]
  if (bodypart === bodyParts.abs) return colors[5]
}

export const getExcerciseBodypart = ex => {
  if (ex.id < 10) return bodyParts.chest
  if (ex.id < 21) return bodyParts.back
  if (ex.id < 40) return bodyParts.legs
  if (ex.id < 48) return bodyParts.shoulders
  if (ex.id < 55) return bodyParts.biceps
  if (ex.id < 62) return bodyParts.triceps
  if (ex.id < 69) return bodyParts.abs
}
export const getWorkoutTags = excercises => {
  const defaultTags = [
    { name: bodyParts.chest, value: 0 },
    { name: bodyParts.back, value: 0 },
    { name: bodyParts.legs, value: 0 },
    { name: bodyParts.shoulders, value: 0 },
    { name: bodyParts.shoulders, value: 0 },
    { name: bodyParts.biceps, value: 0 },
    { name: bodyParts.triceps, value: 0 },
    { name: bodyParts.abs, value: 0 },
  ]
  excercises.forEach(ex => {
    const index = defaultTags.findIndex(
      el => el.name === getExcerciseBodypart(ex),
    )

    defaultTags[index].value++
  })

  return defaultTags
    .filter(el => el.value !== 0)
    .sort((a, b) => {
      if (a.value < b.value) {
        return -1
      }
      if (a.value > b.value) {
        return 1
      }
      return 0
    })
}

export const getTotalLoad = excercises => {
  let load = 0

  excercises.forEach(ex => {
    ex.sets.forEach(element => {
      load += element.reps * element.weight
    })
  })

  return load
}

export const validateWorkout = excercises => {
  return excercises.every(ex => {
    return ex.sets && ex.sets?.length > 0
  })
}

export const excercises = {
  [bodyParts.chest]: [
    { name: 'Barbell bench press', type: execiseType.weight, id: 1 },
    { name: 'Incline barbell bench press', type: execiseType.weight, id: 2 },
    { name: 'Decline barbell bench press', type: execiseType.weight, id: 3 },
    { name: 'Dumbell bench press', type: execiseType.weight, id: 4 },
    { name: 'Incline dumbell bench press', type: execiseType.weight, id: 5 },
    { name: 'Barbell pullover', type: execiseType.weight, id: 6 },
    { name: 'Dumbell flyes', type: execiseType.weight, id: 7 },
    { name: 'Pec Dec', type: execiseType.weight, id: 8 },
    { name: 'Cable crossover', type: execiseType.weight, id: 9 },
  ],
  [bodyParts.back]: [
    { name: 'Lat pulldown', type: execiseType.weight, id: 10 },
    { name: 'Close grip lat pulldown', type: execiseType.weight, id: 11 },
    { name: 'Behind neck lat pulldown', type: execiseType.weight, id: 12 },
    { name: 'Pull up', type: execiseType.weight, id: 13 },
    { name: 'Chin up', type: execiseType.weight, id: 14 },
    { name: 'Lat pullover', type: execiseType.weight, id: 15 },
    { name: 'Seated cable row', type: execiseType.weight, id: 16 },
    { name: 'Bend over barbell row', type: execiseType.weight, id: 17 },
    { name: 'Bend over dumbell row', type: execiseType.weight, id: 18 },
    { name: 'One arm dumbell row', type: execiseType.weight, id: 19 },
    { name: 'Hyperextension', type: execiseType.weight, id: 20 },
  ],
  [bodyParts.legs]: [
    { name: 'Barbell squat', type: execiseType.weight, id: 21 },
    { name: 'Front barbell squat', type: execiseType.weight, id: 22 },
    { name: 'Dumbell squat', type: execiseType.weight, id: 23 },
    { name: 'Bulgarian squat', type: execiseType.weight, id: 24 },
    { name: 'Dumbell lunges', type: execiseType.weight, id: 25 },
    { name: 'Barbell lunges', type: execiseType.weight, id: 26 },
    { name: 'Deadlift', type: execiseType.weight, id: 27 },
    { name: 'Sumo deadlift', type: execiseType.weight, id: 28 },
    { name: 'Romanian deadlift', type: execiseType.weight, id: 29 },
    { name: 'Stiff-legged dumbell deadlift', type: execiseType.weight, id: 30 },
    { name: 'Sinlge leg dumbell deadlift', type: execiseType.weight, id: 31 },
    { name: 'Hip thrust', type: execiseType.weight, id: 32 },
    { name: 'Leg press', type: execiseType.weight, id: 33 },
    { name: 'Leg curl', type: execiseType.weight, id: 34 },
    { name: 'Lying leg curl', type: execiseType.weight, id: 35 },
    { name: 'Hip abduction', type: execiseType.weight, id: 36 },
    { name: 'Standing calf raise', type: execiseType.weight, id: 37 },
    { name: 'Seated calf raise', type: execiseType.weight, id: 38 },
    { name: 'Calf press', type: execiseType.weight, id: 39 },
  ],
  [bodyParts.shoulders]: [
    { name: 'Overhead press', type: execiseType.weight, id: 40 },
    { name: 'Seated dumbell overhead press', type: execiseType.weight, id: 41 },
    { name: 'Arnold dumbell press', type: execiseType.weight, id: 42 },
    { name: 'Dumbell lateral raise', type: execiseType.weight, id: 43 },
    { name: 'Cable lateral raise', type: execiseType.weight, id: 44 },
    { name: 'Bent over dumbell reverse fly', type: execiseType.weight, id: 45 },
    { name: 'Cable rope rear-delt rows', type: execiseType.weight, id: 46 },
    { name: 'Barbell front raise', type: execiseType.weight, id: 47 },
  ],
  [bodyParts.biceps]: [
    { name: 'Barbell curl', type: execiseType.weight, id: 48 },
    { name: 'Dumbell curl', type: execiseType.weight, id: 49 },
    { name: 'Seated incline dumbell curl', type: execiseType.weight, id: 50 },
    { name: 'Hammer dumbell curl', type: execiseType.weight, id: 51 },
    { name: 'Barbell preacher curl', type: execiseType.weight, id: 52 },
    { name: 'Cable preacher curl', type: execiseType.weight, id: 53 },
    { name: 'Cable curl', type: execiseType.weight, id: 54 },
  ],
  [bodyParts.triceps]: [
    {
      name: 'Close grip barbell bench press',
      type: execiseType.weight,
      id: 55,
    },
    { name: 'Dumbell overhead extension', type: execiseType.weight, id: 56 },
    {
      name: 'Dumbell one-arm overhead extension',
      type: execiseType.weight,
      id: 57,
    },
    { name: 'Cable overhead extension', type: execiseType.weight, id: 58 },
    { name: 'Parallel bar dips', type: execiseType.weight, id: 59 },
    { name: 'Lying dumbell extension', type: execiseType.weight, id: 60 },
    { name: 'Cable triceps extension', type: execiseType.weight, id: 61 },
  ],
  [bodyParts.abs]: [
    { name: 'Crunch', type: execiseType.weight, id: 62 },
    { name: 'Chair leg raise', type: execiseType.weight, id: 63 },
    { name: 'Cable crunch', type: execiseType.weight, id: 64 },
    { name: 'Plank', type: execiseType.distance, id: 65 },
    { name: 'Parallel bar dips', type: execiseType.weight, id: 66 },
    { name: 'Lying dumbell extension', type: execiseType.weight, id: 67 },
    { name: 'Cable triceps extension', type: execiseType.weight, id: 68 },
  ],
}
