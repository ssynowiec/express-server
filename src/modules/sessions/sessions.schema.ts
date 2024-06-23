import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { adminTable } from '../admins/admins.schema';
import { z } from 'zod';

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

const sessionZodSchema = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
});

export type SessionType = z.infer<typeof sessionZodSchema>;
