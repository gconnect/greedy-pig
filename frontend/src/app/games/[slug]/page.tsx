'use client'

import GameSettings from '@/components/ui/GameSettings'
import GameArena from '@/components/ui/GameArena'

import Header from '@/components/shared/Header'

export default function GamePage({ params }: { params: { slug: string } }) {
  return (
    <div>
      <Header />
      <GameSettings />
      <GameArena />
    </div>
  )
}
