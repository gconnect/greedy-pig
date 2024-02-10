'use client'

import { useDispatch } from 'react-redux'
import io, { Socket } from 'socket.io-client';
import Button from '@/components/shared/Button'
import GameArena from '@/components/ui/GameArena'
import GameSettings from '@/components/ui/GameSettings'
import { useConnectContext } from '@/components/providers/ConnectProvider'
import { initLeaderboard } from '@/features/leaderboard/leaderboardSlice'


let socket: Socket;

const Play = () => {

  const dispatch = useDispatch()

    const {

    wallet,
    connecting,
    connect,
    disconnect,
    notices,
  } = useConnectContext()


const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
      socket.emit('joined', wallet?.accounts[0].address);
      dispatch(initLeaderboard(wallet?.accounts[0].address))
    });

    // socket.on('update-input', (msg: string) => {
    //   console.log('update-input from back', msg);

    // });

    // socket.on('user-joined', (msg: any) => {
    //   console.log('joined', msg);
    // })
  };

  console.log('wallet ', wallet)

  const joinGame = async () => {
    if (!wallet) {
      return connect()
    }

    await socketInitializer()
    // if (!wallet) { connect()}
    //   await socketInitializer()
    // }
  }

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
