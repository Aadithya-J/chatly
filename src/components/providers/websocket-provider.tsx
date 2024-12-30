"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { LoadingScreen } from "~/components/loading-screen";
import { type MessageType, MessageTypes } from "~/types";

const INITIAL_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 30000;
const MAX_RETRIES = 5;

type WebSocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (message: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};

type QueuedMessage = {
  message: string;
  timestamp: number;
};

export function WebSocketProvider({
  children,
  token,
}: {
  children: React.ReactNode;
  token: string;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const reconnectAttempts = useRef(0);
  const reconnectTimeout = useRef<NodeJS.Timeout>();
  const currentRetryDelay = useRef(INITIAL_RETRY_DELAY);
  const ws = useRef<WebSocket | null>(null);

  const messageQueue = useRef<QueuedMessage[]>([]);
  const isProcessingQueue = useRef(false);

  const handleLogMessage = useCallback((data: string) => {
    console.log("Log message received:", data);
  }, []);

  const handleMessageSent = useCallback(
    (data: string, channelId: string, serverId: string) => {
      console.log(
        "Message sent:",
        data,
        "in channel:",
        channelId,
        "on server:",
        serverId,
      );
    },
    [],
  );

  const handleNewText = useCallback(
    (data: string, channelId: string, serverId: string) => {
      console.log(
        "New text received:",
        data,
        "in channel:",
        channelId,
        "on server:",
        serverId,
      );
    },
    [],
  );

  const processMessageQueue = useCallback(() => {
    if (
      isProcessingQueue.current ||
      messageQueue.current.length === 0 ||
      !ws.current
    ) {
      return;
    }

    isProcessingQueue.current = true;

    while (
      messageQueue.current.length > 0 &&
      ws.current?.readyState === WebSocket.OPEN
    ) {
      const { message } = messageQueue.current[0]!;
      try {
        ws.current.send(message);
        messageQueue.current.shift();
      } catch (error) {
        console.error("Failed to send queued message:", error);
        break;
      }
    }

    isProcessingQueue.current = false;
  }, []);

  const connectWebSocket = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      ws.current = new WebSocket(`ws://localhost:3000/api/ws?token=${token}`);

      ws.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setSocket(ws.current);
        reconnectAttempts.current = 0;
        currentRetryDelay.current = INITIAL_RETRY_DELAY;
        processMessageQueue();
      };

      ws.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data as string) as MessageType;
          const { type, data, channelId, serverId } = message;

          switch (type) {
            case MessageTypes.LOG:
              handleLogMessage(data);
              break;
            case MessageTypes.MESSAGE_SENT:
              handleMessageSent(data, channelId, serverId);
              break;
            case MessageTypes.NEW_TEXT:
              handleNewText(data, channelId, serverId);
              break;
            default:
              console.warn("Invalid message type:", type);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        setSocket(null);

        if (!event.wasClean && reconnectAttempts.current < MAX_RETRIES) {
          const delay = Math.min(
            currentRetryDelay.current * 1.5 ** reconnectAttempts.current,
            MAX_RETRY_DELAY,
          );
          console.log(`Attempting to reconnect in ${delay}ms...`);

          reconnectTimeout.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            currentRetryDelay.current = delay;
            connectWebSocket();
          }, delay);
        } else if (reconnectAttempts.current >= MAX_RETRIES) {
          console.error(
            "Max reconnection attempts reached. Please refresh the page.",
          );
        }
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  }, [
    token,
    processMessageQueue,
    handleLogMessage,
    handleMessageSent,
    handleNewText,
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close(1000, "Component unmounting");
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [isMounted, connectWebSocket]);

  const sendMessage = useCallback((message: string): void => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(message);
      } catch (error) {
        console.error("Failed to send message:", error);
        messageQueue.current.push({
          message,
          timestamp: Date.now(),
        });
      }
    } else {
      messageQueue.current.push({
        message,
        timestamp: Date.now(),
      });
      console.log("Message queued - WebSocket not ready");
    }
  }, []);

  useEffect(() => {
    if (isConnected) {
      processMessageQueue();
    }
  }, [isConnected, processMessageQueue]);

  if (!isMounted) {
    return <LoadingScreen />;
  }

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}
