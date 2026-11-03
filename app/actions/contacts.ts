'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { and, asc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function createContact(siteId: string, name: string, company: string, email: string, phone: string, mobile: string, isPrimary: boolean) {
  const userId = await getUserId()
  if (!name.trim() || !company.trim() || !email.trim()) throw new Error('Complete all contact fields.')
  if (isPrimary) await db.update(contacts).set({ isPrimary: false }).where(and(eq(contacts.userId, userId), eq(contacts.siteId, siteId)))
  const [contact] = await db.insert(contacts).values({ userId, siteId, name: name.trim(), company: company.trim(), email: email.trim(), phone: phone.trim() || null, mobile: mobile.trim() || null, isPrimary }).returning({ id: contacts.id, name: contacts.name, company: contacts.company, email: contacts.email, phone: contacts.phone, mobile: contacts.mobile, isPrimary: contacts.isPrimary, status: contacts.status })
  return contact
}

export async function updateContact(id: number, values: { name: string; company: string; email: string; phone: string; mobile: string; isPrimary: boolean }) {
  const userId = await getUserId()
  if (!values.name.trim() || !values.company.trim() || !values.email.trim()) throw new Error('Complete all contact fields.')
  const existing = await db.select({ siteId: contacts.siteId }).from(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
  if (!existing[0]) throw new Error('Contact not found.')
  if (values.isPrimary) await db.update(contacts).set({ isPrimary: false }).where(and(eq(contacts.userId, userId), eq(contacts.siteId, existing[0].siteId)))
  const [contact] = await db.update(contacts).set({ name: values.name.trim(), company: values.company.trim(), email: values.email.trim(), phone: values.phone.trim() || null, mobile: values.mobile.trim() || null, isPrimary: values.isPrimary }).where(and(eq(contacts.id, id), eq(contacts.userId, userId))).returning({ id: contacts.id, name: contacts.name, company: contacts.company, email: contacts.email, phone: contacts.phone, mobile: contacts.mobile, isPrimary: contacts.isPrimary, status: contacts.status })
  return contact
}

export async function deleteContact(id: number) {
  const userId = await getUserId()
  await db.delete(contacts).where(and(eq(contacts.id, id), eq(contacts.userId, userId)))
}

export async function getContactsForSite(siteId: string) {
  const userId = await getUserId()
  return db.select({ id: contacts.id, name: contacts.name, company: contacts.company, email: contacts.email, phone: contacts.phone, mobile: contacts.mobile, isPrimary: contacts.isPrimary, status: contacts.status }).from(contacts).where(and(eq(contacts.userId, userId), eq(contacts.siteId, siteId))).orderBy(asc(contacts.name))
}
