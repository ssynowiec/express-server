import { Router } from 'express';
import {
  createNewEvent,
  deleteEvent,
  getActiveUsers,
  getAllEvents,
  getEventById,
  getEventsByAuthorId,
  startEvent,
  userJoinEvent,
} from './events.controller';

const router = Router();

router.get('/events', getAllEvents);
router.get('/events/:authorId', getEventsByAuthorId);
router.post('/event', createNewEvent);
router.get('/event/:id', getEventById);
router.get('/start-event/:id', startEvent);
router.delete('/event/:id', deleteEvent);
router.post('/event/join', userJoinEvent);
router.get('/event/:eventCode/active-users', getActiveUsers);

export default router;
