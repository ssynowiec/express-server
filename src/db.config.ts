import { drizzle } from 'drizzle-orm/postgres-js';
import { events } from './modules/events/events.schema';

import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const queryClient = postgres(process.env.DATABASE_URL);

const schema = { ...events };

export const db = drizzle(queryClient, { schema });
