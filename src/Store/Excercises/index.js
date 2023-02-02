import { createSlice } from '@reduxjs/toolkit'
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

export const getExcercises = state => state.excercises

export const getBodypartExcercises = (state, bodypart) =>
  getExcercises(state)[bodypart]

export const { addExcercise } = slice.actions

export default slice.reducer
