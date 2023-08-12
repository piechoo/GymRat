export type GamificationRecord = {
  userId: string
  overall: number
  totalLoad: number
  friendBonus: number
  dailyBonus: number
  tasksCompleted: number
  excerciseDayStreak: number
  loginBonusDate: Date // zeby odebrac tylko raz dziennie
  lastExcerciseDay: Date
}

export type ActiveTaskRecord = {
  id: string
  userId: string
  taskCreator: string
  excerciseId: number
  weight: number
  reps: number
  creationDate: Date
}
