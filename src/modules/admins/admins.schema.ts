import { numeric, pgTable, text } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const adminTable = pgTable('admin', {
  id: text('id').primaryKey(),
  email: text('email'),
  github_id: numeric('github_id'),
  google_id: numeric('google_id'),
  facebook_id: numeric('facebook_id'),
  linkedin_id: text('linkedin_id'),
  username: text('username'),
  avatar_url: text('avatar_url'),
});

const adminSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  github_id: z.number().nullable(),
  google_id: z.number().nullable(),
  facebook_id: z.number().nullable(),
  linkedin_id: z.string().nullable(),
  username: z.string().nullable(),
  avatar_url: z.string().nullable(),
});

export type AdminType = z.infer<typeof adminSchema>;
