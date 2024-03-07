'use client'
import { FC, useState, useEffect, useRef, useCallback } from 'react'
import ReactDice, { ReactDiceRef } from 'react-dice-complete'
import { useConnectWallet } from '@web3-onboard/react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import Button from '@/components/shared/Button'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress, parseInputEvent } from '@/lib/utils'
import { addInput } from '@/lib/cartesi'
import {
  selectParticipantAddresses,
  selectSelectedGame,
} from '@/features/games/gamesSlice'
import { useNotices } from '@/hooks/useNotices'

interface RouletteProps {
  // notices: any
}

const MyDiceApp: FC<RouletteProps> = () => {

  const { notices, refetch } = useNotices()
  const dispatch = useDispatch()
  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)
  const reactDice = useRef<ReactDiceRef>(null)

  const game = useSelector((state: any) => selectSelectedGame(state.games))
  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )
  
  const handleEvent = useCallback(async () => {
    return await refetch()
  }, [refetch])

  const rollDone = (totalValue: number) => {
    console.log('total dice value:', totalValue)
  }

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
        const jsonPayload = JSON.stringify({
          method: 'playGame',
          data: { gameId: game.id, playerAddress, response },
        })

        const tx = await addInput(
          JSON.stringify(jsonPayload),
          dappAddress,
          rollups
        )

        console.log('dice tx ', tx)
        const result = await tx.wait(1)
        console.log('result for the game ', result)
      } catch (error) {
        console.error('Error during game:', error)
      }
    } else {
      toast.error('Not enough players to play')
    }
  }

  useEffect(() => {
    console.log('Game:', game); // Log the game state
    if (game) {
      if (game.status === 'Ended') {
        toast.success('Game has ended')
      } 
      if (game.rollOutcome !== 0) {
        console.log('thee gameee ', game)
        reactDice.current?.rollAll([game.rollOutcome]);
      }
    }
  }, [game])

  return (
    <div>
      {/* <h2 onClick={rollAll}>Rollll</h2> */}
      {game && game.status !== 'Ended' && (
        <div>
          <Button type="button" id="spin" onClick={() => handleResponse('yes')}>
            Roll
          </Button>
          <Button type="button" id="spin" onClick={() => handleResponse('no')}>
            Pass
          </Button>
        </div>
      )}
      <ReactDice
        numDice={1}
        ref={reactDice}
        rollDone={rollDone}
        disableIndividual={true}
        dieSize={140}
      />
      {/* <ConfirmModal onSubmit={handleResponse} activePlayer={activePlayer} /> */}
    </div>
  )
}

export default MyDiceApp
