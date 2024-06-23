import { Router } from 'express';
import {
  addNewAnswer,
  getAllAnswers,
  getAnswerByEventId,
} from './answers.controller';

const router = Router();

router.get('/answers', getAllAnswers);
router.get('/answers/:eventId', getAnswerByEventId);
router.post('/answers', addNewAnswer);

export default router;
