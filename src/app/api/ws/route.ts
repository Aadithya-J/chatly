// app/api/ws/route.ts (can be any route file in the app directory)
import type { WebSocket, WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';
import { db } from '~/server/db';

type messageType = {
  data: string;
  channelId: string;
  serverId: string;
}

export async function SOCKET(
    client: WebSocket,
    req: IncomingMessage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    server: WebSocketServer
  ) {
    console.log('A client connected');
    console.log('request:',req.url);

    if(!req.url){
      client.send('No url provided');
      client.close();
      return;
    }

    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const token = urlParams.get('token');
    console.log('token:',token);

    if(!token){
      client.send('No token provided');
      client.close();
      return;
    }

    const session = await db.session.findUnique({
      where: {
        sessionToken: token
      }
    });

    if(!session){
      client.send('Invalid token');
      client.close();
      return;
    }

    console.log('Session:',session);  
    const now = new Date();
    const expires = session.expires;
    // Check if the session is expired
    if (now > expires) {
      client.send('Session has expired');
      client.close();
    } else{
      client.send('Session is valid');
    }

    client.on('message', (message) => {
      const messageString = message instanceof Buffer ? message.toString() : JSON.stringify(message);
      console.log('Received message:', messageString);
      // Parse messageString as JSON
      let parsedMessage : messageType
      let data = '';
      try {
        parsedMessage = JSON.parse(messageString) as messageType;
        data = parsedMessage.data;
        console.log('Parsed message:', parsedMessage);
      } catch (error) {
        console.error('Failed to parse message as JSON:', error);
        client.send('Invalid JSON message');
        return;
      }
      client.send(data);
    });
  
    client.on('close', () => {
      console.log('A client disconnected');
    });
  }
export function GET(){
  console.log('');
  return {
    error: 'this is the websocket route. Connect using websockets'
  }
}