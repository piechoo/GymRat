import { createSlice } from '@reduxjs/toolkit'
import { AppState, Excercise, Excercises } from '../types'
import { bodyParts, excercises } from './consts'

const slice = createSlice({
  name: 'excercises',
  initialState: excercises, 
  reducers: {
    addExcercise: (state: AppState, { payload: { excercise, type } }) => {
      if (Array.isArray(state.excercises[type]))state.excercises[type].push(excercise)
    },
  },
})

export const getExcercises = (state:AppState):Excercises => state.excercises

export const getBodypartExcercises = (state:AppState, bodypart:bodyParts):Excercise[] =>{
   return getExcercises(state)[bodypart]
}

export const { addExcercise } = slice.actions

export default slice.reducer


