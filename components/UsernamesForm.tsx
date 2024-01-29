import { FC, FormEvent, useState } from 'react';

interface UsernamesFormProps {
  usernames: string[];
  setUsernames: React.Dispatch<React.SetStateAction<string[]>>;

}

const UsernamesForm: FC<UsernamesFormProps> = ({ usernames, setUsernames }) => {


  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Access the input value directly from the form event
    const usernameInput = event.currentTarget.elements.namedItem('username') as HTMLInputElement;
    const username = usernameInput.value.trim();

    if (username) {
  
      // Update the usernames array in the parent component
      setUsernames((prevUsernames) => [...prevUsernames, username]);
      // Clear the input field
      usernameInput.value = '';
    }
  };



  return (
    <div className="max-w-md mx-auto mt-8">
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          className="p-2 border border-gray-300 mr-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Username
        </button>
      </form>

      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Usernames:</h2>
        <ul>
          {usernames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UsernamesForm;
