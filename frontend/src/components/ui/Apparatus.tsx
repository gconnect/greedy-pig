'use client'
import { FC, useState, useEffect } from 'react'
import { useConnectWallet } from '@web3-onboard/react'
import { useSelector } from 'react-redux'
import Button from '@/components/shared/Button'
import { useRollups } from '@/hooks/useRollups'
import { dappAddress } from '@/lib/utils'
import { addInput } from '@/lib/cartesi'
import { Wallet } from 'cartesi-wallet'
import {
  selectParticipantAddresses,
  selectSelectedGame,
} from '@/features/games/gamesSlice'
import Dice from '@/components/ui/Dice'
import useAudio from '@/hooks/useAudio'

interface RouletteProps {
  // notices: any
}

const myWallet = new Wallet(new Map())

const Apparatus: FC<RouletteProps> = () => {

  const [{ wallet }] = useConnectWallet()
  const rollups = useRollups(dappAddress)

  const game = useSelector((state: any) => selectSelectedGame(state.games))
  const players = useSelector((state: any) =>
    selectParticipantAddresses(state.games)
  )

  const [gameId, setGameId] = useState<string>('')



  const joinGame = async (id: any) => {

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

  }

  useEffect(() => {
    const id = window.location.pathname.split('/').pop()
    if (id) {
      setGameId(id)
    }
  }, [gameId])

 

  return (
    <div className="w-[300px]">
      <div className="flex justify-center mb-[60px]">
        {/* <Dice  /> */}
      </div>

      <div className="flex justify-center">
        {game &&
          game.status === 'New' &&
          wallet &&
          !players.includes(wallet.accounts[0].address) && (
            <div>
              <Button
                onClick={() => joinGame(gameId)}
                className="mb-10"
                type="button"
              >
                Join Game
              </Button>

            </div>
          )}
      </div>
    </div>
  )
}

export default Apparatus
