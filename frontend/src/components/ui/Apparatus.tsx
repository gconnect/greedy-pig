import { useEffect, useRef, useState } from 'react'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress, getParticipantsForGame } from '@/lib/utils'
import { addInput, sendEther } from '@/lib/cartesi'
import Button from '../shared/Button'
import { useConnectWallet } from '@web3-onboard/react'
import toast from 'react-hot-toast'
import Dice from './Dice'
import { useSelector } from 'react-redux'
import {
  selectParticipantAddresses,
  selectSelectedGame,
} from '@/features/games/gamesSlice'
import useAudio from '@/hooks/useAudio'

export default function Apparatus() {

  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)
  // const noticesRef = useRef(notices)

  const game = useSelector((state: any) => selectSelectedGame(state.games))

  const [gameId, setGameId] = useState<string>('')

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

  // useEffect(() => {
  //   noticesRef.current = notices // Update the ref value whenever notices changes
  // }, [notices])

  useEffect(() => {
    const id = window.location.pathname.split('/').pop()
    if (id) {
      setGameId(id)
    }
  }, [gameId])

  return (
    <div>
      {game && game.status === 'New' && (
        <Button
          onClick={() => joinGame(gameId)}
          className="mb-10"
          type="button"
        >
          Join Game
        </Button>
      )}
      <Dice />
    </div>
  )
}
