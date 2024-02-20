

export const games = []

export const addGame = (game) => {
  const gameFound = games.find(g => g.id === game.id)

  if (gameFound) {
    throw new Error('Game already exists')
  }

  games.push(game)
}

export const addParticipant = ({gameId, playerAddress}) => {

  const game = games.find(game => game.id === gameId)

  if (!game) {
    throw new Error('Game not found')
  }

  console.log('adding participant ', game)

  game.participants.push({
    address: playerAddress,
    playerInfo: {
      turn: 0,
      turnScore: 0,
      totalScore: 0
    }
  })
}