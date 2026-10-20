'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { siteAddresses } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getSiteAddressesForSite(siteId: string) {
  const userId = await getUserId()
  return db.select({ id: siteAddresses.id, address: siteAddresses.address, city: siteAddresses.city, postcode: siteAddresses.postcode, country: siteAddresses.country }).from(siteAddresses).where(and(eq(siteAddresses.siteId, siteId), eq(siteAddresses.userId, userId))).orderBy(desc(siteAddresses.createdAt))
}

export async function createSiteAddress(siteId: string, values: { address: string; city: string; postcode: string; country: string }) {
  const userId = await getUserId()
  const address = values.address.trim()
  const city = values.city.trim()
  const postcode = values.postcode.trim()
  const country = values.country.trim()
  if (!address || !city || !postcode || !country) throw new Error('Complete all site address fields.')
  const [siteAddress] = await db.insert(siteAddresses).values({ id: crypto.randomUUID(), userId, siteId, address, city, postcode, country }).returning({ id: siteAddresses.id, address: siteAddresses.address, city: siteAddresses.city, postcode: siteAddresses.postcode, country: siteAddresses.country })
  return siteAddress
}
