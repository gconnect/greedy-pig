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
    .query("games")
    .withIndex('by_status', (q) => q.eq('status', gameStatus))
    .collect()
 
  }
  
})

export const create = mutation({
  args: {game: vCreateGame},
  // args: {
  //   activePlayer: v.string(),
  //   creator: v.string(),
  //   gameName: v.string(),
  //   gameSettings: v.object({
  //     apparatus: v.string(),
  //     bet: v.boolean(),
  //     limitNumberOfPlayer: v.boolean(),
  //     maxPlayer: v.float64(),
  //     mode: v.string(),
  //     turnTimeLimit: v.float64(),
  //     winningScore: v.float64(),
  //   }),
  //   participants: v.array(
  //     v.object({
  //       address: v.string(),
  //       playerInfo: v.object({
  //         totalScore: v.float64(),
  //         turn: v.float64(),
  //         turnScore: v.float64(),
  //       }),
  //     })
  //   ),
  //   status: v.union(v.literal(GameStatus.New), v.literal(GameStatus.Cancelled), v.literal(GameStatus.Ended), v.literal(GameStatus.InProgress)),
  //   startTime: v.string()
  // },
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

const addedParticipants = [...participants, { address: data.playerAddress }];

    return await db.patch(data.id, { participants: addedParticipants })
  },
})