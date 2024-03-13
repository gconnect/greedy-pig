'use client'
import { FC, useState, useEffect } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Button from '@/components/shared/Button'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress, parseInputEvent } from '@/lib/utils'
import { addInput, sendEther } from '@/lib/cartesi'
import {
  selectParticipantAddresses,
  selectSelectedGame,
} from '@/features/games/gamesSlice'
import Dice from '@/components/ui/Dice'
import useAudio from '@/hooks/useAudio'

interface RouletteProps {
  // notices: any
}

const Apparatus: FC<RouletteProps> = () => {
  const loseSound = useAudio('/sounds/loseSound.mp3')
  const dispatch = useDispatch()
  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)

  const game = useSelector((state: any) => selectSelectedGame(state.games))
  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )

  const [isRolling, setIsRolling] = useState(false)
  const [value, setValue] = useState(0)
  const [gameId, setGameId] = useState<string>('')

  const handleResponse = (response: string) => {
    playGame(response)
  }

  const playGame = async (response: string) => {
    const playerAddress = wallet?.accounts[0].address

    if (!playerAddress) return toast.error('Connect account')

    if (game.status === 'Ended') {
      return toast.error('Game has ended')
    }

    if (game.activePlayer !== playerAddress) {
      return toast.error('Not your turn')
    }

    if (players.length >= 2) {
      const playerAddress = wallet?.accounts[0].address

      try {
        // Don't update the leaderboard except via dice result.
        dispatch({ type: 'leaderboard/freezLeaderboard', payload: true })

        const jsonPayload = JSON.stringify({
          method: 'playGame',
          data: { gameId: game.id, playerAddress, response },
        })

        const tx = await addInput(
          JSON.stringify(jsonPayload),
          dappAddress,
          rollups
        )

        const result = await tx.wait(1)
        console.log('tx for the game ', result)
      } catch (error) {
        console.error('Error during game:', error)
        dispatch({ type: 'leaderboard/freezLeaderboard', payload: false })
      }
    } else {
      toast.error('Not enough players to play')
    }
  }

  const joinGame = async (id: any) => {
    const res = await sendEther(1, rollups)
    const txHash = await res.wait(1)
    console.log(txHash)

    if (txHash) {
      const addr: string | undefined = wallet?.accounts[0].address

      const jsonPayload = JSON.stringify({
        method: 'addParticipant',
        data: { gameId: id, playerAddress: addr },
      })

      const tx = await addInput(
        JSON.stringify(jsonPayload),
        dappAddress,
        rollups
      )

      const result = await tx.wait(1)
      console.log(result)
    } else {
      toast.error('Ether not sent')
    }
  }

  useEffect(() => {
    const id = window.location.pathname.split('/').pop()
    if (id) {
      setGameId(id)
    }
  }, [gameId])

  useEffect(() => {
    rollups?.inputContract.on(
      'InputAdded',
      (dappAddress, inboxInputIndex, sender, input) => {
        if (
          parseInputEvent(input).method === 'playGame' &&
          game.rollOutcome !== 1
        ) {
          dispatch({ type: 'leaderboard/freezLeaderboard', payload: false })

          setTimeout(() => {
            setValue(game.rollOutcome)
            setIsRolling(true)
          }, 5000)
        } else {
          dispatch({ type: 'leaderboard/freezLeaderboard', payload: false })
          loseSound?.play()
        }
      }
    )
  }, [game, rollups])

  return (
    <div className="w-[300px]">
      <div className="flex justify-center mb-[60px]">
        <Dice
          handleDiceClick={() => handleResponse('yes')}
          isRolling={isRolling}
          setIsRolling={setIsRolling}
          value={value}
        />
      </div>

      <div className="flex justify-center">
        {game &&
          game.status === 'New' &&
          wallet &&
          !players.includes(wallet.accounts[0].address) && (
            <Button
              onClick={() => joinGame(gameId)}
              className="mb-10"
              type="button"
            >
              Join Game
            </Button>
          )}
        {game && game.status === 'In Progress' && (
          <div className="flex justify-between">
            <Button
              className="pass-btn"
              style={{ background: '' }}
              onClick={() => handleResponse('no')}
            >
              Pass
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Apparatus
