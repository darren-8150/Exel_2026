'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { billingAddresses } from '@/lib/db/schema'
import { headers } from 'next/headers'
import { and, desc, eq } from 'drizzle-orm'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getBillingAddressesForSite(siteId: string) {
  const userId = await getUserId()
  return db.select({ id: billingAddresses.id, address: billingAddresses.address, city: billingAddresses.city, postcode: billingAddresses.postcode, country: billingAddresses.country }).from(billingAddresses).where(and(eq(billingAddresses.siteId, siteId), eq(billingAddresses.userId, userId))).orderBy(desc(billingAddresses.createdAt))
}

export async function createBillingAddress(siteId: string, values: { address: string; city: string; postcode: string; country: string }) {
  const userId = await getUserId()
  const address = values.address.trim()
  const city = values.city.trim()
  const postcode = values.postcode.trim()
  const country = values.country.trim()
  if (!address || !city || !postcode || !country) throw new Error('Complete all billing address fields.')
  const [billingAddress] = await db.insert(billingAddresses).values({ id: crypto.randomUUID(), userId, siteId, address, city, postcode, country }).returning({ id: billingAddresses.id, address: billingAddresses.address, city: billingAddresses.city, postcode: billingAddresses.postcode, country: billingAddresses.country })
  return billingAddress
}
