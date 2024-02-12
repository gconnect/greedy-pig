"use client";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const sendTask = useMutation(api.tasks.send);

  const [task, setTask] = useState('')

  const send = async () => {

    await sendTask({ text: task });
    setTask("");
  }


  return (
    <div>
      <main className="flex flex-col items-center justify-between p-24">
        {tasks?.map(({ _id, text }) => (
          <div key={_id}>{text}</div>
        ))}
      </main>

        <input onChange={e => setTask(e.target.value)} type="text" placeholder="enter task" />
        <button onClick={send} type="button">Send</button>
    </div>
  );
}