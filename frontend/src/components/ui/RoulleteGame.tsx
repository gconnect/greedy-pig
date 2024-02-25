
import { useEffect, useRef, useState } from 'react'
import Roulette from '@/components/ui/Roulette'
import { hexToString } from 'viem'
import toast from 'react-hot-toast'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress, getParticipantsForGame } from '@/lib/utils'
import { useNotices } from '@/hooks/useNotices'
import { addInput } from '@/lib/cartesi'
import Button from '../shared/Button'
import { useConnectWallet } from '@web3-onboard/react'

export default function RoulleteGame({notices}: any) {

  // const { notices } = useNotices()
   const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)

  const [gameId, setGameId] = useState<string>('')
  const [players, setPlayers] = useState<string[]>([])

  const handleSpinResult = async (result: number) => {

   
    
  }

  const joinGame = async (id: any) => {
    const addr: string | undefined = wallet?.accounts[0].address
alert(addr)
//0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
//0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
    const jsonPayload = JSON.stringify({
      method: 'addParticipant',
      data: { gameId: id, playerAddress: addr },
    })

    const tx = await addInput(JSON.stringify(jsonPayload), dappAddress, rollups)

    console.log('txxx ', tx)
    const result = await tx.wait(1)
    console.log(result)
   
  }

  const noticesRef = useRef(notices); // Initialize useRef with initial value of notices

  useEffect(() => {
    noticesRef.current = notices; // Update the ref value whenever notices changes
  }, [notices]);

    useEffect(() => {
   
    const id = window.location.pathname.split('/').pop()
    if (id) {
      setGameId(id)
      // setTimeout(() => {
        getParticipantsForGame(gameId, notices).then((fetchedPlayers) => {
          setPlayers(fetchedPlayers);
        })
      //  }, 5000)
    }
  }, [gameId, notices])

  const handleEvent = async (
    dappAddress: string,
    inboxInputIndex: string,
    sender: string,
    input: string
  ) => {
    console.log('Received event:', dappAddress, inboxInputIndex, sender, input)
    // console.log(hexToString(`${input}`))

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
      <Roulette
        gameId={gameId}
        onSpinResult={handleSpinResult} 
        players={players} 
        notices={notices}
      />
    </div>
  )
}
