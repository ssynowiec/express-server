import app from './app';
import http from 'node:http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const port = process.env.PORT || 4001;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
