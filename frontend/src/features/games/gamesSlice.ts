import { PayloadAction, createSlice } from '@reduxjs/toolkit'



interface State {
  selectedGame: any
}

const gamesSlice = createSlice({
  name: 'games',
  initialState: {
    selectedGame: '',
  } as State,
  reducers: {
    setGame: (state, action: PayloadAction<any>) => {
      state.selectedGame = action.payload
    },
  },
})

export const selectSelectedGame = (state: State) => state.selectedGame

export const { setGame } = gamesSlice.actions

export default gamesSlice.reducer
