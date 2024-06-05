import { json, pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from '../events/events.schema';

export const userProgressEnum = pgEnum('userProgressEnum', [
  'not-started',
  'in-progress',
  'completed',
]);

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  event_id: uuid('event_id')
    .notNull()
    .references(() => events.id),
  answers: json('answers').array(),
  progress: userProgressEnum('progress').notNull().default('not-started'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
