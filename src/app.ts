import express from 'express';
import cors from 'cors';
import eventsRoutes from './modules/events/events.routes';
import usersRoutes from './modules/users/users.routes';
import answersRoutes from './modules/answers/answers.routes';
import adminsRoutes from './modules/admins/admins.routes';
import sessionsRoutes from './modules/sessions/sessions.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', eventsRoutes);
app.use('/api', usersRoutes);
app.use('/api', answersRoutes);
app.use('/api', adminsRoutes);
app.use('/api', sessionsRoutes);

app.get('/api', (req, res) => {
  res.status(200).send('Hello World!');
});

export default app;
