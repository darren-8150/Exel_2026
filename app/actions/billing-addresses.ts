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
  return db.select({ id: billingAddresses.id, address: billingAddresses.address, city: billingAddresses.city, country: billingAddresses.country, companyName: billingAddresses.companyName, buildingName: billingAddresses.buildingName, address1: billingAddresses.address1, address2: billingAddresses.address2, address3: billingAddresses.address3, address4: billingAddresses.address4, postcode: billingAddresses.postcode, county: billingAddresses.county }).from(billingAddresses).where(and(eq(billingAddresses.siteId, siteId), eq(billingAddresses.userId, userId))).orderBy(desc(billingAddresses.createdAt))
}

export async function createBillingAddress(siteId: string, values: { companyName: string; buildingName: string; address1: string; address2: string; address3: string; address4: string; postcode: string; county: string }) {
  const userId = await getUserId()
  const companyName = values.companyName.trim()
  const buildingName = values.buildingName.trim()
  const address1 = values.address1.trim()
  const address2 = values.address2.trim() || null
  const address3 = values.address3.trim() || null
  const address4 = values.address4.trim() || null
  const postcode = values.postcode.trim()
  const county = values.county.trim()
  if (!companyName || !address1 || !postcode || !county) throw new Error('Complete the required billing address fields.')
  const [billingAddress] = await db.insert(billingAddresses).values({ id: crypto.randomUUID(), userId, siteId, companyName, buildingName, address1, address2, address3, address4, postcode, county, address: address1, city: county, country: county }).returning({ id: billingAddresses.id, address: billingAddresses.address, city: billingAddresses.city, country: billingAddresses.country, companyName: billingAddresses.companyName, buildingName: billingAddresses.buildingName, address1: billingAddresses.address1, address2: billingAddresses.address2, address3: billingAddresses.address3, address4: billingAddresses.address4, postcode: billingAddresses.postcode, county: billingAddresses.county })
  return billingAddress
}
