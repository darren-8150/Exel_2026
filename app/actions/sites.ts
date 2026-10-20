'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { and, desc, eq } from 'drizzle-orm'

async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return { id: session.user.id, name: session.user.name }
}

export async function getSites() {
  const user = await getCurrentUser()
  const userId = user.id
  return db.select({ id: customers.id, name: customers.name, accountName: customers.accountName, customerSuffix: customers.customerSuffix, webAddress: customers.webAddress, loggedAt: customers.loggedAt, loggedBy: customers.loggedBy }).from(customers).where(eq(customers.userId, userId)).orderBy(desc(customers.createdAt))
}

export async function updateSite(id: string, values: { name: string; accountName: string; customerSuffix: string; webAddress: string }) {
  const user = await getCurrentUser()
  const userId = user.id
  const name = values.name.trim()
  if (!name || name.length > 160) throw new Error('Enter a site name up to 160 characters.')
  const [site] = await db.update(customers).set({ name, accountName: values.accountName.trim() || name, customerSuffix: values.customerSuffix.trim() || null, webAddress: values.webAddress.trim() || null }).where(and(eq(customers.id, id), eq(customers.userId, userId))).returning({ id: customers.id, name: customers.name, accountName: customers.accountName, customerSuffix: customers.customerSuffix, webAddress: customers.webAddress, loggedAt: customers.loggedAt, loggedBy: customers.loggedBy })
  if (!site) throw new Error('Site not found.')
  revalidatePath('/')
  return site
}

export async function createSite(name: string) {
  const user = await getCurrentUser()
  const userId = user.id
  const trimmedName = name.trim()
  if (!trimmedName || trimmedName.length > 160) throw new Error('Enter a site name up to 160 characters.')
  const id = crypto.randomUUID()
  const loggedAt = new Date()
  await db.insert(customers).values({ id, userId, name: trimmedName, accountName: trimmedName, loggedAt, loggedBy: user.name || user.id })
  revalidatePath('/')
  return { id, name: trimmedName, accountName: trimmedName, customerSuffix: null, webAddress: null, loggedAt, loggedBy: user.name || user.id }
}
