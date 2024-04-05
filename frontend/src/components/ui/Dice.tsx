import { FC, useCallback, useEffect, useState } from 'react'
import Die1 from '@/assets/img/dice_1.png'
import Die2 from '@/assets/img/dice_2.png'
import Die3 from '@/assets/img/dice_3.png'
import Die4 from '@/assets/img/dice_4.png'
import Die5 from '@/assets/img/dice_5.png'
import Die6 from '@/assets/img/dice_6.png'
import Image from 'next/image'
import useAudio from '@/hooks/useAudio'
import { parseInputEvent, playGame } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import {
  selectParticipantAddresses,
  selectSelectedGame,
} from '@/features/games/gamesSlice'
import { dappAddress } from '@/lib/utils'
import { useConnectWallet } from '@web3-onboard/react'
import { addInput } from '@/lib/cartesi'
import { useRollups } from '@/hooks/useRollups'
import { useNotices } from '@/hooks/useNotices'
import Button from '../shared/Button'

const die = [Die1, Die2, Die3, Die4, Die5, Die6]

interface ApparatusProps {
  game: any
}

const fetchGame = async (gameId: any, notices: any) => {
  try {
    if (gameId && notices && notices.length > 0) {
      const game = JSON.parse(notices[notices.length - 1].payload).find(
        (game: any) => game.id === gameId
      )
      if (game) {
        return game
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching game state:', error)
    return null
  }
}

const Dice: FC<ApparatusProps> = ({ game }) => {

  const { notices, refetch } = useNotices()
  const rollups = useRollups(dappAddress)
  const [{ wallet }] = useConnectWallet()
  const diceRollSound = useAudio('/sounds/diceRoll.mp3')
  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )

  const [currentDice, setCurrentDice] = useState(0)
  const [delayedGame, setDelayedGame] = useState<any>(null)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [result, setResult] = useState(0)

  const joinGame = async () => {
    const id = window.location.pathname.split('/').pop()
    if (!id) return toast.error('Game not found')

    const addr: string | undefined = wallet?.accounts[0].address

    const jsonPayload = JSON.stringify({
      method: 'addParticipant',
      data: { gameId: id, playerAddress: addr },
    })

    const tx = await addInput(JSON.stringify(jsonPayload), dappAddress, rollups)

    const result = await tx.wait(1)
    console.log(result)
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDelayedGame(game)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [game])

  // const currentGame = delayedGame || game

  const handleEvent = useCallback(async () => {
    await refetch()
  }, [refetch])

  useEffect(() => {
    console.log('Setting up event listener')
    const handleInputAdded = (
      dappAddress,
      inboxInputIndex,
      sender,
      input: any
    ) => {
      const inputEvent = parseInputEvent(input)
      console.log('inside event input added')
      if (inputEvent.method === 'playGame' && game.rollOutcome !== 0) {
        console.log('inside conditional event input added')
        // setIsRolling(true)
      }
    }

    rollups?.inputContract.on('InputAdded', handleInputAdded)

    return () => {
      // Clean up by removing the event listener when the component unmounts
      rollups?.inputContract.removeListener('InputAdded', handleInputAdded)
    }
  }, [rollups])

  useEffect(() => {
    if (game?.rollOutcome !== null) {
      setIsRolling(true)

      const interval = setInterval(() => {
        setResult(Math.floor(Math.random() * 6) + 1)
      }, 100) // Adjust the interval speed as needed

      // Stop rolling after a certain time and show the final result
      setTimeout(() => {
        clearInterval(interval)
        diceRollSound?.play()
        setResult(game?.rollOutcome)
        setIsRolling(false)
      }, 2000) // Adjust the duration as needed

      return () => clearInterval(interval)
    }
  }, [game?.rollOutcome, diceRollSound])
 

  // useEffect(() => {
  //   console.log('inside rolig usefect')
  //   if (isRolling) {
  //     console.log('inside roling', game.rollOutcome)
  //     let endRoll = 0
  //     let interval: any
  //     let diceValue
  //     interval = setInterval(() => {
  //       if (endRoll < 30) {
  //         diceRollSound?.play()
  //         diceValue = Math.floor(Math.random() * 6)
  //         setCurrentDice(diceValue)
  //         endRoll++
  //       } else {
  //         if (game.rollOutcome !== 0) {
  //           setCurrentDice(game.rollOutcome - 1)
  //         } else {
  //           setCurrentDice(0)
  //         }
  //         console.log('setting isRolling to false')
  //         setIsRolling(false)
  //         clearInterval(interval)
  //       }
  //     }, 100)
  //     return () => {
  //       if (interval) clearInterval(interval)
  //     }
  //   }
  // }, [game?.rollOutcome, diceRollSound, isRolling])

  return (
    <div className="flex flex-col">
      {/* <div>
        <p>{isRolling ? 'Rolling...' : `Result: ${result}`}</p>
        <div className={`dicee ${isRolling ? 'rollingg' : ''}`}>
          {result !== null && (
            <img
              src={die[result - 1]} // Adjust for 0-based index
              alt={`Die ${result}`}
              className={`${currentDice === index ? '' : 'hidden'}`}
            />
          )}
        </div>
      </div> */}
      <button
        className={`hover:scale-105 active:scale-100 duration-300 md:w-auto w-[200px]`}
        onClick={() => playGame('yes')}
        disabled={isRolling}
      >
        {result !== null && (
          <Image
            src={die[result - 1]}
            alt={`Die ${result}`}
          />
        )}
        {/* {die.map((dice, index) => (
          <Image
            key={index}
            src={dice}
            alt="Dice"
            className={`${currentDice === index ? '' : 'hidden'}`}
          />
        ))} */}
      </button>
      {game && game.status === 'In Progress' && (
        <Button
          className="mt-6"
          style={{ background: '' }}
          onClick={() => playGame('no')}
        >
          Pass
        </Button>
      )}
      <div className="flex justify-center">
        {game &&
          game.status === 'New' &&
          wallet &&
          !players.includes(wallet.accounts[0].address) && (
            <div>
              <Button onClick={joinGame} className="mb-10" type="button">
                Join Game
              </Button>
            </div>
          )}
      </div>
    </div>
  )
}

export default Dice
