import { GameStatus } from "./convex"

export interface IGame {
  id: string
  gameName: string
  status: GameStatus
  gameSettings: {
    bet: boolean
    betAmount: number
    apparatus: string
  }
}
