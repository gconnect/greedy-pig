

export type InputFunction = (question: string) => Promise<string>
export type RollFunction = () => Promise<number>
export type OutputFunction = (user: string, message: string, playerInfo?: PlayerInfo[]) => Promise<string>
export type PlayerInfo = {
  turn: number;
  username: string;
  turnScore: number;
  totalScore: number;
};


export async function playGame(
  usernames: string[],
  getInput: InputFunction,
  getRoll: RollFunction,
  numTurns: number,
  output: OutputFunction  
): Promise<string> {

  const playerInfos: PlayerInfo[] = usernames.map(username => ({
    turn: 0,
    username,
    turnScore: 0,
    totalScore: 0
  }));

  let result;

  const playerScores: { [key: string]: number } = {};
  for (const username of usernames) {
    playerScores[username] = 0;
  }


  for (let turn = 0; turn < numTurns; turn++) {


    for (let i = 0; i < usernames.length; i++) {

      const username = usernames[i];
      let turnScore: number = 0;
      let continueRolling: boolean = true;
      playerInfos[i].totalScore = playerScores[username]

      await output(username, `${username} turn score is ${turnScore}.`, playerInfos);

      playerInfos[i].turn += 1

      while (continueRolling) {

        const roll: number = await getRoll();

        if (roll === 1) {

          turnScore = 0;
          playerInfos[i].turnScore = turnScore;
          await output(username, `Bust! Your turn score is 0.`, playerInfos);
          await new Promise(resolve => setTimeout(resolve, 2000)); 
          continueRolling = false; // line 58

        } else {

          turnScore += roll;
          playerInfos[i].turnScore = turnScore;
          await output(username, `Your turn score is ${turnScore}.`, playerInfos);
          const answer: string = await getInput(`Your current score is ${turnScore}. Roll again? (y/n): `);

          if (answer.toLowerCase() !== 'y') {
            continueRolling = false; // line 67
          }
        }      

      }

      
      playerScores[username] += turnScore;
    }
  }

  const highestScore: number = Math.max(...Object.values(playerScores));
  const winningPlayers: string[] = Object.keys(playerScores).filter((username) => playerScores[username] === highestScore);

  console.log('\nGame over!');

  if (winningPlayers.length === 1) {
    result = `Game over! \n The highest score is ${highestScore} by Player ${winningPlayers[0]}`;
  } else {
    console.log(`Game over! \n There is a tie for the highest score (${highestScore}) among Players: ${winningPlayers.join(', ')}`);
    result = `Game over! \n There is a tie for the highest score (${highestScore}) among Players: ${winningPlayers.join(', ')}`;
  }

  console.log('\nSummary of Participants\' Scores:');
  for (const username of usernames) {
    console.log(`${username}: ${playerScores[username]}`);
  }
  await output('', result, playerInfos);
  return result;
}

