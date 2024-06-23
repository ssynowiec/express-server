import { Lucia } from 'lucia';

import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { db } from '../db.config';
import { sessionTable } from '../modules/sessions/sessions.schema';
import { adminTable } from '../modules/admins/admins.schema';

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, adminTable);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === 'production',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      githubId: attributes.github_id,
      username: attributes.username,
      avatar_url: attributes.avatar_url,
    };
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      github_id: number;
      username: string;
      avatar_url: string;
    };
  }
}
