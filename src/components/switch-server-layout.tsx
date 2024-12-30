"use client";
import { useParams } from "next/navigation";
import { useWebSocket } from "./providers/websocket-provider";
import { MessageTypes } from "~/types";
import { useEffect, useRef } from "react";

export function SwitchServerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { isConnected, sendMessage } = useWebSocket();
  const params = useParams() ?? {};
  const serverId = Array.isArray(params.serverId)
    ? (params.serverId[0] ?? "")
    : (params.serverId ?? "");
  const lastServerId = useRef<string | null>(null);

  useEffect(() => {
    if (isConnected && serverId && serverId !== lastServerId.current) {
      lastServerId.current = serverId;

      const switchMessage = {
        serverId,
        type: MessageTypes.SWITCH_SERVER,
      };

      sendMessage(JSON.stringify(switchMessage));
    }
  }, [isConnected, serverId, sendMessage]);

  return <>{children}</>;
}
