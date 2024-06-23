import type { Request, Response } from 'express';

import { events } from './events.schema';
import { db } from '../../db.config';
import { checkEventExists } from './checkEventExists';
import { generateRandomCode } from './generateJoinCode';
import { eq } from 'drizzle-orm';
import { user } from '../users/users.schema';
import { io } from '../../server';

export const getAllEvents = async (req: Request, res: Response) => {
  const allEvents = await db.select().from(events);

  res.json(allEvents);
};

export const getEventsByAuthorId = async (req: Request, res: Response) => {
  const { authorId } = req.params;

  const eventsByAuthor = await db
    .select()
    .from(events)
    .where(eq(events.authorId, authorId));

  res.json(eventsByAuthor);
};

export const getEventById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const event = await checkEventExists(id, res);

  res.json(event[0]);
};

export const createNewEvent = async (req: Request, res: Response) => {
  const event = req.body;

  const newEvent = await db.insert(events).values(event).returning();
  res.json(newEvent[0]);
};

export const startEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const event = await checkEventExists(id, res);

  if (event[0].progress !== 'not-started') {
    res.statusMessage = 'Event already started';
    return res.status(200).json(event[0]);
  }

  let isUniqueCode = false;

  let randomCode = '';
  while (!isUniqueCode) {
    randomCode = generateRandomCode();
    const event = await db
      .select()
      .from(events)
      .where(eq(events.eventCode, randomCode));

    if (!event.length) {
      isUniqueCode = true;
    }
  }

  const updatedEvent = await db
    .update(events)
    .set({ eventCode: randomCode, progress: 'in-progress' })
    .where(eq(events.id, id))
    .returning();

  res.json(updatedEvent[0]);
};

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params;

  const event = await checkEventExists(id, res);

  await db.delete(events).where(eq(events.id, id));

  res.json(event[0]);
};

export const userJoinEvent = async (req: Request, res: Response) => {
  const { code: userCode } = req.body;

  const event = await db
    .select()
    .from(events)
    .where(eq(events.eventCode, userCode));

  if (!event.length) {
    res.statusMessage = 'Event not found';
    return res.status(404).json({ error: 'Event not found' });
  }

  const newUser = await db
    .insert(user)
    .values({ event_id: event[0].id })
    .returning();

  res.json(newUser[0].id);
};

export const getActiveUsers = async (req: Request, res: Response) => {
  const { eventCode } = req.params;

  const activeUsers = io.sockets.adapter.rooms.get(eventCode)?.size || 0;

  res.json({ activeUsers });
};
