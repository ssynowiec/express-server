import { json, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from '../events/events.schema';

export const answersSchema = pgTable('answers', {
  id: uuid('id').primaryKey().defaultRandom(),
  event_id: uuid('event_id')
    .notNull()
    .references(() => events.id),
  answers: json('answers').array().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
