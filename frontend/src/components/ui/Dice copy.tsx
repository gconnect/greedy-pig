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
import { selectParticipantAddresses, selectSelectedGame } from '@/features/games/gamesSlice'
import { dappAddress } from '@/lib/utils'
import { useConnectWallet } from '@web3-onboard/react'
import { addInput } from '@/lib/cartesi'
import { useRollups } from '@/hooks/useRollups'
import { useNotices } from '@/hooks/useNotices'
import Button from '../shared/Button'

const die = [Die1, Die2, Die3, Die4, Die5, Die6]

interface ApparatusProps {
  // handleDiceClick: () => void
  // setIsRolling: (value: boolean) => void
  // isRolling: boolean
  // value: number
}

const Dice: FC<ApparatusProps> = () => {
// const Dice: FC<ApparatusProps> = ({handleDiceClick, setIsRolling, isRolling, value}) => {

  const { refetch } = useNotices()
  const rollups = useRollups(dappAddress)
  const [{ wallet }] = useConnectWallet()
  const diceRollSound = useAudio('/sounds/diceRoll.mp3')
  const game = useSelector((state: any) => selectSelectedGame(state.games))
  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )
  
  const [currentDice, setCurrentDice] = useState(0);
  const [delayedGame, setDelayedGame] = useState<any>(null)
  const [isRolling, setIsRolling] = useState<boolean>(false)
  const [pass, setPass] = useState<boolean>(false)

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

  const currentGame = delayedGame || game

    const handleEvent = useCallback(async () => {
      await refetch()
    }, [refetch])

    useEffect(() => {
      rollups?.inputContract.on(
        'InputAdded',
        (dappAddress, inboxInputIndex, sender, input) => {
          handleEvent()
        }
      )
    }, [handleEvent, rollups])

    useEffect(() => {
      rollups?.inputContract.on(
        'InputAdded',
        (dappAddress, inboxInputIndex, sender, input) => {
          handleEvent().then(() => {
            if (parseInputEvent(input).method === 'playGame' && game.rollOutcome !== 0 && !pass) {
              setIsRolling(true)
            } else if (pass) {
              setPass(false)
            }
          })
        }
      )
    }, [handleEvent, rollups, game, isRolling])

  useEffect(() => {
    console.log('inside rolig usefect')
    if (isRolling) {
      console.log('inside roling', currentGame.rollOutcome)
      let endRoll = 0
      let interval: any
      let diceValue
      interval = setInterval(() => {
        if (endRoll < 30) {
          diceRollSound?.play()
          diceValue = Math.floor(Math.random() * 6)
          setCurrentDice(diceValue)
          endRoll++
        } else {
          if (currentGame.rollOutcome !== 0) {
            setCurrentDice(currentGame.rollOutcome - 1)
          } else {
            setCurrentDice(0)
          }
          clearInterval(interval)
          setIsRolling(false)
        }
      }, 100)
    }
  }, [isRolling, currentGame, diceRollSound])

  return (
    <div className="flex flex-col">
      <button
        className={`hover:scale-105 active:scale-100 duration-300 md:w-auto w-[200px]`}
        onClick={() => playGame('yes')}
        disabled={isRolling}
      >
        {die.map((dice, index) => (
          <Image
            key={index}
            src={dice}
            alt="Dice"
            className={`${currentDice === index ? '' : 'hidden'}`}
          />
        ))}
      </button>
      {currentGame && currentGame.status === 'In Progress' && (
        <Button
          className="mt-6"
          style={{ background: '' }}
          onClick={() => playGame('no')}
        >
          Pass
        </Button>
      )}
    </div>
  )
}

export default Dice
