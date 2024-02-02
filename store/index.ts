

import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
// import leaderboardReducer from './features/leaderboard/leaderboardSlice';

const store = configureStore({
  reducer: {
    leaderboard: rootReducer
  }
});

export default store;