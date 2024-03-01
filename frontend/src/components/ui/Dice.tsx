// components/DiceRoll.js
import { useState } from 'react';
// import styles from './DiceRoll.module.css'; // Import CSS file for styling

const DiceRoll = () => {
  const [diceNumbers, setDiceNumbers] = useState(Array(5).fill(1)); // Initial state for dice numbers

  // Function to generate random dice numbers
  const randomizeDice = () => {
    const newDiceNumbers = diceNumbers.map(() => Math.floor(Math.random() * 6) + 1);
    setDiceNumbers(newDiceNumbers);
  };

  return (
    <div>
      <div className="dice-container">
        {diceNumbers.map((number, index) => (
          <div key={index} className="dice">
            {Array.from({ length: number }, (_, dotIndex) => (
              <div key={dotIndex} className="dice-dot" />
            ))}
          </div>
        ))}
      </div>
      <button className="btn-roll-dice" onClick={randomizeDice}>Roll Dice</button>
    </div>
  );
};

export default DiceRoll;
