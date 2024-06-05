import uuidValidate from 'uuid-validate';
import { events } from './events.schema';
import { eq } from 'drizzle-orm';
import type { Response } from 'express';
import { db } from '../../db.config';

export const checkEventExists = async (id: string, res: Response) => {
  if (!uuidValidate(id)) {
    res.status(400).send('Invalid UUID format');
    return;
  }

  const event = await db.select().from(events).where(eq(events.id, id));

  if (!event.length) {
    res.statusMessage = 'Event not found';
    return res.status(404).json({ error: 'Event not found' });
  }

  return event;
};
