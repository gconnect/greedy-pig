import { FC, useEffect, useState } from 'react'
import Die1 from '@/assets/img/dice_1.png'
import Die2 from '@/assets/img/dice_2.png'
import Die3 from '@/assets/img/dice_3.png'
import Die4 from '@/assets/img/dice_4.png'
import Die5 from '@/assets/img/dice_5.png'
import Die6 from '@/assets/img/dice_6.png'
import Image from 'next/image'
import useAudio from '@/hooks/useAudio'

const die = [Die1, Die2, Die3, Die4, Die5, Die6]

interface ApparatusProps {
  handleDiceClick: () => void
  setIsRolling: (value: boolean) => void
  isRolling: boolean
  value: number
}

const Dice: FC<ApparatusProps> = ({handleDiceClick, setIsRolling, isRolling, value}) => {

  const [currentDice, setCurrentDice] = useState(0);

  const diceRollSound = useAudio('/sounds/diceRoll.mp3')

  useEffect(() => {
    if (isRolling) {
      let endRoll = 0;
      let interval: any
      let diceValue;
      interval = setInterval(() => {
        if (endRoll < 30) {
          diceRollSound?.play();
          diceValue = Math.floor(Math.random() * 6);
          setCurrentDice(diceValue)
          endRoll++
        } else {
          setCurrentDice(value - 1)
          clearInterval(interval)
          setIsRolling(false)
        }
      }, 100);
    }
  }, [isRolling, value, diceRollSound]);

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
            alt="Dice"
            className={`${currentDice === index ? "" : "hidden"}`}
          />
        ))}
      </button>
    </>
  );
}

export default Dice
