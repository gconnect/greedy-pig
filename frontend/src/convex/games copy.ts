import { GameStatus } from '../interfaces';
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { vAddParticipant, vCreateGame } from './validators';
import { findGame } from './utils';

export const list = query({
  args: {},
  handler: async ({  db}) => {
    return await db.query("games").collect();
  },
});

export const getGameById = query({
  args: { id: v.id('games') },
    handler: async ({ db }, { id }) => {
      return await db
      .query("games")
      .filter((q) => q.eq(q.field("_id"), id))
      .first()
  }
})

export const getGamesByStatus = query({
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
    .collect()
 
  }
  
})

export const create = mutation({
  args: {game: vCreateGame},
  handler: async ({ db }, {game} ) => {
 
    const { activePlayer, creator, gameName, gameSettings, participants, status, startTime } = game
    
    // await db.insert('games', game)

    await db.insert('games', {
      activePlayer,
      creator,
      gameName,
      gameSettings,
      participants,
      status,
      startTime
    })
  },
})

export const updateParticipants = mutation({
  args: {id: v.id('games'), value: v.string()},
  handler: async ({db}, args) => {
      return await db.patch(args.id, { participants: [{address: args.value} ]})
  },
})

export const addParticipant = mutation({
  args: {id: v.id('games'), playerAddress: v.string()},
  // args: {game: vAddParticipant},
  handler: async ({ db }, args) => {

    const foundGame = await findGame(db, args.id)
    console.log('foundGame ', foundGame)
    return await db.patch(args.id, { participants: [{address: args.playerAddress} ]})
  },
})