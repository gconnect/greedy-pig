

export type InputFunction = (question: string) => Promise<string>
export type RollFunction = () => Promise<number>
export type OutputFunction = (user: string, message: string) => void

export async function playGame(
  usernames: string[],
  getInput: InputFunction,
  getRoll: RollFunction, 
  numTurns: number,
  output: OutputFunction
  ): Promise<string> {

  let result

  const playerScores: { [key: string]: number } = {};
  for (const username of usernames) {
    playerScores[username] = 0;
  }


  for (let turn = 0; turn < numTurns; turn++) {
   

    for (const username of usernames) {

      await output(username, `${username}'s turn-${turn + 1}:`);

      let turnScore: number = 0;
      let continueRolling: boolean = true;

      while (continueRolling) {

        const roll: number = await getRoll();

        if (roll === 1) {
       
          await output(username, `Bust! Your turn score is 0.`);
          turnScore = 0;
          continueRolling = false; // Exit the loop on a bust
        } else {
          turnScore += roll;
          await output(username, `Your turn score is ${turnScore}.`);
          const answer: string = await getInput(`Your current score is ${turnScore}. Roll again? (y/n): `);
          if (answer.toLowerCase() !== 'y') {
            continueRolling = false; // Exit the loop if the player doesn't want to roll again
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
    result = `The highest score is ${highestScore} by Player ${winningPlayers[0]}`
  } else {
    console.log(`There is a tie for the highest score (${highestScore}) among Players: ${winningPlayers.join(', ')}`);
    result = `There is a tie for the highest score (${highestScore}) among Players: ${winningPlayers.join(', ')}`
  }

  console.log('\nSummary of Participants\' Scores:');
  for (const username of usernames) {
    console.log(`${username}: ${playerScores[username]}`);
  }
  await output('', result)
  return result
}