import { numeric, pgTable, text } from 'drizzle-orm/pg-core';

export const adminTable = pgTable('admin', {
  id: text('id').primaryKey(),
  email: text('email'),
  github_id: numeric('github_id'),
  google_id: numeric('google_id'),
  facebook_id: numeric('facebook_id'),
  username: text('username'),
  avatar_url: text('avatar_url'),
});
