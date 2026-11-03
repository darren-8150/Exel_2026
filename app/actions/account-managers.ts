'use server'

import { db } from '@/lib/db'
import { user } from '@/lib/db/schema'
import { asc, eq } from 'drizzle-orm'

export async function getAccountManagers() {
  return db.select({ id: user.id, name: user.name, email: user.email }).from(user).where(eq(user.accountManager, true)).orderBy(asc(user.name))
}
