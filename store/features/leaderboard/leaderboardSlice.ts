import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface State {
  participants: string[];
  test: string;
}

const initialState: State = {
  participants: [],
  test: 'test'
};

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {
    updateLeaderboard: (state, action: PayloadAction<string[]>) => {
      console.log(action.payload)
      state.participants = action.payload;
    },
     updateTest: (state, action: PayloadAction<string>) => {
      console.log(action.payload)
      state.test = action.payload
    }
    // increment: (state) => {
    //   state.leaderboard += 1;
    // },
    // decrement: (state) => {
    //   state.leaderboard -= 1;
    // }
  }
});

export const { updateLeaderboard, updateTest } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;