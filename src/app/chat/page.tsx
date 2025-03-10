"use client";

import { useSocket } from "@/lib/useSocket";
import { FormEvent, useState } from "react";

export default function App() {
  const { isConnected, messages, sendMessage } = useSocket();
  const [input, setInput] = useState("");
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chat App</h1>
      <p>Status: {isConnected ? "Connected" : "Disconnected"}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit" disabled={!isConnected}>
          Send
        </button>
      </form>

      <h2>Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
