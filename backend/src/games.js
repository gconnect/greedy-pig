const { v4: uuidv4 } = require('uuid')

export const games = []

export const addGame = (game) => {
  const gameFound = games.length ? games.find(g => g.id === game.id) : null

  if (gameFound) {
    throw new Error('Game already exists')
  }

  games.push({ ...game, id: uuidv4()}) // line 12
}

export const addParticipant = ({gameId, playerAddress}) => {

  const game = games.find(game => game.id === gameId)

  if (!game) {
    throw new Error('Game not found')
  }

  const participant = game.participants.find(p => p.address === playerAddress)

  if (participant) {
    throw new Error('Participant already exists')
  }

  console.log('adding participant ', JSON.stringify(game))

  game.participants.push({
    address: playerAddress,
    playerInfo: {
      turn: 0,
      turnScore: 0,
      totalScore: 0
    }
  })
}




export const updateParticipant = ({ gameId, address, property, value }) => {
  const game = games.find(game => game.id === gameId);

  if (!game) {
    throw new Error('Game not found');
  }

  const participant = game.participants.find(
    (p) => p.address === address
  )

  if (!participant) {
    throw new Error('Participant not found');
  }

  if (!(property in participant.playerInfo)) {
    throw new Error(`Property ${property} does not exist in playerInfo`);
  }

  if (typeof value !== 'number') {
    throw new Error('Value must be a number');
  }

  if (participant) {
    if (property === 'turn') {
      participant.playerInfo = {
        ...participant.playerInfo,
        [property]: participant.playerInfo[property] + value, // Increment the turn by the value
      }
    } else {
      participant.playerInfo = {
        ...participant.playerInfo,
        [property]: value,
      }
    }
  }

  
};





const gameStructure = () => {
  return {
   creator: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
   activePlayer: '',
   gameName: 'Justin Obi',
   participants: [
     {
       address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
       playerInfo: {
        turn: 0,
        turnScore: 0,
        totalScore: 0
       }
     },
     {
       address: '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199',
       playerInfo: {
        turn: 0,
        turnScore: 0,
        totalScore: 0
       }
     },
     {
       address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
       playerInfo: {
        turn: 0,
        turnScore: 0,
        totalScore: 0
       }
     }
   ],
   gameSettings: {
     turnTimeLimit: 0,
     winningScore: 0,
     mode: 'turn',
     apparatus: 'roulette',
     bet: true,
     maxPlayer: 10,
     limitNumberOfPlayer: true
   },
   status: 'New',
   startTime: '2024-02-20T11:28',
   id: 'j57c7p49x610z9q2s63xbz7rk56ktg8v'
 }
}