import { Router } from 'express';
import { getAllUsers } from './users.controller';

const router = Router();

router.get('/users', getAllUsers);

export default router;
