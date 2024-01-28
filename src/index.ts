
import { createInterface, ReadLine } from 'readline';

const readline: ReadLine = createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question: string) {
  return new Promise((resolve) => {
    readline.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function playGame() {
  // Collect usernames
  const usernames = [];
  while (true) {
    const username = await askQuestion(
      'Enter a username (or type "done" to finish): '
    );
    if (username.toLowerCase() === "done") {
      break;
    }
    usernames.push(username);
  }

  // Number of players
  const numPlayers = usernames.length;
  // Number of turns per player
  const numTurns = parseInt(await askQuestion("Enter the number of turns: "));
  console.log(typeof numTurns);

  // Player scores
  const playerScores = {};
  // const playerScores = new Array(numPlayers).fill(0);

  // Initialize scores for each player
  for (const username of usernames) {
    playerScores[username] = 0;
  }

  // Loop for each turn
  for (let turn = 0; turn < numTurns; turn++) {
    console.log(`Turn ${turn + 1} begins!`);

    // Loop for each player
    for (const username of usernames) {
      console.log(`${username}'s turn-${turn + 1}:`);

      // Current turn score
      let turnScore = 0;
      let continueRolling = true;

      // Roll the die until player stops or rolls a 1
      while (continueRolling) {
        const roll = Math.floor(Math.random() * 6) + 1;
        console.log(`Rolled a ${roll}`);

        if (roll === 1) {
          console.log("Bust! Your turn score is 0.");
          turnScore = 0;
          break;
        } else {
          turnScore += roll;

          // Ask if the player wants to roll again or stop after each turn
          const answer = await askQuestion(
            `Your current score is ${turnScore}. Roll again? (y/n): `
          );
          if (answer.toLowerCase() !== "y") {
            continueRolling = false;
          }
        }
      }

      // Add turn score to player's total score
      playerScores[username] += turnScore;
      console.log(`${username}'s turn score: ${turnScore}`);
    }
  }

  // Find the player with the highest score
  const highestScore = Math.max(...Object.values(playerScores));
  const winningPlayer = Object.keys(playerScores).find((username) => {
    return playerScores[username] === highestScore;
  });

  console.log(
    `Game over! The highest score is ${highestScore} by Player ${winningPlayer}`
  );

  // Display the summary of all participants' scores
  console.log("\nSummary of Participants' Scores:");
  for (const username of usernames) {
    console.log(`${username}: ${playerScores[username]}`);
  }

  readline.close();
}

playGame();



