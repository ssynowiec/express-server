import { db } from '../../db.config';
import { sessionTable } from './sessions.schema';
import { eq, lt } from 'drizzle-orm';
import type { Request, Response } from 'express';
import { adminTable } from '../admins/admins.schema';

export const createNewSession = async (req: Request, res: Response) => {
  try {
    const { id, userId, expiresAt } = req.body;

    const expiresDate = new Date(expiresAt);

    const session = await db
      .insert(sessionTable)
      .values({ id, userId, expiresAt: expiresDate })
      .returning();

    console.log('session', session);

    res.status(201).json(session[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create session' });
  }
};

export const getSessionBySessionId = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const session = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.id, sessionId));

    if (!session) {
      res.status(404).json({ message: 'Session not found' });
    }

    const user = await db
      .select()
      .from(adminTable)
      .where(eq(adminTable.id, session[0].userId));

    res.status(200).json({
      session: { ...session[0], attributes: {} },
      user: {
        ...user[0],
        attributes: {
          username: user[0].username,
          avatar_url: user[0].avatar_url,
          email: user[0].email,
        },
      },
    });
    // res.status(200).json([
    //   { ...session[0], attributes: {} },
    //   { ...user[0], attributes: {} },
    // ]);
  } catch (error) {}
};

export const updateSessionExpiration = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { expiresAt } = req.body;
    await db
      .update(sessionTable)
      .set({ expiresAt })
      .where(eq(sessionTable.id, sessionId));
    res.status(200);
  } catch (error) {}
};

export const deleteExpiredSessions = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    await db.delete(sessionTable).where(lt(sessionTable.expiresAt, now));
    res.status(200);
  } catch (error) {}
};

export const deleteSessionBySessionId = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
    res.status(200);
  } catch (error) {}
};
