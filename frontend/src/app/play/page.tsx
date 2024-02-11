'use client'

import { useDispatch } from 'react-redux'
import { Socket } from 'socket.io-client';
import Button from '@/components/shared/Button'
import GameArena from '@/components/ui/GameArena'
import GameSettings from '@/components/ui/GameSettings'
import { useConnectContext } from '@/components/providers/ConnectProvider'
// import { initLeaderboard } from '@/features/leaderboard/leaderboardSlice'
import { useEffect, useState } from 'react';
import { getSocket, initSocket } from '@/lib/socket';


let socket: Socket;

const Play = () => {

  const dispatch = useDispatch()

    const { wallet, connect, } = useConnectContext()


// const [socketInitialized, setSocketInitialized] = useState(false);

  console.log('wallet ', wallet)

  const joinGame = async () => {
    // if (!wallet) {
    //   return connect()
    // }
debugger
    socket = getSocket()

    if (socket) {
      socket.emit('joined', 'player1');
      // socket.emit('joined', wallet?.accounts[0].address);
      // dispatch({type: 'leaderboard/initLeaderboard', payload: wallet?.accounts[0].address})
    }
  }

  useEffect(() => {
    const initializeSocket = async () => {
      await initSocket();
      socket = getSocket();
      // setSocketInitialized(true);
    };

    initializeSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('joined', (player) => {
        // Dispatch only if the joined player is not the current user
        if (player !== wallet?.accounts[0].address) {
          console.log('hello')
        
          dispatch({ type: 'leaderboard/initLeaderboard', payload: player });
        }
      });
    }
  }, [socket]); 

  return (
    <div>
      <div>
        Game 
        <Button onClick={joinGame}>Join</Button>
      </div>
      <GameSettings />

      <GameArena />
    </div>
  )
}

export default Play
