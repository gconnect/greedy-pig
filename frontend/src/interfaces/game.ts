export interface IGame {
  id: string
  gameName: string
  gameSettings: {
    bet: boolean
    betAmount: number
    apparatus: string
  }
}
