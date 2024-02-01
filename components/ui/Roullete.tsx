'use client'

import { useCallback, useEffect, useRef } from 'react'
import UsernamesForm from "@/components/UsernamesForm";
import ResponseForm from '@/components/ResponseForm'
import { InputFunction, RollFunction, OutputFunction, playGame } from "@/lib/utils"
import { useState } from "react";
import { Roulette, useRoulette } from 'react-hook-roulette';
import { useDispatch } from 'react-redux';
import { updateLeaderboard } from '@/store/features/leaderboard/leaderboardSlice';



export default function Home() {

  const dispatch = useDispatch();

  // const handleIncrement = useCallback(() => {
  //   dispatch(updateLeaderboard('justin'));
  // }, [dispatch]);

 

  const [gameInProgress, setGameInProgress] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [usernames, setUsernames] = useState<string[]>([]);   
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalQuestion, setModalQuestion] = useState('');
  const [output, setOutput] = useState('');
  const [handleUserInput, setHandleUserInput] = useState<(answer: string) => void>(() => () => {});
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const stopButtonRef = useRef(null);
  const { roulette, onStart, onStop } = useRoulette({
    items: [
      { name: "1", bg: "#b26527", color: "#ffffff" },
      { name: "2", bg: "#ce9729", color: "#ffffff" },
      { name: "3", bg: "#e7c02b", color: "#ffffff" },
      { name: "4" },
      { name: "5" },
      { name: "6" },
      { name: "7" },
      { name: "8" }
    ],
    onSpinEnd: res => {
      setLoading(false)
      setRollResult(Number(res))
    },
    options: {
      maxSpeed: 10,
      acceleration: 6,
      determineAngle: 90,
      style: {
        canvas: {
          bg: 'transparent'
        },
        arrow: {
          bg: "#000",
          size: 26,
          boxShadow: "3px 33px 30px 3px #fff"
        },
        label: {
          font: "28px Arial",
          align: "right",
          baseline: "middle",
          offset: 0.65,
          defaultColor: "#000",
          fontWeight: "bold"
        },
      }
    }
  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);


  const handleStopGame = () => {
    setIsGameStarted(false);
    onStop();
  };

  const getOutput: OutputFunction = (user: string, message: string, participants: string[]) => {
    return new Promise((resolve) => {
    setOutput(`${user} ${message}`);
    dispatch(updateLeaderboard(participants));
    resolve(message)
    })  
    
  }


  const getInput: InputFunction = async (question: string) => {
    return new Promise((resolve) => {
      setModalQuestion(question);
      openModal();
    
      const handleUserInput = (answer: string) => {
      
        closeModal();
        resolve(answer);
      };
      
      setHandleUserInput(() => handleUserInput);
    });
  };


const startRouletteSpin = async () => {
  setLoading(true);
  setIsGameStarted(true);
  onStart(); // Start the roulette spinning
};



const getRoll: RollFunction = async () => {
    return new Promise((resolve) => {
      startRouletteSpin();

      setTimeout(() => {
        if (stopButtonRef.current) {
          stopButtonRef.current.click();
        
          setTimeout(() => {
            const rollResultElement = document.getElementById("roll-result");
            if (rollResultElement) {
              const rollResultValue = rollResultElement.innerText;
              return resolve(Number(rollResultValue));
            }
          }, 500);
        }
      }, 2000);
    });
  };




  const handleModalSubmit = async (answer: string) => {
    // Handle modal submission here
    // You can set state or perform any actions based on the submitted answer
    console.log('Submitted answer:', answer);
  
   return answer
  };

  const startGame = async () => {
    setGameInProgress(true);
    try {
      const result = await playGame(usernames, getInput, getRoll, 2, getOutput);
      setGameInProgress(false);
      setOutput(`Game finished!. ${result}`); // Update output state to indicate game finish
    } catch (error) {
      console.error('Error during game:', error);
    }
  };


  return (
    <div>
 
      <div className="min-h-2">
        <div className="mt-4">{output}</div>
        {!gameInProgress && <UsernamesForm usernames={usernames} setUsernames={setUsernames} />}
      </div>
      
      <ResponseForm
        isOpen={modalIsOpen}
        closeModal={closeModal}
        onSubmit={handleModalSubmit}
        question={modalQuestion}
        handleUserInput={handleUserInput}
      />
      <button onClick={startGame} type="button">Play game</button>
      
     
      <Roulette roulette={roulette} />

    
      <div className='hidden' id="roll-result">{rollResult}</div>
      <button className='hidden' ref={stopButtonRef} type="button" onClick={handleStopGame} disabled={!isGameStarted} />
  
   
    </div>
  )
}
