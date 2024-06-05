import { Router } from 'express';
import {
  createNewEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  startEvent,
} from './events.controller';

const router = Router();

router.get('/events', getAllEvents);
router.post('/event', createNewEvent);
router.get('/event/:id', getEventById);
router.get('/start-event/:id', startEvent);
router.delete('/event/:id', deleteEvent);

export default router;
