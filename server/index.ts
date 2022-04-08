import express from 'express';
import morgan from 'morgan'; // eslint-disable-line import/no-extraneous-dependencies
import cors from 'cors';
// eslint-disable-next-line
import { Server } from "socket.io";
import { createServer } from 'http';
import path from 'path';
import router from './routes/index';
import type { ServerToClientEvents, ClientToServerEvents } from './SocketTypes';
import messageController from './controllers/message.controller';

const PORT = process.env.PORT || 4000;

const corsConfig = {
  origin: process.env.SOCKET_URL,
  credentials: true,
};

const app = express();
app.use(cors());
app.use(morgan('short'));
app.use(express.json());
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: {
    // origin: process.env.SERVER_URL,
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('joinRoom', async (userId, eventId) => {
    socket.join(String(eventId));
    const allMessagesFromRoom = await messageController.getAllMessages(eventId);
    io.in(String(eventId)).emit('emitAllMessagesFromServer', allMessagesFromRoom);
  });
  socket.on('emitMsgFromClient', async (userId, eventId, msg) => {
    const newMessage = await messageController.createNewMessage(userId, eventId, msg);
    io.in(String(eventId)).emit('emitMessageFromServer', newMessage);
  });

  socket.on('leaveRoom', (userId, eventId) => {
    socket.leave(String(eventId));
  });
});

app.use('/api', router);
app.use(express.static(path.resolve(__dirname, '../../client/build')));
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
});

httpServer.listen(PORT, () => {
  console.log(`🚀🚀🚀 Server up and listening on port ${PORT} ! 🚀🚀🚀`); // eslint-disable-line
});

export default io;
