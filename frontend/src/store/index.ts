import { configureStore } from '@reduxjs/toolkit'
// import rootReducer from './rootReducer';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice'

const store = configureStore({
  reducer: {
    leaderboard: leaderboardReducer,
  },
})

export default store
