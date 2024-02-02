import { RootState } from '@/store/rootReducer';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerInfo {
  turn: number;
  turnScore: number;
  totalScore: number;
}

interface Participant {
  username: string;
  playerInfo: PlayerInfo;
}

interface State {
  participants: Participant[];
}

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState: {
    participants: [],
  } as State,
  reducers: {
    initLeaderboard: (state, action: PayloadAction<string>) => {
      state.participants.push({
        username: action.payload,
        playerInfo: {
          turn: 0,
          turnScore: 0,
          totalScore: 0
        }
      })
    },

    updatePlayerInfo: (state, action: PayloadAction<{ username: string, property: keyof PlayerInfo, value: any }>) => {
      const { username, property, value } = action.payload;
      const participant = state.participants.find(p => p.username === username);
      if (participant) {
        participant.playerInfo = {
          ...participant.playerInfo,
          [property]: value
        };
      }
    }
  }
});

export const selectUsernames = createSelector(
  (state: RootState) => state.leaderboard.participants,
  (participants: Participant[]) => participants.map(participant => participant.username)
  // participants => participants.map(participant => participant.username) as string[]
);

export const selectParticipants = (state: RootState) => state.leaderboard.participants;

export const { initLeaderboard, updatePlayerInfo } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;

export type LeaderboardState = ReturnType<typeof leaderboardSlice.reducer>;