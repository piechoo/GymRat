const execiseType = {
  weight: 'weight - reps',
  distance: 'distance - time',
}

export const defaultExcerciseValues = {
  sets: [],
}
export const bodyParts = {
  chest: 'chest',
  back: 'back',
  legs: 'legs',
  shoulders: 'shoulders',
  biceps: 'biceps',
  triceps: 'triceps',
  abs: 'abs',
  cardio: 'cardio',
}
export const excercises = {
  [bodyParts.chest]: [
    { name: 'Barbell bench press', type: execiseType.weight },
    { name: 'Incline barbell bench press', type: execiseType.weight },
    { name: 'Decline barbell bench press', type: execiseType.weight },
    { name: 'Dumbell bench press', type: execiseType.weight },
    { name: 'Incline dumbell bench press', type: execiseType.weight },
    { name: 'Barbell pullover', type: execiseType.weight },
    { name: 'Dumbell flyes', type: execiseType.weight },
    { name: 'Pec Dec', type: execiseType.weight },
    { name: 'Cable crossover', type: execiseType.weight },
  ],
  [bodyParts.back]: [
    { name: 'Lat pulldown', type: execiseType.weight },
    { name: 'Close grip lat pulldown', type: execiseType.weight },
    { name: 'Behind neck lat pulldown', type: execiseType.weight },
    { name: 'Pull up', type: execiseType.weight },
    { name: 'Chin up', type: execiseType.weight },
    { name: 'Lat pullover', type: execiseType.weight },
    { name: 'Seated cable row', type: execiseType.weight },
    { name: 'Bend over barbell row', type: execiseType.weight },
    { name: 'Bend over dumbell row', type: execiseType.weight },
    { name: 'One arm dumbell row', type: execiseType.weight },
    { name: 'Hyperextension', type: execiseType.weight },
  ],
  [bodyParts.legs]: [
    { name: 'Barbell squat', type: execiseType.weight },
    { name: 'Front barbell squat', type: execiseType.weight },
    { name: 'Dumbell squat', type: execiseType.weight },
    { name: 'Bulgarian squat', type: execiseType.weight },
    { name: 'Dumbell lunges', type: execiseType.weight },
    { name: 'Barbell lunges', type: execiseType.weight },
    { name: 'Deadlift', type: execiseType.weight },
    { name: 'Sumo deadlift', type: execiseType.weight },
    { name: 'Romanian deadlift', type: execiseType.weight },
    { name: 'Stiff-legged dumbell deadlift', type: execiseType.weight },
    { name: 'Sinlge leg dumbell deadlift', type: execiseType.weight },
    { name: 'Hip thrust', type: execiseType.weight },
    { name: 'Leg press', type: execiseType.weight },
    { name: 'Leg curl', type: execiseType.weight },
    { name: 'Lying leg curl', type: execiseType.weight },
    { name: 'Hip abduction', type: execiseType.weight },
    { name: 'Standing calf raise', type: execiseType.weight },
    { name: 'Seated calf raise', type: execiseType.weight },
    { name: 'Calf press', type: execiseType.weight },
  ],
  [bodyParts.shoulders]: [
    { name: 'Overhead press', type: execiseType.weight },
    { name: 'Seated dumbell overhead press', type: execiseType.weight },
    { name: 'Arnold dumbell press', type: execiseType.weight },
    { name: 'Dumbell lateral raise', type: execiseType.weight },
    { name: 'Cable lateral raise', type: execiseType.weight },
    { name: 'Bent over dumbell reverse fly', type: execiseType.weight },
    { name: 'Cable rope rear-delt rows', type: execiseType.weight },
    { name: 'Barbell front raise', type: execiseType.weight },
  ],
  [bodyParts.biceps]: [
    { name: 'Barbell curl', type: execiseType.weight },
    { name: 'Dumbell curl', type: execiseType.weight },
    { name: 'Seated incline dumbell curl', type: execiseType.weight },
    { name: 'Hammer dumbell curl', type: execiseType.weight },
    { name: 'Barbell preacher curl', type: execiseType.weight },
    { name: 'Cable preacher curl', type: execiseType.weight },
    { name: 'Cable curl', type: execiseType.weight },
  ],
  [bodyParts.triceps]: [
    { name: 'Close grip barbell bench press', type: execiseType.weight },
    { name: 'Dumbell overhead extension', type: execiseType.weight },
    { name: 'Dumbell one-arm overhead extension', type: execiseType.weight },
    { name: 'Cable overhead extension', type: execiseType.weight },
    { name: 'Parallel bar dips', type: execiseType.weight },
    { name: 'Lying dumbell extension', type: execiseType.weight },
    { name: 'Cable triceps extension', type: execiseType.weight },
  ],
  [bodyParts.abs]: [
    { name: 'Crunch', type: execiseType.weight },
    { name: 'Chair leg raise', type: execiseType.weight },
    { name: 'Cable crunch', type: execiseType.weight },
    { name: 'Plank', type: execiseType.distance },
    { name: 'Parallel bar dips', type: execiseType.weight },
    { name: 'Lying dumbell extension', type: execiseType.weight },
    { name: 'Cable triceps extension', type: execiseType.weight },
  ],
  [bodyParts.cardio]: [
    { name: 'Treadmill', type: execiseType.distance },
    { name: 'Bicycle', type: execiseType.distance },
    { name: 'Stepper', type: execiseType.distance },
    { name: 'Steps', type: execiseType.distance },
  ],
}
