import uuidValidate from 'uuid-validate';
import { events } from '../db/schema';
import { eq } from 'drizzle-orm';
import { db } from '../src';

export const checkEventExists = async (id: string, res) => {
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
