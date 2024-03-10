import { useEffect, useState } from "react";
import Die1 from '@/assets/img/dice_1.png'
import Die2 from '@/assets/img/dice_2.png'
import Die3 from '@/assets/img/dice_3.png'
import Die4 from '@/assets/img/dice_4.png'
import Die5 from '@/assets/img/dice_5.png'
import Die6 from '@/assets/img/dice_6.png'
import Image from "next/image";
// import { useGreedyPigContext } from "@/context/useGreedyPigContext";
// import diceRollSound from "src/sound_effect/dice_roll.mp3";
// import useAudio from "src/hooks/useAudio";

const die = [Die1, Die2, Die3, Die4, Die5, Die6]

export function AppDice({handleDiceClick, setIsRolling, isRolling, value}) {
  // const { preloadSrcList } = useGreedyPigContext();
  const [currentDice, setCurrentDice] = useState(0);
  // const die = preloadSrcList.filter((dice) => dice.includes("dice"));
  // const diceRollAudio = useAudio(diceRollSound);

  // const handleDiceClick = () => {
  //   setIsRolling(true);

  // };

  useEffect(() => {
    if (isRolling) {
      let endRoll = 0;
      let interval, diceValue;
      interval = setInterval(() => {
        if (endRoll < 30) {
          // diceRollAudio?.play();
          diceValue = Math.floor(Math.random() * 6);
          setCurrentDice(diceValue);
          endRoll++;
        } else {
          setCurrentDice(value - 1)
          clearInterval(interval);
          // getFinalDiceValue(diceValue + 1);
          setIsRolling(false);
          // setChangeBackground(false);
        }
      }, 100);
    }
  }, [isRolling, value]);

  return (
    <>
      <button
        className={`hover:scale-105 active:scale-100 duration-300 md:w-auto w-[200px]`}
        onClick={handleDiceClick}
        disabled={isRolling}
      >
        {die.map((dice, index) => (
          <Image
            key={index}
            src={dice}
            alt={currentDice + 1}
            className={`${currentDice === index ? "" : "hidden"}`}
          />
        ))}
      </button>
    </>
  );
}
