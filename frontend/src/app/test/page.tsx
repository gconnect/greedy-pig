'use client'

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket;

const Test = () => {
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    socketInitializer();
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io();

    socket.on('connect', () => {
      console.log('connected');
      socket.emit('joined', 'Justin');
    });

    socket.on('update-input', (msg: string) => {
      console.log('update-input from back', msg);
      setInput(msg);
    });

    socket.on('user-joined', (msg: any) => {
      console.log('joined', msg);
    })
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit('input-change', e.target.value);
  };

  return (
    <input
      placeholder="Type something"
      value={input}
      onChange={onChangeHandler}
    />
  );
};

export default Test;