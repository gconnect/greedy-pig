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


const Dice: FC<ApparatusProps> = ({ game }) => {

  const rollups = useRollups(dappAddress)
  const [{ wallet }] = useConnectWallet()
  const diceRollSound = useAudio('/sounds/diceRoll.mp3')
  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )

  const [rollCount, setRollCount] = useState<number>(0)
  const [delayedGame, setDelayedGame] = useState<any>(null)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [result, setResult] = useState(1)

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

  useEffect(() => {
    setRollCount((prevCount) => prevCount + 1)
  }, [result])

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


  // useEffect(() => {
  //   if (game?.rollOutcome !== null) {
  //     setIsRolling(true)

  //     const interval = setInterval(() => {
  //       diceRollSound?.play()
  //       setResult((prevResult) => {
  //         // Generate a new random result different from the previous one
  //         let newResult
  //         do {
  //           newResult = Math.floor(Math.random() * 6) + 1
  //         } while (newResult === prevResult)
  //         return newResult
  //       })
  //     }, 80) // Adjust the interval speed as needed

  //     // Stop rolling after a certain time and show the final result
  //     setTimeout(() => {
  //       clearInterval(interval)
  //       setResult(game?.rollOutcome)
  //       setIsRolling(false)
  //     }, 4000) // Adjust the duration as needed

  //     return () => clearInterval(interval)
  //   }
  // }, [game?.rollOutcome, game?.dateCreated, diceRollSound])



  useEffect(() => {
    if (game?.rollOutcome !== null) {
      setIsRolling(true)

      const interval = setInterval(() => {
        diceRollSound?.play()
        setResult(Math.floor(Math.random() * 6) + 1)
      }, 80) // Adjust the interval speed as needed

      // Stop rolling after a certain time and show the final result
      setTimeout(() => {
        clearInterval(interval)
        
        setResult(game?.rollOutcome)
        setIsRolling(false)
      }, 4000) // Adjust the duration as needed

      return () => clearInterval(interval)
    }
  }, [game?.rollOutcome, game?.dateCreated, diceRollSound])


  return (
    <div className="flex flex-col">
      <button
        className={`hover:scale-105 active:scale-100 duration-300 md:w-auto w-[200px]`}
        onClick={() => playGame('yes')}
        disabled={isRolling}
      >
        {result !== null && (
          <Image
            src={die[result - 1]}
            alt={`Die ${result}`}
            className={`die ${rollCount}`} // Rerenders the die when the roll count changes
          />
        )}
      </button>

      <div className="flex justify-center">
        {game && game.status === 'In Progress' && (
          <Button
            className="mt-6"
            style={{ background: '' }}
            onClick={() => playGame('no')}
          >
            Pass
          </Button>
        )}
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
