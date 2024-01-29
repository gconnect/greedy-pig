'use client'

import UsernamesForm from "@/components/UsernamesForm";
import GameForms from '@/components/GameForms'
import { InputFunction, playGame } from "@/lib/utils"
import { useState } from "react";


export default function Home() {
  const [usernames, setUsernames] = useState<string[]>([]);  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalQuestion, setModalQuestion] = useState('');
  const [output, setOutput] = useState('');
  const [handleUserInput, setHandleUserInput] = useState<(answer: string) => void>(() => () => {});

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const getInput: InputFunction = async (question: string) => {
    return new Promise((resolve) => {
      setModalQuestion(question);
      openModal();
       // Set up a listener to handle the user input
      const handleUserInput = (answer: string) => {
        // setUserInput(answer); // Set the userInput state
        resolve(answer); // Resolve the promise with the user's input
      };

      // Pass the handler to handle the user input
      setHandleUserInput(() => handleUserInput);
    });
  };

  const handleModalSubmit = async (answer: string) => {
    // Handle modal submission here
    // You can set state or perform any actions based on the submitted answer
    console.log('Submitted answer:', answer);
    handleUserInput(answer);
  };

  const startGame = async () => {

    try {
      const result = await playGame(usernames, getInput, 2);
      setOutput(`Game finished!. ${result}`); // Update output state to indicate game finish
    } catch (error) {
      console.error('Error during game:', error);
    }
  };

  



  return (
    <div>
      <UsernamesForm usernames={usernames} setUsernames={setUsernames} />
      <GameForms 
        isOpen={modalIsOpen}
        closeModal={closeModal}
        onSubmit={handleModalSubmit}
        question={modalQuestion}
      />
      <button onClick={startGame} type="button">Play game</button>
      <div className="mt-4">{output}</div>
    </div>
  )
}
