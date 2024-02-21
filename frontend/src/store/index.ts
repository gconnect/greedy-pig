import { configureStore } from '@reduxjs/toolkit'
import leaderboardReducer from '@/features/leaderboard/leaderboardSlice'
import modalReducer from '@/features/modal/modalSlice'
import gamesSlice from '@/features/games/gamesSlice'

const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
    modal: modalReducer,
    games: gamesSlice,
  },
})

export default store
