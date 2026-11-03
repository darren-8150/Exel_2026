'use server'

import { db } from '@/lib/db'
import { suppliers } from '@/lib/db/schema'
import { asc, count, ilike } from 'drizzle-orm'

const SUPPLIERS_PAGE_SIZE = 50

export async function getSuppliers(page = 1, query = '') {
  const safePage = Math.max(1, page)
  const trimmedQuery = query.trim()
  const where = trimmedQuery ? ilike(suppliers.name, `%${trimmedQuery}%`) : undefined
  const [rows, totalResult] = await Promise.all([
    db.select({ id: suppliers.id, name: suppliers.name }).from(suppliers).where(where).orderBy(asc(suppliers.name)).limit(SUPPLIERS_PAGE_SIZE).offset((safePage - 1) * SUPPLIERS_PAGE_SIZE),
    db.select({ total: count() }).from(suppliers).where(where),
  ])
  return { rows, total: Number(totalResult[0]?.total ?? 0), page: safePage, pageSize: SUPPLIERS_PAGE_SIZE }
}
