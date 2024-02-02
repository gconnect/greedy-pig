import { selectUsernames, updatePlayerInfo } from '@/features/leaderboard/leaderboardSlice';
import { RootState } from '@/store/rootReducer';
import { useSelector } from 'react-redux';
import { Dispatch } from 'redux';

export type InputFunction = (question: string) => Promise<string>
export type RollFunction = () => Promise<number>
export type OutputFunction = (user: string, message: string, playerInfo?: PlayerInfo[]) => void
export type PlayerInfo = {
  turn: number;
  username: string;
  turnScore: number;
  totalScore: number;
};


export async function playGame(
  // usernames: string[],
  getInput: InputFunction,
  getRoll: RollFunction,
  numTurns: number,
  output: OutputFunction  ,
  dispatch: Dispatch
): Promise<string> {

  // const playerInfos: PlayerInfo[] = usernames.map(username => ({
  //   turn: 0,
  //   username,
  //   turnScore: 0,
  //   totalScore: 0
  // }));

  let result;
  const usernames = useSelector((state: RootState) => selectUsernames(state));

  const playerScores: { [key: string]: number } = {};
  for (const username of usernames) {
    playerScores[username] = 0;
  }


  for (let turn = 0; turn < numTurns; turn++) {


    for (let i = 0; i < usernames.length; i++) {

      const username = usernames[i];
      let turnScore: number = 0;
      let continueRolling: boolean = true;
      dispatch(updatePlayerInfo({ username, property: 'totalScore', value: playerScores[username] }));

      await output(username, `${username} turn score is ${turnScore}.`);

      dispatch(updatePlayerInfo({ username, property: 'turn', value: turn ++ }));

      // playerInfos[i].turn += 1

      while (continueRolling) {

        const roll: number = await getRoll();

        if (roll === 1) {

          turnScore = 0;
          // playerInfos[i].turnScore = turnScore;
          dispatch(updatePlayerInfo({ username, property: 'turnScore', value: turnScore }));
          await output(username, `Bust! Your turn score is 0.`);
          await new Promise(resolve => setTimeout(resolve, 2000)); 
          continueRolling = false; 

        } else {

          turnScore += roll;

          dispatch(updatePlayerInfo({ username, property: 'turnScore', value: turnScore }));

          await output(username, `Your turn score is ${turnScore}.`);
          const answer: string = await getInput(`Your current score is ${turnScore}. Roll again? (y/n): `);

          if (answer.toLowerCase() !== 'y') {
            continueRolling = false;
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
  await output('', result);
  return result;
}

