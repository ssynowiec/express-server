import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { adminTable } from '../admins/admins.schema';

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => adminTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
});
