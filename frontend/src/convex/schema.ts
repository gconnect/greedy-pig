import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  games: defineTable({
    activePlayer: v.string(),
    creator: v.string(),
    gameName: v.string(),
    gameSettings: v.object({
      apparatus: v.string(),
      bet: v.boolean(),
      limitNumberOfPlayer: v.boolean(),
      maxPlayer: v.float64(),
      mode: v.string(),
      turnTimeLimit: v.float64(),
      winningScore: v.float64(),
    }),
    participants: v.array(
      v.object({
        address: v.string(),
        playerInfo: v.object({
          totalScore: v.float64(),
          turn: v.float64(),
          turnScore: v.float64(),
        }),
      })
    ),
    ended: v.boolean(),
    startTime: v.string()
  })
})
