import {
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { adminTable } from '../admins/admins.schema';

export const eventStatusEnum = pgEnum('eventStatus', [
  'active',
  'draft',
  'archived',
]);

export const eventProgressEnum = pgEnum('eventProgress', [
  'not-started',
  'in-progress',
  'completed',
]);

export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  question: text('question').notNull(),
  answers: json('answers').array().notNull(),
  status: eventStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  eventCode: text('event_code').default(''),
  progress: eventProgressEnum('progress').notNull().default('not-started'),
  authorId: text('author_id')
    .notNull()
    .references(() => adminTable.id),
});
