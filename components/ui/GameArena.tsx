'use client'

import Roulette from '@/components/ui/Roullete'
import LeaderBoard from './Leaderboard';
import { useDispatch, useSelector } from 'react-redux';
import { initLeaderboard } from '@/features/leaderboard/leaderboardSlice';
import { useCallback } from 'react';
const GameArena = () => { 


  const dispatch = useDispatch();

  // const handleIncrement = useCallback(() => {
  //   dispatch(updateTest('justin'));
  // }, [dispatch]);

  // const participants = useSelector((state: any) => state.leaderboard.participants);

  return (

<div className="py-6 sm:py-8 lg:py-12">
  <div className="mx-auto max-w-screen-xl px-4 md:px-8">
    <h2 className="mb-8 text-center text-2xl font-bold text-gray-800 md:mb-12 lg:text-3xl">What others hh</h2>

    <div className="grid gap-4 md:grid-cols-2 md:gap-8">

      <div className="flex flex-col items-center gap-4 rounded-lg bg-indigo-500 px-8 py-6 md:gap-6">
        <Roulette />
      </div>
     
     <div className="flex flex-col items-center gap-4 rounded-lg bg-indigo-500 px-8 py-6 md:gap-6">
       <LeaderBoard />
      </div>

    </div>
  </div>
</div>

  )

}

export default GameArena;