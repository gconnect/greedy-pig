'use client'

import { useEffect, useRef } from 'react'
import UsernamesForm from "@/components/UsernamesForm";
import ResponseForm from '@/components/ResponseForm'
import { InputFunction, RollFunction, playGame } from "@/lib/utils"
import { useState } from "react";
import { Roulette, useRoulette } from 'react-hook-roulette';


export default function Home() {

  const [loading, setLoading] = useState<boolean>(false);
  const [usernames, setUsernames] = useState<string[]>([]);  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalQuestion, setModalQuestion] = useState('');
  const [output, setOutput] = useState('');
  const [handleUserInput, setHandleUserInput] = useState<(answer: string) => void>(() => () => {});
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const stopButtonRef = useRef(null);
  const { roulette, onStart, onStop, result } = useRoulette({
    items: [
      { name: "1" },
      { name: "2" },
      { name: "3" },
      { name: "4" },
      { name: "5" },
      { name: "6" },
    ],
    onSpinEnd: res => {
        setLoading(false)
        setRollResult(Number(res))

        
    }
  });

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);


  const handleStopGame = () => {
    setIsGameStarted(false);
    onStop();
  };

  

  const handleRollResult = (result: number) => {
   
    // setRollResult(result); // Update roll result state
    // openModal()
  };


  const getInput: InputFunction = async (question: string) => {
    return new Promise((resolve) => {
      setModalQuestion(question);
      openModal();
    
      const handleUserInput = (answer: string) => {
        
        resolve(answer);
      
        closeModal();
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
          // resolve(Number(rollResult))
          setTimeout(() => {
            const rollResultElement = document.getElementById("roll-result");
            if (rollResultElement) {
              const rollResultValue = rollResultElement.innerText;
              return resolve(Number(rollResultValue));
            }
          }, 5000);
        }
      }, 3000);
    });
  };




  const handleModalSubmit = async (answer: string) => {
    // Handle modal submission here
    // You can set state or perform any actions based on the submitted answer
    console.log('Submitted answer:', answer);
  
   
  };

  const startGame = async () => {

    try {
      const result = await playGame(usernames, getInput, getRoll, 2, handleRollResult);
      setOutput(`Game finished!. ${result}`); // Update output state to indicate game finish
    } catch (error) {
      console.error('Error during game:', error);
    }
  };


  return (
    <div>
      <UsernamesForm usernames={usernames} setUsernames={setUsernames} />
      <div>Roll Result: {rollResult !== null ? rollResult : 'No roll yet'}</div>
      <div id="roll-result">{rollResult}</div>
      <ResponseForm
        isOpen={modalIsOpen}
        closeModal={closeModal}
        onSubmit={handleModalSubmit}
        question={modalQuestion}
      />
      <button onClick={startGame} type="button">Play game</button>
      <div className="mt-4">{output}</div>
     
      <Roulette roulette={roulette} />
      {/* <button type="button" onClick={startRouletteSpin} disabled={isGameStarted}>
        Start
      </button> */}
      <button className='hidden' ref={stopButtonRef} type="button" onClick={handleStopGame} disabled={!isGameStarted} />
  
   
    </div>
  )
}
