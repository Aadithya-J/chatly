import { WebSocket, type WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import { db } from "~/server/db";
import { type MessageType, MessageTypes } from "~/types";

const serverRooms: Map<string, Set<WebSocket>> = new Map<
  string,
  Set<WebSocket>
>();

function createMessage(
  data: string,
  channelId: string,
  serverId: string,
  type: MessageTypes,
) {
  return JSON.stringify({ type, data, channelId, serverId });
}

function parseMessage(messageData: string) {
  try {
    return JSON.parse(messageData) as MessageType;
  } catch (error) {
    console.error("Failed to parse message as JSON:", error);
    return null;
  }
}

export async function SOCKET(
  client: WebSocket,
  req: IncomingMessage,
  _server: WebSocketServer,
) {
  console.log("A client connected");
  const urlParams = new URLSearchParams(req.url?.split("?")[1]);
  const token = urlParams.get("token");
  if (!token) {
    client.send(createMessage("No token provided", "", "", MessageTypes.LOG));
    client.close();
    return;
  }

  try {
    const session = await db.session.findUnique({
      where: { sessionToken: token },
    });

    if (!session || new Date() > session.expires) {
      client.send(
        createMessage("Invalid or expired session", "", "", MessageTypes.LOG),
      );
      client.close();
      return;
    }

    client.send(createMessage("Session validated", "", "", MessageTypes.LOG));

    let currentServerId: string | null = null;

    client.on("message", (message) => {
      const messageString =
        message instanceof Buffer
          ? message.toString()
          : JSON.stringify(message);
      const parsedMessage = parseMessage(messageString);
      if (!parsedMessage) {
        client.send(
          createMessage("Invalid message format", "", "", MessageTypes.LOG),
        );
        return;
      }

      const { type, data, channelId, serverId } = parsedMessage;

      switch (type) {
        case MessageTypes.SWITCH_SERVER:
          console.log("Switching server to:", serverId);
          if (currentServerId) {
            leaveServer(client, currentServerId);
          }
          currentServerId = serverId;
          joinServer(client, serverId);
          client.send(
            createMessage("Switched to server", "", serverId, MessageTypes.LOG),
          );
          break;

        case MessageTypes.MESSAGE_SENT:
          void handleMessageSent(
            client,
            data,
            channelId,
            serverId,
            session.userId,
          );
          break;

        default:
          client.send(
            createMessage(
              `Unknown message type${type}`,
              "",
              "",
              MessageTypes.LOG,
            ),
          );
      }
    });

    client.on("close", () => {
      if (currentServerId) {
        leaveServer(client, currentServerId);
      }
      console.log("A client disconnected");
    });
  } catch (error) {
    console.error("Error during WebSocket initialization:", error);
    client.close();
  }
}

async function handleMessageSent(
  client: WebSocket,
  data: string,
  channelId: string,
  serverId: string,
  userId: string,
) {
  try {
    client.send(createMessage("Message received", "", "", MessageTypes.LOG));
    await saveMessageToDb(data, channelId, userId);
    broadcastToServer(
      serverId,
      createMessage(data, channelId, serverId, MessageTypes.MESSAGE_SENT),
      client,
    );
    broadcastToServer(
      serverId,
      createMessage(data, channelId, serverId, MessageTypes.NEW_TEXT),
      client,
    );
  } catch (error) {
    console.error("Error handling message:", error);
    client.send(
      createMessage("Error handling message", "", "", MessageTypes.LOG),
    );
  }
}

async function saveMessageToDb(
  data: string,
  channelId: string,
  userId: string,
) {
  try {
    await db.message.create({
      data: { content: data, channelId, userId },
    });
    console.log("Message saved to DB");
  } catch (error) {
    console.log(error);
    throw new Error("Error saving message to DB");
  }
}

function joinServer(client: WebSocket, serverId: string) {
  if (!serverRooms.has(serverId)) {
    serverRooms.set(serverId, new Set());
  }
  serverRooms.get(serverId)!.add(client);
}

function leaveServer(client: WebSocket, serverId: string) {
  if (serverRooms.has(serverId)) {
    serverRooms.get(serverId)!.delete(client);
    if (serverRooms.get(serverId)!.size === 0) {
      serverRooms.delete(serverId);
    }
    broadcastToServer(
      serverId,
      createMessage("User left", "", serverId, MessageTypes.LOG),
    );
  }
}

function broadcastToServer(
  serverId: string,
  message: string,
  exclude?: WebSocket,
) {
  if (serverRooms.has(serverId)) {
    for (const client of serverRooms.get(serverId)!) {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}

// GET method to handle WebSocket connection info request
export function GET() {
  console.log("GET request received for WebSocket route");
  return new Response(
    JSON.stringify({
      error: "This is the WebSocket route. Connect using WebSockets",
    }),
    {
      status: 426,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
