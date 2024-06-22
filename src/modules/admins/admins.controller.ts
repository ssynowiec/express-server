import type { Request, Response } from 'express';
import { db } from '../../db.config';
import { adminTable } from './admins.schema';
import { eq } from 'drizzle-orm';
import { sessionTable } from '../sessions/sessions.schema';

export const getAllAdmins = async (req: Request, res: Response) => {
  const allAnswers = await db.select().from(adminTable);

  res.json(allAnswers);
};

export const getAdminByProviderId = async (req: Request, res: Response) => {
  const { id, provider } = req.params;
  console.log(id, provider);
  const user = await db
    .select()
    .from(adminTable)
    .where(eq(adminTable[`${provider}_id`], id));

  if (!user.length) {
    res.status(404).json({ message: 'User not found' });
  }

  res.json(user[0]);
};

export const getAdminSessionsByAdminId = async (
  req: Request,
  res: Response,
) => {
  const { adminId } = req.params;

  const sessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, adminId));

  console.log(sessions);

  res.json(sessions);
};

export const createNewAdmin = async (req: Request, res: Response) => {
  const data = req.body;
  console.log(data);

  const newAdmin = await db.insert(adminTable).values(data).returning();

  res.json(newAdmin[0]);
};
