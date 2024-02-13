import { GameStatus } from '../interfaces';
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'

export const list = query({
  args: {},
  handler: async ({  db}) => {
    return await db.query("games").collect();
  },
});

export const ongoingGames = query({
  args: { gameStatus: v.union(
    v.literal(GameStatus.InProgress), 
    v.literal(GameStatus.Ended), 
    v.literal(GameStatus.Cancelled), 
    v.literal(GameStatus.New)
    ) },
  handler: async ({ db }, { gameStatus }) => {
return await db
    .query("games")
    .withIndex('by_status', (q) => q.eq('status', gameStatus))
 
  }
  
})

export const create = mutation({
  args: {
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
    status: v.union(v.literal(GameStatus.New), v.literal(GameStatus.Cancelled), v.literal(GameStatus.Ended), v.literal(GameStatus.InProgress)),
    startTime: v.string()
  },
  handler: async (ctx, args) => {
    // const { activePlayer, creator, gameName, gameSettings, participants, status, startTime } = args
    
    await ctx.db.insert('games', args)

    // await ctx.db.insert('games', {
    //   activePlayer,
    //   creator,
    //   gameName,
    //   gameSettings,
    //   participants,
    //   status,
    //   startTime
    // })
  },
})