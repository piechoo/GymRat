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
    addUserPlan: (state, { payload: { plan } }) => {
      state.plans.push(plan)
    },
    setUserName: (state, action) => {
      console.log(action)
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
export const getUserPlans = state => getUser(state)?.plans

export const {
  addUserWorkout,
  addUserPlan,
  setUserName,
  setUserHeight,
  setUserWeight,
} = slice.actions

export default slice.reducer
