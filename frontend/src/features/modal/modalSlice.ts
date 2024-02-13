import { createSlice } from '@reduxjs/toolkit'

interface State {
  gameModal: boolean
}

const modalSlice = createSlice({
  name: 'modal',
  initialState: {
    gameModal: false,
  } as State,
  reducers: {
    toggleGameModal: (state) => {
      state.gameModal = !state.gameModal
    },
  },
})

export const selectGameModal = (state: State) => state.gameModal

export const { toggleGameModal } = modalSlice.actions

export default modalSlice.reducer
