import { db } from '../../db.config';
import { user } from './users.schema';
import type { Request, Response } from 'express';
import { eq } from 'drizzle-orm';

export const getAllUsers = async (req: Request, res: Response) => {
  const allUsers = await db.select().from(user);

  res.json(allUsers);
};

export const getAllUsersByEventId = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const allUsers = await db
    .select()
    .from(user)
    .where(eq(user.event_id, eventId));

  res.json(allUsers);
};

export const getUserById = async (req: Request, res: Response) => {
  const { uuid } = req.params;

  const userById = await db.select().from(user).where(eq(user.id, uuid));

  res.json(userById[0]);
};
