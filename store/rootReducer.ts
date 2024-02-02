import { combineReducers } from 'redux';
import leaderboardReducer, { LeaderboardState } from '@/features/leaderboard/leaderboardSlice';

export interface RootState {
  leaderboard: LeaderboardState;
  // Add other slices of the state if you have them
}

const rootReducer = combineReducers({
  leaderboard: leaderboardReducer
});

// export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
