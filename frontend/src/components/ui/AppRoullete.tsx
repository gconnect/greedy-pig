// 'use client'

import { useEffect, useRef } from 'react'
import UsernamesForm from '@/components/ui/UsernamesForm'
import { initSocket, getSocket } from '@/lib/socket'
import {
  InputFunction,
  RollFunction,
  OutputFunction,
  playGame,
} from '@/lib/utils'
import { useState } from 'react'
import { Roulette, useRoulette } from 'react-hook-roulette'
import {
  selectParticipants,
  selectUsernames,
  UpdatePlayerInfoPayload,
} from '@/features/leaderboard/leaderboardSlice'
import { useDispatch, useSelector } from 'react-redux'
import store from '@/store'
import { addInput } from '@/lib/cartesi'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress } from '@/lib/utils'

import Lists from './Lists'
import ConfirmModal from './ConfirmModal'
import toast from 'react-hot-toast'
import { Socket } from 'socket.io-client'

let socket: Socket

export default function AppRoullete() {
  const rollups = useRollups(dappAddress)
  const usernames = useSelector((state: any) =>
    selectUsernames(state.leaderboard)
  )
  const dispatch = useDispatch()

  const [socketInitialized, setSocketInitialized] = useState(false)
  const [gameInProgress, setGameInProgress] = useState<boolean>(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalQuestion, setModalQuestion] = useState('')
  const [handleUserInput, setHandleUserInput] = useState<
    (answer: string) => void
  >(() => () => {})
  const [rollResult, setRollResult] = useState<number | null>(null)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const stopButtonRef = useRef<HTMLButtonElement | null>(null)
  const { roulette, onStart, onStop } = useRoulette({
    items: [
      { name: '1', bg: '#b26527', color: '#ffffff' },
      { name: '2', bg: '#ce9729', color: '#ffffff' },
      { name: '3', bg: '#e7c02b', color: '#ffffff' },
      { name: '4' },
      { name: '5' },
      { name: '6' },
    ],
    onSpinEnd: (res) => {
      setRollResult(Number(res))
    },
    options: {
      maxSpeed: 20,
      acceleration: 8,
      determineAngle: 90,
      style: {
        canvas: {
          bg: 'transparent',
        },
        arrow: {
          bg: '#000',
          size: 26,
        },
        label: {
          font: '28px Arial',
          align: 'right',
          baseline: 'middle',
          offset: 0.65,
          defaultColor: '#000',
        },
      },
    },
  })

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleStopGame = () => {
    setIsGameStarted(false)
    onStop()
  }

  const getOutput: OutputFunction = (user: string, message: string) => {
    return new Promise(async (resolve) => {
      toast.success(`${user} ${message}`, {
        duration: 6000,
      })
      dispatch({ type: 'leaderboard/updateActivePlayer', payload: user })
      debugger
      const socket = getSocket()
      if (socket) {
        socket.emit('activePlayer', user)
      }
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

  const startRouletteSpin = async () => {
    setIsGameStarted(true)
    onStart() // Start the roulette spinning
  }

  const getRoll: RollFunction = async () => {
    return new Promise((resolve) => {
      startRouletteSpin()

      setTimeout(() => {
        if (stopButtonRef.current) {
          stopButtonRef.current.click()

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

  const startGame = async () => {
    setGameInProgress(true)
    try {
      const result = await playGame(
        usernames,
        getInput,
        getRoll,
        2,
        getOutput,
        {
          updatePlayerInfo: (action: UpdatePlayerInfoPayload) => {
            dispatch({ type: 'leaderboard/updatePlayerInfo', payload: action })
          },
        }
      )

      const updatedParticipants = selectParticipants(
        store.getState().leaderboard
      )

      const jsonPayload = JSON.stringify({
        method: 'saveLeaderboard',
        data: {
          leaderboard: updatedParticipants,
        },
      })

      const tx = await addInput(
        JSON.stringify(jsonPayload),
        dappAddress,
        rollups
      )

      console.log(tx)
      const res = await tx.wait(1)
      console.log(res)

      setGameInProgress(false)
      toast.success(`Game finished!. ${result}`, {
        duration: 6000,
      })
      dispatch({ type: 'leaderboard/resetLeaderboard' })
    } catch (error) {
      console.error('Error during game:', error)
    }
  }

  return (
    <div>
      {/* <div className="min-h-2"> */}
      {/* <div className="mt-4">{output}</div>
        {!gameInProgress && <UsernamesForm />}
      </div> */}

      <ConfirmModal onSubmit={handleUserInput} showModal={modalIsOpen} />

      <button onClick={startGame} type="button">
        Play game
      </button>

      <Roulette roulette={roulette} />

      <div className="hidden" id="roll-result">
        {rollResult}
      </div>
      <button
        className="hidden"
        ref={stopButtonRef}
        type="button"
        onClick={handleStopGame}
        disabled={!isGameStarted}
      />

      <Lists />
    </div>
  )
}
