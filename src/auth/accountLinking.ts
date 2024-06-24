import { db } from '../db.config';
import { adminTable } from '../modules/admins/admins.schema';
import { eq } from 'drizzle-orm';

export const linkAccount = async (
  email: string,
  provider: string,
  id: string,
) => {
  const existingUser = await db
    .select()
    .from(adminTable)
    .where(eq(adminTable.email, email));

  if (!existingUser) {
    return;
  }

  const providerField = `${provider}_id`;

  const user = existingUser[0];

  const updatedUser = await db
    .update(adminTable)
    .set({ [providerField]: id })
    .where(eq(adminTable.id, user.id))
    .returning();

  return updatedUser[0];
};
