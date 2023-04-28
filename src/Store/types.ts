import { bodyParts } from './Excercises/consts'

export interface Excercise {
  name: string
  type: string
  id: number
}

export interface Excercises {
  [bodyParts.chest]: Excercise[]
  [bodyParts.back]: Excercise[]
  [bodyParts.legs]: Excercise[]
  [bodyParts.shoulders]: Excercise[]
  [bodyParts.cardio]: Excercise[]
  [bodyParts.biceps]: Excercise[]
  [bodyParts.triceps]: Excercise[]
  [bodyParts.abs]: Excercise[]
}

export interface Set {
  weight: number
  reps: number
}

export interface WorkoutExcercise {
  name: string
  type: string
  id: number
  sets: Set[]
}
export interface BestLift {
  id: number
  value: number
}

export interface Workout {
  excercises: WorkoutExcercise[]
  date: string
}

export interface ExcerciseHistory {
  excercise: WorkoutExcercise
  date: string
}

export interface User {
  name: string
  height: number
  plans: any[]
  weight: any[]
  workouts: Workout[]
}

export interface AppState {
  user: User
  excercises: Excercises
}
