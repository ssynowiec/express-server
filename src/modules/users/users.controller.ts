import { db } from '../../db.config';
import { user } from './users.schema';
import type { Request, Response } from 'express';

export const getAllUsers = async (req: Request, res: Response) => {
  const allUsers = await db.select().from(user);

  res.json(allUsers);
};
