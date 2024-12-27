import { WebSocket, WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import { db } from '~/server/db';
import type { Session } from '@prisma/client';

type MessageType = {
  data: string;
  channelId: string;
  serverId: string;
};

export async function SOCKET(
  client: WebSocket,
  req: IncomingMessage,
  server: WebSocketServer
) {
  console.log('A client connected');
  console.log('request:', req.url);
  if (!req.url) {
    client.send('No URL provided');
    client.close();
    return;
  }

  const urlParams = new URLSearchParams(req.url.split('?')[1]);
  const token = urlParams.get('token');
  console.log('token:', token);

  if (!token) {
    client.send('No token provided');
    client.close();
    return;
  }

  try {
    // Validate session asynchronously
    const session = await db.session.findUnique({
      where: { sessionToken: token },
    });

    if (!session) {
      client.send('Invalid token');
      client.close();
      return;
    }

    console.log('Session:', session);
    const now = new Date();
    const expires = session.expires;
    if (now > expires) {
      client.send('Session has expired');
      client.close();
      return;
    } else {
      client.send('Session is valid');
    }

    // Setup message handler
    client.on('message', (message) => {
      const messageString = message instanceof Buffer ? message.toString() : JSON.stringify(message);
      console.log('Received message:', messageString);
      // Parse messageString as JSON
      let parsedMessage : MessageType
      try {
        parsedMessage = JSON.parse(messageString) as MessageType;
        console.log('Parsed message:', parsedMessage);
        client.send('Handling Message')
        handleMessage(client, parsedMessage, session)
          .then(() => {
            server.clients.forEach((c) => {
              if (c !== client && c.readyState === WebSocket.OPEN) {
                c.send('new-message-received');
              }
            });
          }).catch((error) => console.error('Error handling message:', error));
      } catch (error) {
        console.error('Error handling message:', error);
        client.send('Error handling message');
      } 
    });

    client.on('new-message', (message) => {
      console.log('New message:', message);
    })
    // Handle client disconnect
    client.on('close', () => {
      console.log('A client disconnected');
    });
  } catch(error) {
      console.error('Error fetching session:', error);
      client.send('Error validating session');
      client.close();
  }
}

// Helper function to handle message asynchronously
async function handleMessage(client: WebSocket,messageData: MessageType ,session: Session) {
  try {


    // Create the message in the database
    await db.message.create({
      data: {
        content: messageData.data,
        channelId: messageData.channelId,
        userId: session.userId,
      },
    });
    console.log('Message saved');
    client.send('Message saved');
    return;
  } catch (error) {
    console.error('Failed to parse message as JSON:', error);
    client.send('error saving message message');
    return;
  }

}

// GET method to handle WebSocket connection info request
export function GET() {
  console.log('GET request received for WebSocket route');
  return {
    error: 'This is the WebSocket route. Connect using WebSockets',
  
  };
}