import { useEffect, useState } from 'react'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress } from '@/lib/utils'
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

export default function Apparatus() {

  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)
  // const noticesRef = useRef(notices)

  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )
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

  useEffect(() => {
    const id = window.location.pathname.split('/').pop()
    if (id) {
      setGameId(id)
    }
  }, [gameId])

  return (
    <div>
      <Dice />
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
    </div>
  )
}
