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

export async function updateBillingAddress(id: string, values: { companyName: string; buildingName: string; address1: string; address2: string; address3: string; address4: string; postcode: string; county: string; isPrimary: boolean }) {
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
  if (values.isPrimary) {
    const existing = await db.select({ siteId: billingAddresses.siteId }).from(billingAddresses).where(and(eq(billingAddresses.id, id), eq(billingAddresses.userId, userId)))
    if (existing[0]) await db.update(billingAddresses).set({ isPrimary: false }).where(and(eq(billingAddresses.userId, userId), eq(billingAddresses.siteId, existing[0].siteId)))
  }
  const [billingAddress] = await db.update(billingAddresses).set({ companyName, buildingName, address1, address2, address3, address4, postcode, county, isPrimary: values.isPrimary, address: address1, city: county, country: county }).where(and(eq(billingAddresses.id, id), eq(billingAddresses.userId, userId))).returning({ id: billingAddresses.id, address: billingAddresses.address, city: billingAddresses.city, country: billingAddresses.country, companyName: billingAddresses.companyName, buildingName: billingAddresses.buildingName, address1: billingAddresses.address1, address2: billingAddresses.address2, address3: billingAddresses.address3, address4: billingAddresses.address4, postcode: billingAddresses.postcode, county: billingAddresses.county, isPrimary: billingAddresses.isPrimary })
  return billingAddress
}

export async function deleteBillingAddress(id: string) {
  const userId = await getUserId()
  await db.delete(billingAddresses).where(and(eq(billingAddresses.id, id), eq(billingAddresses.userId, userId)))
}

export async function getBillingAddressesForSite(siteId: string) {
  const userId = await getUserId()
  return db.select({ id: billingAddresses.id, address: billingAddresses.address, city: billingAddresses.city, country: billingAddresses.country, companyName: billingAddresses.companyName, buildingName: billingAddresses.buildingName, address1: billingAddresses.address1, address2: billingAddresses.address2, address3: billingAddresses.address3, address4: billingAddresses.address4, postcode: billingAddresses.postcode, county: billingAddresses.county, isPrimary: billingAddresses.isPrimary }).from(billingAddresses).where(and(eq(billingAddresses.siteId, siteId), eq(billingAddresses.userId, userId))).orderBy(desc(billingAddresses.createdAt))
}

export async function createBillingAddress(siteId: string, values: { companyName: string; buildingName: string; address1: string; address2: string; address3: string; address4: string; postcode: string; county: string; isPrimary: boolean }) {
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
  if (values.isPrimary) await db.update(billingAddresses).set({ isPrimary: false }).where(and(eq(billingAddresses.userId, userId), eq(billingAddresses.siteId, siteId)))
  const [billingAddress] = await db.insert(billingAddresses).values({ id: crypto.randomUUID(), userId, siteId, companyName, buildingName, address1, address2, address3, address4, postcode, county, isPrimary: values.isPrimary, address: address1, city: county, country: county }).returning({ id: billingAddresses.id, address: billingAddresses.address, city: billingAddresses.city, country: billingAddresses.country, companyName: billingAddresses.companyName, buildingName: billingAddresses.buildingName, address1: billingAddresses.address1, address2: billingAddresses.address2, address3: billingAddresses.address3, address4: billingAddresses.address4, postcode: billingAddresses.postcode, county: billingAddresses.county, isPrimary: billingAddresses.isPrimary })
  return billingAddress
}
