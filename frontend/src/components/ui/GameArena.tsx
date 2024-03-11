'use client'

import Apparatus from '@/components/ui/Apparatus'
import LeaderBoard from './Leaderboard'
import { dappAddress, shortenAddress } from '@/lib/utils'
import { useRollups } from '@/hooks/useRollups'
import { useNotices } from '@/hooks/useNotices'
import { useCallback, useEffect } from 'react'
import Settings from './Settings'
import { useDispatch, useSelector } from 'react-redux'
import { selectActivePlayer } from '@/features/leaderboard/leaderboardSlice'
import toast from 'react-hot-toast'
import useAudio from '@/hooks/useAudio'

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

  const dispatchGameData = useCallback(
    (game: any) => {
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
        dispatchGameData(game); // Dispatch actions on page load
      }
    }
  }, [notices, dispatchGameData])

  useEffect(() => {
    const gameId = window.location.pathname.split('/').pop()
    rollups?.inputContract.on(
      'InputAdded',
      (dappAddress, inboxInputIndex, sender, input) => {
        handleEvent().then(() => {
          if (gameId && notices && notices.length > 0) {
            const game = JSON.parse(notices[notices.length - 1].payload).find(
              (game: any) => game.id === gameId
            )
            if (game) {
              dispatchGameData(game)

              if (game.status === 'Ended') {
                gameOverSound?.play()
                toast.success(`${game.winner} won`)
              }
            }
          }
        })
      }
    )
  }, [handleEvent, rollups, dispatch, notices, dispatchGameData])

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col items-center gap-4  px-8 py-6 md:gap-6">
          {/* <Balance /> */}
          {activePlayer && <p>{shortenAddress(activePlayer)}'s turn</p>}
          <Apparatus />
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-6">
          <LeaderBoard />
        </div>
      </div>

      <Settings />
    </div>
  )
}

export default GameArena
