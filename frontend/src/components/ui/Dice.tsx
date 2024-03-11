'use client'
import { FC, useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
import { AppDice } from './AppDice'
import useAudio from '@/hooks/useAudio'

interface RouletteProps {
  // notices: any
}

const MyDiceApp: FC<RouletteProps> = () => {

  const loseSound = useAudio('/sounds/loseSound.mp3')
  const { notices, refetch } = useNotices()
  const dispatch = useDispatch()
  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)
  const reactDice = useRef<ReactDiceRef>(null)

  const game = useSelector((state: any) => selectSelectedGame(state.games))
  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )

  const [isRolling, setIsRolling] = useState(false)
  const [value, setValue] = useState(0)

  // const handleEvent = useCallback(async () => {
  //   return await refetch()
  // }, [refetch])


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

        const result = await tx.wait(1)
        console.log('tx for the game ', result)
      } catch (error) {
        console.error('Error during game:', error)
      }
    } else {
      toast.error('Not enough players to play')
    }
  }
  // const memoizedGame = useMemo(() => game, [game])
  useEffect(() => {

    rollups?.inputContract.on(
      'InputAdded',
      (dappAddress, inboxInputIndex, sender, input) => {
        if (
          parseInputEvent(input).method === 'playGame' &&
          game.rollOutcome !== 1
        ) {
          setTimeout(() => {
            setValue(game.rollOutcome)
            setIsRolling(true)
            // reactDice.current?.rollAll([memoizedGame.rollOutcome]);
          }, 5000)
        } else {
          loseSound?.play()
        }
      }
    )
  }, [game, rollups])
  // const memoizedGame = useMemo(() => game, [game])
  // useEffect(() => {
  //   console.log('thee gameee ', memoizedGame)
  //   rollups?.inputContract.on(
  //     'InputAdded',
  //     (dappAddress, inboxInputIndex, sender, input) => {
  //       if ((parseInputEvent(input).method === 'playGame') && (memoizedGame.rollOutcome !== 0)) {
  //         setTimeout(() => {
  //           setValue(memoizedGame.rollOutcome)
  //           setIsRolling(true)
  //           // reactDice.current?.rollAll([memoizedGame.rollOutcome]);
  //         }, 5000)
  //       }
  //     }
  //   )
  // }, [memoizedGame, rollups])


  return (
    <div className="w-[300px]">
      <div className="flex justify-center mb-[120px]">
        <AppDice
          handleDiceClick={() => handleResponse('yes')}
          isRolling={isRolling}
          setIsRolling={setIsRolling}
          value={value}
        />
        {/* <ReactDice
          numDice={1}
          ref={reactDice}
          rollDone={rollDone}
          disableIndividual={true}
          dieSize={140}
        /> */}
      </div>

      {game && game.status !== 'Ended' && (
        <div className="flex justify-between">
          <Button
            className="pass-btn"
            style={{ background: '' }}
            onClick={() => handleResponse('no')}
          >
            Pass
          </Button>
          {/* <Button onClick={() => handleResponse('yes')}>
            Roll
          </Button> */}
        </div>
      )}
    </div>
  )
}

export default MyDiceApp
