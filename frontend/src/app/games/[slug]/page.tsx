
'use client'


import { v } from 'convex/values'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import GameSettings from '@/components/ui/GameSettings'
import GameArena from '@/components/ui/GameArena'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Header from '@/components/shared/Header'



export default function GamePage({ params }: { params: { slug: string } }) {

  const game = useQuery(api.games.getGameById, { id: params.slug })


  const dispatch = useDispatch()

  useEffect(() => {

    if (game) {
      dispatch({type: 'games/setGame', payload: game})
    } 

  }, [game])

  return (
  
  <div>
    <GameSettings />

      <GameArena />
  </div>
)}