import { Router } from 'express';
import {
  getAllUsers,
  getAllUsersByEventId,
  getUserById,
} from './users.controller';

const router = Router();

router.get('/users', getAllUsers);
router.get('/user/:uuid', getUserById);
router.get('/users/:eventId', getAllUsersByEventId);

export default router;
