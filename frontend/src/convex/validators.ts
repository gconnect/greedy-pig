import { v } from 'convex/values'


export const vCreateGame = v.object({
  activePlayer: v.string(),
  creator: v.string(),
  gameName: v.string(),
  // participants: v.array(v.string()),
  participants: v.array(v.object({
    address: v.string(),
    playerInfo: v.object({
      turn: v.number(),
      turnScore: v.number(),
      totalScore: v.number(),
    }),
  })),
  gameSettings: v.object({
    turnTimeLimit: v.number(),
    winningScore: v.number(),
    mode: v.string(), 
    apparatus: v.string(),
    bet: v.boolean(),
    maxPlayer: v.number(),
    limitNumberOfPlayer: v.boolean()
  })
})