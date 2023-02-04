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
} = slice.actions

export default slice.reducer
