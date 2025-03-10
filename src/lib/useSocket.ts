"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Initialize socket only on client-side
    if (!socket) {
      socket = io(`${process.env.NEXT_PUBLIC_CHAT_BACKEND}`, {
        reconnection: true, // Auto-reconnect if disconnected
      });
      socket.on("connect", () => {
        setIsConnected(true);
        console.log("Connected to backend");
      });

      socket.on("disconnect", () => {
        setIsConnected(false);
        console.log("Disconnected from backend");
      });

      socket.on("message", (msg: string) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("message");
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit("message", message);
    }
  };

  return { isConnected, messages, sendMessage };
};
