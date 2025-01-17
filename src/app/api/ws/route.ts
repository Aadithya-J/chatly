// eslint-disable
/* eslint-disable */
import { WebSocket, type WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import { db } from "~/server/db";
import { type MessageType, MessageTypes } from "~/types";
import type { User } from "@prisma/client";

// Custom types for improved type safety and clarity
interface ServerAccessCache {
  client: WebSocket;
  servers: Set<string>; // Set of server IDs the user has access to
  userId: string;
}

interface WebSocketMessage {
  userName: string;
  type: MessageTypes;
  data: string;
  channelId: string;
  serverId: string;
  timestamp: number;
}

// Global state management
const serverAccessCache = new Map<WebSocket, ServerAccessCache>();
const serverRooms = new Map<string, Set<WebSocket>>();

// Utility function to create consistent message format
function createMessage(
  userName: string,
  data: string,
  channelId: string,
  serverId: string,
  type: MessageTypes,
): string {
  const message: WebSocketMessage = {
    userName,
    type,
    data,
    channelId,
    serverId,
    timestamp: Date.now(),
  };
  return JSON.stringify(message);
}

// Message parsing with validation and error handling
function parseMessage(messageData: string): MessageType | null {
  try {
    const parsed = JSON.parse(messageData) as MessageType;
    // Basic validation of required fields
    if (!parsed.type || typeof parsed.serverId !== "string") {
      return null;
    }
    return parsed;
  } catch (error) {
    console.error("Message parsing error:", error);
    return null;
  }
}

// Server access validation with caching mechanism
async function validateServerAccess(
  client: WebSocket,
  serverId: string,
  userId: string,
): Promise<boolean> {
  // Check cache first for performance
  const cache = serverAccessCache.get(client);
  if (cache?.servers.has(serverId)) {
    return true;
  }

  try {
    const server = await db.server.findUnique({
      where: {
        id: serverId,
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!server) {
      return false;
    }

    // Update cache with valid server access
    if (!cache) {
      serverAccessCache.set(client, {
        client,
        servers: new Set([serverId]),
        userId,
      });
    } else {
      cache.servers.add(serverId);
    }

    return true;
  } catch (error) {
    console.error("Server access validation error:", error);
    return false;
  }
}

// Database operations for message handling
async function saveMessageToDb(
  data: string,
  channelId: string,
  userId: string,
) {
  try {
    const savedMessage = await db.message.create({
      data: {
        content: data,
        channelId,
        userId,
      },
    });
    console.log("Message saved to database:", savedMessage.id);
    return savedMessage;
  } catch (error) {
    console.error("Database save error:", error);
    throw new Error("Failed to save message to database");
  }
}

// Server room management functions
function joinServer(client: WebSocket, serverId: string) {
  if (!serverRooms.has(serverId)) {
    serverRooms.set(serverId, new Set());
  }
  serverRooms.get(serverId)!.add(client);
  console.log(`Client joined server ${serverId}`);
}

function leaveServer(client: WebSocket, serverId: string) {
  const serverRoom = serverRooms.get(serverId);
  if (serverRoom) {
    serverRoom.delete(client);
    if (serverRoom.size === 0) {
      serverRooms.delete(serverId);
    }
    broadcastToServer(
      serverId,
      createMessage("", "User left server", "", serverId, MessageTypes.LOG),
    );
    console.log(`Client left server ${serverId}`);
  }
}

// Message broadcasting with optional exclusion
function broadcastToServer(
  serverId: string,
  message: string,
  exclude?: WebSocket,
) {
  const serverRoom = serverRooms.get(serverId);
  if (serverRoom) {
    for (const client of serverRoom) {
      if (client !== exclude && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    }
  }
}

// Message handling with validation and error handling
async function handleMessageSent(
  client: WebSocket,
  data: string,
  channelId: string,
  serverId: string,
  userId: string,
  user: User,
) {
  try {
    // Validate channel exists and belongs to server
    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId,
      },
    });

    if (!channel) {
      client.send(
        createMessage(user.name, "Invalid channel", "", "", MessageTypes.LOG),
      );
      return;
    }

    // Save message to database
    const savedMessage = await saveMessageToDb(data, channelId, userId);

    // Broadcast message to all clients in the server
    if (savedMessage) {
      broadcastToServer(
        serverId,
        createMessage(
          user.name,
          data,
          channelId,
          serverId,
          MessageTypes.MESSAGE_SENT,
        ),
        client,
      );
    }
  } catch (error) {
    console.error("Message handling error:", error);
    client.send(
      createMessage(
        user.name,
        "Error processing message",
        "",
        "",
        MessageTypes.LOG,
      ),
    );
  }
}

// Main WebSocket handler
export async function SOCKET(
  client: WebSocket,
  req: IncomingMessage,
  _server: WebSocketServer,
) {
  console.log("New client connection attempt");

  // Initial connection validation
  const urlParams = new URLSearchParams(req.url?.split("?")[1] ?? "");
  const token = urlParams.get("token");

  if (!token) {
    client.send(
      createMessage("", "No token provided", "", "", MessageTypes.LOG),
    );
    client.close();
    return;
  }

  try {
    // Validate session and user
    const session = await db.session.findUnique({
      where: { sessionToken: token },
      include: { user: true },
    });

    if (!session || new Date() > session.expires) {
      client.send(
        createMessage(
          "",
          "Invalid or expired session",
          "",
          "",
          MessageTypes.LOG,
        ),
      );
      client.close();
      return;
    }

    const { user } = session;
    if (!user) {
      client.send(
        createMessage("", "User not found", "", "", MessageTypes.LOG),
      );
      client.close();
      return;
    }

    let currentServerId: string | null = null;

    // Message event handler
    client.on("message", (message) => {
      const messageString =
        message instanceof Buffer
          ? message.toString()
          : JSON.stringify(message);

      const parsedMessage = parseMessage(messageString);
      if (!parsedMessage) {
        client.send(
          createMessage(
            user.name,
            "Invalid message format",
            "",
            "",
            MessageTypes.LOG,
          ),
        );
        return;
      }

      const { type, data, channelId, serverId } = parsedMessage;

      switch (type) {
        case MessageTypes.SWITCH_SERVER:
          validateServerAccess(client, serverId, session.userId)
            .then((hasAccess) => {
              if (!hasAccess) {
                client.send(
                  createMessage(
                    user.name,
                    "Unauthorized server access",
                    "",
                    "",
                    MessageTypes.LOG,
                  ),
                );
                return;
              }

              if (currentServerId) {
                leaveServer(client, currentServerId);
              }
              currentServerId = serverId;
              joinServer(client, serverId);
              client.send(
                createMessage(
                  user.name,
                  "Server switched successfully",
                  "",
                  serverId,
                  MessageTypes.LOG,
                ),
              );
            })
            .catch((error) => {
              console.error("Server switch error:", error);
              client.send(
                createMessage(
                  user.name,
                  "Error switching servers",
                  "",
                  "",
                  MessageTypes.LOG,
                ),
              );
            });
          break;

        case MessageTypes.MESSAGE_SENT:
          if (currentServerId !== serverId) {
            client.send(
              createMessage(
                user.name,
                "Server mismatch error",
                "",
                "",
                MessageTypes.LOG,
              ),
            );
            return;
          }

          broadcastToServer(
            currentServerId,
            createMessage(
              user.name,
              data,
              channelId,
              serverId,
              MessageTypes.NEW_TEXT,
            ),
          );

          void handleMessageSent(
            client,
            data,
            channelId,
            serverId,
            session.userId,
            user,
          );
          break;

        default:
          client.send(
            createMessage(
              user.name,
              `Unknown message type: ${type}`,
              "",
              "",
              MessageTypes.LOG,
            ),
          );
      }
    });

    // Cleanup on client disconnect
    client.on("close", () => {
      if (currentServerId) {
        leaveServer(client, currentServerId);
      }
      serverAccessCache.delete(client);
      console.log("Client disconnected, cleanup completed");
    });

    // Connection successful
    client.send(
      createMessage("", "Connected successfully", "", "", MessageTypes.LOG),
    );
  } catch (error) {
    console.error("WebSocket initialization error:", error);
    client.close();
  }
}

// HTTP GET handler for WebSocket route
export function GET() {
  console.log("HTTP GET request received for WebSocket route");
  return new Response(
    JSON.stringify({
      error: "This endpoint requires a WebSocket connection",
    }),
    {
      status: 426,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
