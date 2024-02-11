// socketSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import produce from 'immer';

interface SocketState {
  socket: Socket | null;
  initialized: boolean;
}

const initialState: SocketState = {
  socket: null,
  initialized: false,
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    initializeSocket: (state, action: PayloadAction<Socket>) => {
  state = produce(state, (draft) => {
    draft.socket = action.payload;
    draft.initialized = true;
  });
},


    // initializeSocket: (state, action: PayloadAction<Socket>) => {
    //   state.socket = action.payload; // line 21
    //   state.initialized = true;
    // },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
        state.initialized = false;
      }
    },
  },
});

export const { initializeSocket, disconnectSocket } = socketSlice.actions;

export default socketSlice.reducer;

export type SocketStateType = ReturnType<typeof socketSlice.reducer>;
