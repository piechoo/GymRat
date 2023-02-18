import { createSlice } from '@reduxjs/toolkit'

const slice = createSlice({
  name: 'user',
  initialState: {
    name: 'User',
    weight: [],
    height: 0,
    workouts: [],
    plans: [],
  },
  reducers: {
    addUserWorkout: (state, { payload: { workout } }) => {
      state.workouts.push(workout)
    },
    editUserWorkout: (state, { payload: { workout, date } }) => {
      if (workout)
        state.workouts = state.workouts.map(obj =>
          obj.date !== date ? obj : workout,
        )
      else
        state.workouts = state.workouts.filter(workout => workout.date !== date)
    },
    editUserExcerciseSerie: (
      state,
      { payload: { index, excercise, date, serie } },
    ) => {
      state.workouts = state.workouts.map(obj => {
        if (obj.date !== date) return obj
        const newExcercises = obj?.excercises ?? []
        const filtered = newExcercises.map(obj => {
          if (obj.id !== excercise.id) return obj
          if (serie) {
            const copy = { ...obj }
            copy.sets = [...copy.sets]
            copy.sets[index] = serie
            return copy
          } else {
            const copy = { ...obj }
            copy.sets.splice(index, 1)
            return copy
          }
        })
        return { ...obj, excercises: filtered, date }
      })
    },
    addUserPlan: (state, { payload: { plan } }) => {
      state.plans.push(plan)
    },
    setUserName: (state, action) => {
      state.name = action.payload
    },
    setUserHeight: (state, { payload: { height } }) => {
      state.height = height
    },
    setUserWeight: (state, { payload: { weight } }) => {
      state.weight.push(weight)
    },
  },
})

export const getUser = state => state.user
export const getUserName = state => getUser(state).name
export const getUserWorkouts = state => getUser(state)?.workouts
export const getUserDayWorkout = (state, date) =>
  getUser(state)?.workouts.find(workout => workout.date === date)
export const getUserPlans = state => getUser(state)?.plans

export const {
  addUserWorkout,
  addUserPlan,
  setUserName,
  setUserHeight,
  setUserWeight,
  editUserWorkout,
  editUserExcerciseSerie,
} = slice.actions

export default slice.reducer
