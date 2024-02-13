import { configureStore } from '@reduxjs/toolkit'
import leaderboardReducer from '../features/leaderboard/leaderboardSlice'
import modalReducer from '../features/modal/modalSlice'

const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    modal: modalReducer,
  },
})

export default store
