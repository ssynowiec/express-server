import { pgEnum, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { events } from '../events/events.schema';
import { answersSchema } from '../answers/answers.schema';

export const userProgressEnum = pgEnum('userProgressEnum', [
  'not-started',
  'in-progress',
  'completed',
]);

export const user = pgTable('user', {
  id: uuid('id').primaryKey().defaultRandom(),
  event_id: uuid('event_id')
    .notNull()
    .references(() => events.id, { onDelete: 'cascade' }),
  answers_id: uuid('answers_id').references(() => answersSchema.id),
  progress: userProgressEnum('progress').notNull().default('not-started'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});
