import { Router } from 'express';
import {
  createNewSession,
  deleteExpiredSessions,
  deleteSessionBySessionId,
  getSessionBySessionId,
  updateSessionExpiration,
} from './sessions.controller';

const router = Router();

router.post('/sessions', createNewSession);
router.get('/sessions/:sessionId', getSessionBySessionId);
router.put('/sessions/:sessionId/expiration', updateSessionExpiration);
router.delete('/sessions/expired', deleteExpiredSessions);
router.delete('/sessions/:sessionId', deleteSessionBySessionId);

export default router;
