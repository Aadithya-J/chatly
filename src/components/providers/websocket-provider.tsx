"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LoadingScreen } from "~/components/loading-screen";

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

export function WebSocketProvider({
  children,
  token
}: {
  children: React.ReactNode;
  token: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if(!isMounted){
      return;
    }
    const ws = new WebSocket(`ws://localhost:3000/api/ws?token=${token}`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
    };
    ws.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [token,isMounted]);
  if(!isMounted){
    return <LoadingScreen />
  }
  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      try {
        socket.send(message);
      } catch (error) {
        console.error("Failed to send message via WebSocket:", error);
      }
    } else {
      console.error("WebSocket is not connected");
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}
