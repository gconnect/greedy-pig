
import { useEffect, useState } from 'react'
import Roulette from '@/components/ui/Roulette'
import { hexToString } from 'viem'
import toast from 'react-hot-toast'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress, getParticipantsForGame } from '@/lib/utils'
import { useNotices } from '@/hooks/useNotices'
import { useConnectContext } from '@/components/providers/ConnectProvider'
import { addInput } from '@/lib/cartesi'
import Button from '../shared/Button'

export default function RoulleteGame() {

  const { notices } = useNotices()
  const { wallet } = useConnectContext()
  const rollups = useRollups(dappAddress)

  const [gameId, setGameId] = useState<string>('')
  const [players, setPlayers] = useState<string[]>([])

  const handleSpinResult = async (result: number) => {

   
    
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
      getParticipantsForGame(gameId, notices).then((fetchedPlayers) => {
        setPlayers(fetchedPlayers);
      });
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

      <Button onClick={() => joinGame(gameId)} className="mb-10" type="button">
        Join Game
      </Button>
      {/* <Button onClick={playGame} className="mb-10" type="button">
        Play Game
      </Button> */}
      {/* <Roulette
        gameId={gameId}
        onSpinResult={handleSpinResult} 
        players={players} 
      /> */}
    </div>
  )
}
