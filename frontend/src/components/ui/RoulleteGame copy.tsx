// 'use client'

import { useState, useEffect, useRef } from 'react'
import { hexToString } from 'viem'
import {
  InputFunction,
  RollFunction,
  OutputFunction,
  playGame,
  UpdatePlayerInfo,
} from '@/lib/utils'

import { useDispatch } from 'react-redux'
import { addInput } from '@/lib/cartesi'
import { useChannel, useConnectionStateListener, useAbly } from 'ably/react'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress, getParticipantsForGame } from '@/lib/utils'
import ConfirmModal from './ConfirmModal'
import toast from 'react-hot-toast'
import { useConnectContext } from '@/components/providers/ConnectProvider'
import Button from '../shared/Button'
import { useNotices } from '@/hooks/useNotices'
import Roulette from './Roulette'

export default function RoulleteGame() {

  // useConnectionStateListener('connected', () => {
  //   console.log('Connected to Ably!');
  // });


  //  const { channel: rollChannel } = useChannel('game-channel', 'rollRoulette', (message) => {
  //   console.log('Received message:', message);
  //   // startRouletteSpin();
  // });

  // const { channel: stopChannel } = useChannel('game-channel', 'stopRoulette', (message) => {
  //   console.log('Received message:', message);
  //   if (stopButtonRef.current) {
  //     stopButtonRef.current.click();
  //   } 
  // });

//  console.log('channenlstart ', rollChannel)
//  console.log('channenlstop ', stopChannel)
  
  const { notices } = useNotices()
  const { wallet } = useConnectContext()
  const rollups = useRollups(dappAddress)

  const dispatch = useDispatch()

  const [messages, setMessages] = useState<any[]>([]);
  const [gameId, setGameId] = useState<string>('')
  const [gameInProgress, setGameInProgress] = useState<boolean>(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalQuestion, setModalQuestion] = useState('')
  const [handleUserInput, setHandleUserInput] = useState<
    (answer: string) => void
  >(() => () => {})
  const [rollResult, setRollResult] = useState<number | null>(null)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const stopButtonRef = useRef<HTMLButtonElement | null>(null)
 

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)



  const getOutput: OutputFunction = (user: string, message: string) => {
    return new Promise(async (resolve) => {
      toast.success(`${user} ${message}`, {
        duration: 6000,
      })
      dispatch({ type: 'leaderboard/updateActivePlayer', payload: user })

      // const socket = getSocket()
      // if (socket) {
      //   socket.emit('activePlayer', user)
      // }
      resolve(message)
    })
  }

  const getInput: InputFunction = async (question: string) => {
    return new Promise((resolve) => {
      setModalQuestion(question)
      openModal()

      const handleUserInput = (answer: string) => {
        closeModal()
        resolve(answer)
      }

      setHandleUserInput(() => handleUserInput)
    })
  }



  const getRoll: RollFunction = async () => {
    return new Promise((resolve) => {
      // startRouletteSpin()

      // rollChannel.publish('rollRoulette', 'roll roulette age!')

      setTimeout(() => {
        if (stopButtonRef.current) {
          // stopChannel.publish('roullRoulette', 'stioooop roulette')
          // stopButtonRef.current.click()

          setTimeout(() => {
            const rollResultElement = document.getElementById('roll-result')
            if (rollResultElement) {
              const rollResultValue = rollResultElement.innerText
              return resolve(Number(rollResultValue))
            }
          }, 500)
        }
      }, 2000)
    })
  }

  const playGame = async () => {

    const playerAddress = wallet.accounts[0].address
    if (!playerAddress) return toast.error('Player not connected')

    setGameInProgress(true)
    const players = await getParticipantsForGame(gameId, notices)

    if (players.length >= 2) {

      try {
        const jsonPayload = JSON.stringify({
        method: 'playGame',
        data: { gameId, playerAddress },
    })

    const tx = await addInput(JSON.stringify(jsonPayload), dappAddress, rollups)

    console.log('txxx ', tx)
    const result = await tx.wait(1)
    console.log(result)



        // const result = await playGame(
        //   players,
        //   getInput,
        //   getRoll,
        //   2,
        //   getOutput,
        //   updatePlayerInfo
        // )
  
        setGameInProgress(false)
        // toast.success(`Game finished!. ${result}`, {
        //   duration: 6000,
        // })
        // dispatch({ type: 'leaderboard/resetLeaderboard' })
      } catch (error) {
        console.error('Error during game:', error)
      }
    } else {
      toast.error('Not enough players to start the game!')
    }
  }

  const updatePlayerInfo: UpdatePlayerInfo = async (
    player: string,
    key: string,
    value: number
  ) => {

    const jsonPayload = JSON.stringify({
      method: 'updateParticipant',
      data: { player, key, value },
    })

    const tx = await addInput(JSON.stringify(jsonPayload), dappAddress, rollups)

    console.log('txxx ', tx)
    const result = await tx.wait(1)
    console.log(result)
  }

  const joinGame = async (id: any) => {
    const addr: string = wallet?.accounts[0].address

    const jsonPayload = JSON.stringify({
      method: 'addParticipant',
      data: { gameId: id, playerAddress: addr },
    })

    const tx = await addInput(JSON.stringify(jsonPayload), dappAddress, rollups)

    console.log('txxx ', tx)
    const result = await tx.wait(1)
   
  }

  useEffect(() => {
   
    const id = window.location.pathname.split('/').pop()
    if (id) {
      setGameId(id)
    }
  }, [])

  const handleEvent = async (
    dappAddress: string,
    inboxInputIndex: string,
    sender: string,
    input: string
  ) => {
    console.log('Received event:', dappAddress, inboxInputIndex, sender, input)
    console.log(hexToString(`0x${input}`))

  }

   const handleSpinResult = (value: number) => {
    console.log('Result of the spinn:', value);
    // Do something with the spin result
  };

  useEffect(() => {
    rollups?.inputContract.on(
      'InputAdded',
      (dappAddress, inboxInputIndex, sender, input) => {
        handleEvent(dappAddress, inboxInputIndex, sender, input)
      }
    )
  }, [rollups])

  return (
    <div>
{/* <button onClick={() => { rollChannel.publish('rollRoulette', 'Here is my first message!') }}>
        Publish
      </button> */}
      {/* <Button onClick={() => joinGame(gameId)} className="mb-10" type="button">
        Join Game
      </Button>
      <Button onClick={playGame} className="mb-10" type="button">
        Start Game
      </Button> */}

      <Roulette onSpinResult={handleSpinResult} />
      <ConfirmModal onSubmit={handleUserInput} showModal={modalIsOpen} />

    </div>
  )
}
