'use client'

import Hero from '@/components/ui/Hero'

import Features from '@/components/ui/Features'
import Stats from '@/components/ui/Stats'
import UpcomingGames from '@/components/shared/UpcomingGames'
import CreateGameModal from '@/components/ui/CreateGameModal'

export default function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <UpcomingGames />
      <Features />
      <CreateGameModal />
    </div>
  )
}
