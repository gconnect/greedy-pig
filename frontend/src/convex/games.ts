import { GameStatus } from '../interfaces';
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
import { vAddParticipant, vCreateGame, vUpdateParticipant } from './validators';
import { findGame } from './utils'

export const getGameById = query({
  args: { id: v.string() },
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
    .query('games')
    .withIndex('by_status', (q) => q.eq('status', gameStatus))
    .order('desc')
    .collect()
 
  }
  
})

export const create = mutation({
  args: {game: vCreateGame},
  handler: async ({ db }, { game }) => {
    return await db.insert('games', game)
  }, 
})

export const addParticipant = mutation({
  args: {data: vAddParticipant},
  handler: async ({ db }, { data }) => {

    const foundGame = await findGame(db, data.id)
    console.log('foundGame ', foundGame)
    if (!foundGame) {
      throw new Error('Game does not exists')
    }

    const { participants } = foundGame;
    const playerJoined = foundGame.participants.find(p => p.address === data.playerAddress)

    if (playerJoined) {
      throw new Error('Player already joined')
    }

    const addedParticipants = [...participants, { 
      address: data.playerAddress,
      playerInfo: {
        turn: 0,
        turnScore: 0,
        totalScore: 0
      }
    }];

    return await db.patch(data.id, { participants: addedParticipants })
  }
})

export const updateParticipants = mutation({
  args: {data: vUpdateParticipant},
  handler: async ({db}, { data }) => {
    const foundGame = await findGame(db, data.id)
 
    const { playerInfo } = foundGame?.participants.find(p => p.address === data.playerAddress)
    if (!playerInfo) {  
      throw new Error('Player info does not exists')
    }
    playerInfo.turn += 1
    return await db.patch(data.id, { participants: [{address: data.playerAddress} ]})
  },
})