import { numeric, pgTable, text } from 'drizzle-orm/pg-core';

export const adminTable = pgTable('admin', {
  id: text('id').primaryKey(),
  github_id: numeric('github_id'),
  username: text('username'),
});
