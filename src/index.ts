// import express from 'express';
// import cors from 'cors';
// import { Server } from 'socket.io';
// import dotenv from 'dotenv';
// import { v4 as uuidv4 } from 'uuid';
// import { neon } from '@neondatabase/serverless';
// import { drizzle } from 'drizzle-orm/neon-http';
// import * as http from 'node:http';
// import { eq } from 'drizzle-orm';
// import { checkEventExists } from './utils/checkEventExsits';
// import { events } from './events/events.schema';
//
// let joinCode = '222222';
// let activeUsers = 0;
//
// const users = [];

//
// expressApp.use(express.json());
//
// // expressApp.get('/api/join-code', (req, res) => {
// //   joinCode = generateJoinCode();
// //   votingStarted = false;
// //   res.json({ joinCode });
// // });
//
// expressApp.post('/api/join', (req, res) => {
//   const { code } = req.body;
//
//   if (code !== joinCode) {
//     res.statusMessage = 'Invalid join code';
//     return res.status(404).json({ error: 'Invalid join code' });
//   }
//
//   const uuid = uuidv4();
//   // io.on('connection', (socket) => {
//   activeUsers++;
//   io.emit('activeUsers', activeUsers);
//   // socket.on('disconnect', () => {
//   //   activeUsers--;
//   //   io.emit('activeUsers', activeUsers);
//   // });
//   // });
//
//   users.push({ uuid });
//   console.log(users);
//   res.status(200).json({ uuid });
// });
//
// expressApp.post('/api/user', (req, res) => {
//   const { uuid } = req.body;
//
//   const user = users.find((user) => user.uuid === uuid);
//
//   if (!user) {
//     res.statusMessage = 'User not found';
//     return res.status(404).json({ error: 'User not found' });
//   }
//
//   res.json(user);
// });
//
// // expressApp.post('/api/start-voting', (req, res) => {
// //   votingStarted = true;
// //   getWss().clients.forEach((client) =>
// //     client.send(JSON.stringify({ action: 'start-voting' })),
// //   );
// //   res.sendStatus(200);
// // });
//

//
// expressApp.get('/api/event/:id/active-users', (req, res) => {
//   res.json(activeUsers);
// });
