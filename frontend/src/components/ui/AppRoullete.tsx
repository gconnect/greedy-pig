// 'use client'

import { useRef } from 'react'
import UsernamesForm from '@/components/ui/UsernamesForm'
import ResponseForm from '@/components/ui/ResponseForm'
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

export default function AppRoullete() {
  const rollups = useRollups(dappAddress)
  const usernames = useSelector((state: any) =>
    selectUsernames(state.leaderboard)
  )
  const dispatch = useDispatch()

  const [gameInProgress, setGameInProgress] = useState<boolean>(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [modalQuestion, setModalQuestion] = useState('')
  const [output, setOutput] = useState('')
  const [handleUserInput, setHandleUserInput] = useState<
    (answer: string) => void
  >(() => () => {})
  const [rollResult, setRollResult] = useState<number | null>(null)
  const [isGameStarted, setIsGameStarted] = useState(false)
  const stopButtonRef = useRef(null)
  const { roulette, onStart, onStop } = useRoulette({
    items: [
      { name: '1', bg: '#b26527', color: '#ffffff' },
      { name: '2', bg: '#ce9729', color: '#ffffff' },
      { name: '3', bg: '#e7c02b', color: '#ffffff' },
      { name: '4' },
      { name: '5' },
      { name: '6' },
      { name: '7' },
      { name: '8' },
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
      setOutput(`${user} ${message}`)
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

  const handleModalSubmit = async (answer: string) => {
    // Handle modal submission here
    // You can set state or perform any actions based on the submitted answer
    console.log('Submitted answer:', answer)

    return answer
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
      setOutput(`Game finished!. ${result}`)
      dispatch({ type: 'leaderboard/resetLeaderboard' })
    } catch (error) {
      console.error('Error during game:', error)
    }
  }

  return (
    <div>
      <div className="min-h-2">
        <div className="mt-4">{output}</div>
        {!gameInProgress && <UsernamesForm />}
      </div>

      <ResponseForm
        isOpen={modalIsOpen}
        closeModal={closeModal}
        onSubmit={handleModalSubmit}
        question={modalQuestion}
        handleUserInput={handleUserInput}
      />
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
