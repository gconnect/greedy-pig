'use client'

import LeaderBoard from './Leaderboard'
import { dappAddress, parseInputEvent, shortenAddress } from '@/lib/utils'
import { useNotices } from '@/hooks/useNotices'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Settings from './Settings'
import { useDispatch, useSelector } from 'react-redux'
import { selectActivePlayer } from '@/features/leaderboard/leaderboardSlice'
import toast from 'react-hot-toast'
import useAudio from '@/hooks/useAudio'
import Dice from './Dice'
import { useRollups } from '@/hooks/useRollups'

const GameArena = () => {
  const gameOverSound = useAudio('/sounds/gameOver.mp3')
  const { notices } = useNotices()
  const dispatch = useDispatch()
  const rollups = useRollups(dappAddress)

  const activePlayer = useSelector((state: any) =>
    selectActivePlayer(state.leaderboard)
  )

  const [game, setGame] = useState<any>()
  const gameRef = useRef<any>(null)
  const prevNotices = useRef<any>(null)

  const dispatchGameData = useCallback(
    (game: any) => {
      setGame(game)
      dispatch({ type: 'games/setGame', payload: game })
      dispatch({
        type: 'leaderboard/updateActivePlayer',
        payload: game.activePlayer,
      })
    },
    [dispatch]
  )

  useEffect(() => {
    console.log('setting game in useEffect, Gamearena')
    const gameId = window.location.pathname.split('/').pop()

    if (gameId && notices && notices.length > 0) {
      const latestGamePayload = JSON.parse(notices[notices.length - 1].payload)
      const game = latestGamePayload.find((g: any) => g.id === gameId)
      if (game && game !== gameRef.current) {
        dispatchGameData(game)
        gameRef.current = game
      }
    }
  }, [rollups, dispatchGameData])

  useEffect(() => {
    if (prevNotices.current !== notices) {
      prevNotices.current = notices
    }
  }, [notices])

  useEffect(() => {
    const gameId = window.location.pathname.split('/').pop()
    console.log('Setting up event listener for InputAdded')
    const handleInputAdded = (
  dappAddress,
  inboxInputIndex,
  sender,
  input: any
) => {
  const inputEvent = parseInputEvent(input)
  console.log('inside event input added')

  const latestGamePayload = JSON.parse(notices[notices.length - 1].payload)
  const gameId = window.location.pathname.split('/').pop()
  const game = latestGamePayload.find((g: any) => g.id === gameId)

  if (inputEvent.method === 'playGame' && game && game.rollOutcome !== 0) {
    console.log('inside conditional event input added')
    dispatchGameData(game)
    // if (game.status === 'Ended') {
    //   gameOverSound?.play()
    //   toast.success(`${game.winner} won`)
    // }
  }
}

    // const handleInputAdded = (
    //   dappAddress,
    //   inboxInputIndex,
    //   sender,
    //   input: any
    // ) => {
    //   const inputEvent = parseInputEvent(input)
    //   console.log('inside event input added')
  
    //     const latestGamePayload = JSON.parse(
    //       notices[notices.length - 1].payload
    //     )
    //     const game = latestGamePayload.find((g: any) => g.id === gameId)

        
    //   if (inputEvent.method === 'playGame' && game.rollOutcome !== 0) {
    //     console.log('inside conditional event input added')
    //     dispatchGameData(game)
    //     // if (game.status === 'Ended') {
    //     //   gameOverSound?.play()
    //     //   toast.success(`${game.winner} won`)
    //     // }
     
     
    //   }
    // }

    rollups?.inputContract.on('InputAdded', handleInputAdded)

    return () => {
      // Clean up by removing the event listener when the component unmounts
      rollups?.inputContract.removeListener('InputAdded', handleInputAdded)
    }
  }, [rollups, dispatchGameData])

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col items-center gap-4  px-8 py-6 md:gap-6">
          {/* <Balance /> */}
          {activePlayer && <p>{shortenAddress(activePlayer)}'s turn</p>}
          <Dice game={game} />
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-6">
          <LeaderBoard game={game} />
        </div>
      </div>

      <Settings />
    </div>
  )
}

export default GameArena
