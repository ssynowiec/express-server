import { Router } from 'express';
import {
  createNewEvent,
  getAllEvents,
  getEventById,
  startEvent,
} from './events.controller';

const router = Router();

router.get('/events', getAllEvents);
router.post('/event', createNewEvent);
router.get('/event/:id', getEventById);
router.get('/start-event/:id', startEvent);

export default router;
