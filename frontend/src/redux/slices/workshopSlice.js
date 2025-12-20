import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  workshops: [],
}

const workshopSlice = createSlice({
  name: 'workshop',
  initialState,
  reducers: {
    setWorkshops: (state, action) => {
      state.workshops = action.payload
    },
    addWorkshop: (state, action) => {
      state.workshops.push(action.payload)
    },
  },
})

export const { setWorkshops, addWorkshop } = workshopSlice.actions
export default workshopSlice.reducer
