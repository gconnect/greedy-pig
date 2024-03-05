'use client'

import Apparatus from '@/components/ui/Apparatus'
import LeaderBoard from './Leaderboard'
import { dappAddress, parseInputEvent } from '@/lib/utils'
import { useRollups } from '@/hooks/useRollups'
import { useNotices } from '@/hooks/useNotices'
import { useEffect } from 'react'
import { Balance } from './Balance'
import Settings from './Settings'

const GameArena = () => {
  const { notices, refetch } = useNotices()
  const rollups = useRollups(dappAddress)

  const handleEvent = async (sender: string, input: string) => {
    console.log('Received event:', sender, input)
    // console.log(hexToString(input))
    await refetch()
  }

  useEffect(() => {
    rollups?.inputContract.on(
      'InputAdded',
      (dappAddress, inboxInputIndex, sender, input) => {
        handleEvent(sender, input)
      }
    )
  }, [rollups, refetch])

  return (
    <div className="py-6 sm:py-8 lg:py-12">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        <div className="flex flex-col items-center gap-4  px-8 py-6 md:gap-6">
          {/* <Balance /> */}
          <Apparatus notices={notices} />
        </div>

        <div className="flex flex-col items-center gap-4 md:gap-6">
          <LeaderBoard notices={notices} />
        </div>
      </div>

      <Settings />
    </div>
  )
}

export default GameArena
