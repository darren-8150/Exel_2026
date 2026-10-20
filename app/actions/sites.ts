'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { sites } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getSites() {
  const userId = await getUserId()
  return db.select({ id: sites.id, name: sites.name }).from(sites).where(eq(sites.userId, userId)).orderBy(desc(sites.createdAt))
}

export async function createSite(name: string) {
  const userId = await getUserId()
  const trimmedName = name.trim()
  if (!trimmedName || trimmedName.length > 160) throw new Error('Enter a site name up to 160 characters.')
  const id = crypto.randomUUID()
  await db.insert(sites).values({ id, userId, name: trimmedName })
  revalidatePath('/')
  revalidatePath(`/sites/${id}`)
  return { id, name: trimmedName }
}
