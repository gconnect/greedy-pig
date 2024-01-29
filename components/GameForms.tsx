import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  closeModal: () => void;
  onSubmit: (answer: string) => void;
  question: string;
}

const GameModal: React.FC<Props> = ({ isOpen, closeModal, onSubmit, question }) => {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answer);
    setAnswer(''); // Clear input field after submission
    closeModal();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
              <div className="p-4">
                <h2 className="text-lg text-black font-semibold mb-4">{question}</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="border rounded-md px-2 py-1 w-full mb-2"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GameModal;
