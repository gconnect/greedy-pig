
import { FC, useState, useEffect, useRef } from 'react'
import ReactDice, { ReactDiceRef } from 'react-dice-complete'
import { useConnectWallet } from '@web3-onboard/react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import Button from '@/components/shared/Button'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress } from '@/lib/utils'
import { addInput } from '@/lib/cartesi'
import ConfirmModal from './ConfirmModal'

interface RouletteProps {
  gameId: string
  players: string[]
  notices: any
}

const MyDiceApp: FC<RouletteProps> = ({ gameId, players, notices }) => {

  const dispatch = useDispatch()
  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)
  const reactDice = useRef<ReactDiceRef>(null)

  const [game, setGame] = useState<any>()
  const [activePlayer, setActivePlayer] = useState<string>('')

  const rollDone = (totalValue: number, values: number[]) => {
    console.log('individual die values array:', values)
    console.log('total dice value:', totalValue)
  }

  const rollAll = () => {
    reactDice.current?.rollAll([3])
  }

    const handleResponse = (response: string) => {
    playGame(response)
  }

  const playGame = async (response: string) => {
    const playerAddress = wallet?.accounts[0].address

    if (game.status === 'Ended') {
      return toast.error('Game has ended')
    }

    if (activePlayer !== playerAddress) {
      return toast.error('Not your turn')
    }

    if (!playerAddress) return toast.error('Player not connected')

    if (players.length >= 2) {
      
      const playerAddress = wallet?.accounts[0].address

      game.status === 'New' ? dispatch({ type: 'leaderboard/initTurnSync', payload: true}) : ''

      dispatch({ type: 'modal/toggleConfirmModal' })

      try {
        const jsonPayload = JSON.stringify({
          method: 'playGame',
          data: { gameId, playerAddress, response }
        })

        const tx = await addInput(
          JSON.stringify(jsonPayload),
          dappAddress,
          rollups
        )
        
        console.log('dice tx ', tx)
        const result = await tx.wait(1)

      } catch (error) {
        console.error('Error during game:', error)
      }

   

    } else {
      toast.error('Not enough players to play')
    }
  }

    useEffect(() => {
    if (notices && notices.length > 0) {
      if (gameId) {
        const game = JSON.parse(notices[notices.length - 1].payload).find(
          (game: any) => game.id === gameId
        )
        if (game) {
          setGame(game)
          console.log(`game angle , ${game.startAngle}`)

          setActivePlayer(game.activePlayer)
  
          if (game.status === 'Ended') {
            // audio.play(); // Play the audio when the game is over
            toast.success('Game has ended');
          }
        
        }
      }
    }
  }, [notices, gameId])

  return (
    <div>
      <h2 onClick={rollAll}>Rollll</h2>
      {game && game.status !== 'Ended' && <Button
        type="button"
        id="spin"
        onClick={() => dispatch({ type: 'modal/toggleConfirmModal' })}
      >
        Play Game
      </Button>}
      <ReactDice
        numDice={1}
        ref={reactDice}
        rollDone={rollDone}
        disableIndividual={true}
        dieSize={140}
      />
      <ConfirmModal onSubmit={handleResponse} activePlayer={activePlayer} />
    </div>
  )

}

export default MyDiceApp