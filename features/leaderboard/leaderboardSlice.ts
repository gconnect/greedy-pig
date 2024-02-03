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

export interface UpdatePlayerInfoPayload {
  username: string;
  property: keyof PlayerInfo;
  value: any;
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

    updatePlayerInfo: (state, action: PayloadAction<UpdatePlayerInfoPayload>) => {
    // updatePlayerInfo: (state, action: PayloadAction<{ username: string, property: keyof PlayerInfo, value: any }>) => {
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
  (participants: Participant[] | undefined) => {
    if (!participants) return []; // Return an empty array if participants is undefined
    return participants.map(participant => participant.username)
  }
);

export const selectParticipants = (state: RootState) => state.leaderboard.participants;

export const { initLeaderboard, updatePlayerInfo } = leaderboardSlice.actions;

export default leaderboardSlice.reducer;

export type LeaderboardState = ReturnType<typeof leaderboardSlice.reducer>;