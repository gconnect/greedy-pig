import { mutation } from './_generated/server'
import { v } from 'convex/values'

export const send = mutation({
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
    ended: v.boolean(),
    startTime: v.string()
  },
  handler: async (ctx, args) => {
    const { activePlayer, creator, gameName, gameSettings, participants, ended, startTime } = args
    // Insert the new game into the database
    await ctx.db.insert('games', {
      activePlayer,
      creator,
      gameName,
      gameSettings,
      participants,
      ended,
      startTime
    })
  },
})

// import { v, Infer } from "convex/values";
// import { mutation, query } from "./_generated/server";
// import { vCreateGame } from "./validators"

// const nestedObject = v.object({
//   property: v.string(),
// });

// // Resolves to `{property: string}`.
// export type NestedObject = Infer<typeof nestedObject>;

// export const get = query({
//   args: {},
//   handler: async (ctx) => {
//     return await ctx.db.query("games").collect();
//   },
// });

// export const send = mutation({
//   args: {
//     creator: v.string(),
//     gameName: v.string(),
//     activePlayer: v.string(),
//     participants: v.array(v.object({
//       address: v.string(),
//       playerInfo: v.object({
//         turn: v.number(),
//         turnScore: v.number(),
//         totalScore: v.number()
//       })
//     })),
//     gameSettings: v.object({
//       turnTimeLimit: v.float64(),
//         winningScore: v.float64(),
//         mode: v.string(),
//         apparatus: v.string(),
//         bet: v.boolean(),
//         maxPlayer: v.float64(),
//         limitNumberOfPlayer: v.boolean()
//     })
//    },
//   handler: async ({ db }, args) => {

//     await db.insert("games", args)
//   }
// })
