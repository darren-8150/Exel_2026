'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { customers, siteAddresses } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function updateSiteAddress(id: string, values: { companyName: string; buildingName: string; address1: string; address2: string; address3: string; address4: string; postcode: string; county: string }) {
  const userId = await getUserId()
  const companyName = values.companyName.trim()
  const buildingName = values.buildingName.trim()
  const address1 = values.address1.trim()
  const address2 = values.address2.trim() || null
  const address3 = values.address3.trim() || null
  const address4 = values.address4.trim() || null
  const postcode = values.postcode.trim()
  const county = values.county.trim()
  if (!companyName || !address1 || !postcode || !county) throw new Error('Complete the required site address fields.')
  const [siteAddress] = await db.update(siteAddresses).set({ companyName, buildingName, address1, address2, address3, address4, postcode, county, address: address1, city: county, country: county }).where(and(eq(siteAddresses.id, id), eq(siteAddresses.userId, userId))).returning({ id: siteAddresses.id, companyName: siteAddresses.companyName, buildingName: siteAddresses.buildingName, address1: siteAddresses.address1, address2: siteAddresses.address2, address3: siteAddresses.address3, address4: siteAddresses.address4, postcode: siteAddresses.postcode, county: siteAddresses.county })
  return siteAddress
}

export async function deleteSiteAddress(id: string) {
  const userId = await getUserId()
  await db.delete(siteAddresses).where(and(eq(siteAddresses.id, id), eq(siteAddresses.userId, userId)))
}

export async function getSiteAddressesForSite(siteId: string) {
  const userId = await getUserId()
  return db.select({ id: siteAddresses.id, companyName: siteAddresses.companyName, buildingName: siteAddresses.buildingName, address1: siteAddresses.address1, address2: siteAddresses.address2, address3: siteAddresses.address3, address4: siteAddresses.address4, postcode: siteAddresses.postcode, county: siteAddresses.county }).from(siteAddresses).where(and(eq(siteAddresses.siteId, siteId), eq(siteAddresses.userId, userId))).orderBy(desc(siteAddresses.createdAt))
}

export async function createSiteAddress(siteId: string, values: { companyName: string; buildingName: string; address1: string; address2: string; address3: string; address4: string; postcode: string; county: string }) {
  const userId = await getUserId()
  const companyName = values.companyName.trim()
  const buildingName = values.buildingName.trim()
  const address1 = values.address1.trim()
  const address2 = values.address2.trim() || null
  const address3 = values.address3.trim() || null
  const address4 = values.address4.trim() || null
  const postcode = values.postcode.trim()
  const county = values.county.trim()
  if (!companyName || !address1 || !postcode || !county) throw new Error('Complete the required site address fields.')
  const [siteAddress] = await db.insert(siteAddresses).values({ id: crypto.randomUUID(), userId, siteId, companyName, buildingName, address1, address2, address3, address4, postcode, county, address: address1, city: county, country: county }).returning({ id: siteAddresses.id, companyName: siteAddresses.companyName, buildingName: siteAddresses.buildingName, address1: siteAddresses.address1, address2: siteAddresses.address2, address3: siteAddresses.address3, address4: siteAddresses.address4, postcode: siteAddresses.postcode, county: siteAddresses.county })
  return siteAddress
}

export async function getSiteAddressWithCustomer(id: string) {
  const userId = await getUserId()
  const [siteAddress] = await db.select({ id: siteAddresses.id, siteId: siteAddresses.siteId, companyName: siteAddresses.companyName, buildingName: siteAddresses.buildingName, address1: siteAddresses.address1, address2: siteAddresses.address2, address3: siteAddresses.address3, address4: siteAddresses.address4, postcode: siteAddresses.postcode, county: siteAddresses.county, customerName: customers.name }).from(siteAddresses).leftJoin(customers, and(eq(customers.id, siteAddresses.siteId), eq(customers.userId, userId))).where(and(eq(siteAddresses.id, id), eq(siteAddresses.userId, userId))).limit(1)
  return siteAddress ?? null
}
