import app from './app';
import http from 'node:http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 4001;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

io.on('connection', (socket) => {
  socket.on('join', (room) => {
    socket.join(room);
    const roomUsers = io.sockets.adapter.rooms.get(room)?.size || 0;
    socket.to(room).emit('join', roomUsers);
  });
  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`User left ${room}`);
    const roomUsers = io.sockets.adapter.rooms.get(room)?.size || 0;
    socket.to(room).emit('join', roomUsers);
  });
});
