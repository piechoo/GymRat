import { createSelector, createSlice } from '@reduxjs/toolkit'
import { excercises } from './consts'

const slice = createSlice({
  name: 'excercises',
  initialState: excercises,
  reducers: {
    addExcercise: (state, { payload: { excercise, type } }) => {
      state.excercises[type].push(excercise)
    },
  },
})

const selectSelf = state => state
export const getExcercises = createSelector(
  selectSelf,
  state => state.excercises,
)

export const getBodypartExcercises = createSelector(
  [
    // Usual first input - extract value from `state`
    state => getExcercises(state),
    // Take the second arg, `category`, and forward to the output selector
    (state, bodypart) => bodypart,
  ],
  // Output selector gets (`items, category)` as args
  (excercises, bodypart) => excercises[bodypart],
)

export const { addExcercise } = slice.actions

export default slice.reducer
