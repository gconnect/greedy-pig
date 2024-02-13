import { useSelector } from 'react-redux'
import {
  selectParticipants,
  Participant,
  // selectActivePlayer,
} from '@/features/leaderboard/leaderboardSlice'
import { EmptyPage } from '../shared/EmptyPage'

// import { useState } from 'react'

const LeaderBoard = () => {
  const players = useSelector((state: any) =>
    selectParticipants(state.leaderboard)
  )

  // const activePlayer = useSelector((state: any) =>
  //   selectActivePlayer(state.leaderboard)
  // )

  // const [activePlayer, setActivePlayer] = useState('')
  // const [socketInitialized, setSocketInitialized] = useState(false);

  return (
    <div className="relative flex flex-col w-full min-w-0 break-words border-0 border-transparent border-solid shadow-soft-xl rounded-2xl bg-clip-border mb-4 draggable">
      <div className="p-6 pb-0 mb-0 rounded-t-2xl">
        <h6>Leaderboard</h6>
      </div>
      {players.length ? (
        <div className="flex-auto px-0 pt-0 pb-2">
          <div className="p-0 overflow-x-auto">
            <table className="items-center w-full mb-0 align-top border-gray-200 text-slate-500">
              <thead className="align-bottom">
                <tr>
                  <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Player
                  </th>
                  <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Round
                  </th>
                  <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Turn Score
                  </th>
                  <th className="px-6 py-3 font-bold text-left uppercase align-middle bg-transparent border-b border-gray-200 shadow-none text-xxs border-b-solid tracking-none whitespace-nowrap text-slate-400 opacity-70">
                    Total Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {players &&
                  players.map((player: Participant, i: number) => (
                    <tr key={i}>
                      {/* <tr key={i} className={player.username === activePlayer ? 'bg-gray-100' : ''}> */}
                      <td className="p-2 align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <div className="flex px-2 py-1">
                          <div>
                            <img
                              src="https://demos.creative-tim.com/soft-ui-dashboard-tailwind/assets/img/team-2.jpg"
                              className="inline-flex items-center justify-center mr-4 text-white transition-all duration-200 ease-soft-in-out text-sm h-9 w-9 rounded-xl"
                              alt="user1"
                            />
                          </div>
                          <div className="flex flex-col justify-center">
                            <h6 className="mb-0 leading-normal text-sm">
                              {player.username}
                            </h6>
                          </div>
                        </div>
                      </td>
                      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <p className="mb-0 font-semibold leading-tight text-xs">
                          {player.playerInfo.turn}
                        </p>
                      </td>
                      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <span className="font-semibold leading-tight text-xs text-slate-400">
                          {player.playerInfo.turnScore}
                        </span>
                      </td>
                      <td className="p-2 text-center align-middle bg-transparent border-b whitespace-nowrap shadow-transparent">
                        <span className="font-semibold leading-tight text-xs text-slate-400">
                          {player.playerInfo.totalScore}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyPage text="No games" />
      )}
    </div>
  )
}

export default LeaderBoard
