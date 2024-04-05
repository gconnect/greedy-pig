'use client'

import LeaderBoard from './Leaderboard'
import { dappAddress, shortenAddress } from '@/lib/utils'
import { useRollups } from '@/hooks/useRollups'
import { useNotices } from '@/hooks/useNotices'
import { useCallback, useEffect, useState } from 'react'
import Settings from './Settings'
import { useDispatch, useSelector } from 'react-redux'
import { selectActivePlayer } from '@/features/leaderboard/leaderboardSlice'
import toast from 'react-hot-toast'
import useAudio from '@/hooks/useAudio'
import Dice from './Dice'

const GameArena = () => {
  const gameOverSound = useAudio('/sounds/gameOver.mp3')
  const { notices, refetch } = useNotices()
  const rollups = useRollups(dappAddress)
  const dispatch = useDispatch()

  const activePlayer = useSelector((state: any) =>
    selectActivePlayer(state.leaderboard)
  )

  const handleEvent = useCallback(async () => {
    return await refetch()
  }, [refetch])

  const [game, setGame] = useState<any>()

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
    const gameId = window.location.pathname.split('/').pop()
    if (gameId && notices && notices.length > 0) {
      const game = JSON.parse(notices[notices.length - 1].payload).find(
        (game: any) => game.id === gameId
      )
      if (game) {
        dispatchGameData(game) // Dispatch actions on page load
      }
    }
  }, [notices, dispatchGameData])

  useEffect(() => {
    const gameId = window.location.pathname.split('/').pop()
    if (gameId && notices && notices.length > 0) {
      const game = JSON.parse(notices[notices.length - 1].payload).find(
        (game: any) => game.id === gameId
      )
      if (game) {
        dispatchGameData(game) // Dispatch actions on page load
      }
    }
  }, [notices]) // Only run when 'notices' changes
  useEffect(() => {
    const gameId = window.location.pathname.split('/').pop()
    const handleInputAdded = (dappAddress, inboxInputIndex, sender, input) => {
      handleEvent().then(() => {
        if (gameId && notices && notices.length > 0) {
          const game = JSON.parse(notices[notices.length - 1].payload).find(
            (game: any) => game.id === gameId
          )
          if (game) {
            dispatchGameData(game)

            // if (game.status === 'Ended') {
            //   gameOverSound?.play();
            //   toast.success(`${game.winner} won`);
            // }
          }
        }
      })
    }

    rollups?.inputContract.on('InputAdded', handleInputAdded)

    return () => {
      // Cleanup function to unsubscribe from event listener
      rollups?.inputContract.off('InputAdded', handleInputAdded)
    }
  }, [rollups, notices, handleEvent, dispatchGameData]) // Ensure all dependencies are included

  // useEffect(() => {
  //   const gameId = window.location.pathname.split('/').pop()
  //   rollups?.inputContract.on(
  //     'InputAdded',
  //     (dappAddress, inboxInputIndex, sender, input) => {
  //       handleEvent().then(() => {
  //         if (gameId && notices && notices.length > 0) {
  //           console.log(notices)
  //           const game = JSON.parse(notices[notices.length - 1].payload).find(
  //             (game: any) => game.id === gameId
  //           )
  //           if (game) {
  //             dispatchGameData(game)

  //             // if (game.status === 'Ended') {
  //             //   gameOverSound?.play()
  //             //   toast.success(`${game.winner} won`)
  //             // }
  //           }
  //         }
  //       })
  //     }
  //   )
  // }, [handleEvent, dispatch, notices, dispatchGameData])

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
