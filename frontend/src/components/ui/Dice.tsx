
import { FC, useState, useEffect, useRef } from 'react'
import ReactDice, { ReactDiceRef } from 'react-dice-complete'
import { useConnectWallet } from '@web3-onboard/react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import Button from '@/components/shared/Button'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress } from '@/lib/utils'

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
    </div>
  )

}

export default MyDiceApp