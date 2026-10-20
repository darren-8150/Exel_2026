'use server'

import { auth, isAdminRole, isAppRole, type AppRole } from '@/lib/auth'
import { headers } from 'next/headers'

async function requireAdminSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminRole(session.user.role)) throw new Error('Unauthorized')
  return session.user
}

export type ManagedUser = {
  id: string
  name: string
  email: string
  role: AppRole
  createdAt: string
}

function toManagedUser(user: { id: string; name: string; email: string; role?: string | null; createdAt: Date | string }): ManagedUser {
  return { id: user.id, name: user.name, email: user.email, role: isAppRole(user.role) ? user.role : 'standard_user', createdAt: new Date(user.createdAt).toISOString() }
}

export async function listManagedUsers(): Promise<ManagedUser[]> {
  await requireAdminSession()
  const result = await auth.api.listUsers({ query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' }, headers: await headers() })
  return result.users.map(toManagedUser)
}

export async function createManagedUser(input: { name: string; email: string; password: string; role: AppRole }) {
  await requireAdminSession()
  if (!input.name.trim() || !input.email.trim() || input.password.length < 8 || !isAppRole(input.role)) throw new Error('Enter valid user details.')
  const result = await auth.api.createUser({ body: { name: input.name.trim(), email: input.email.trim().toLowerCase(), password: input.password, role: input.role }, headers: await headers() })
  return toManagedUser(result.user)
}

export async function updateManagedUser(input: { id: string; name: string; role: AppRole }) {
  const admin = await requireAdminSession()
  if (!input.name.trim() || !isAppRole(input.role)) throw new Error('Enter valid user details.')
  if (input.id === admin.id && input.role !== 'system_admin') throw new Error('You cannot remove your own system admin access.')
  const result = await auth.api.adminUpdateUser({ body: { userId: input.id, data: { name: input.name.trim(), role: input.role } }, headers: await headers() })
  return toManagedUser(result.user)
}

export async function deleteManagedUser(id: string) {
  const admin = await requireAdminSession()
  if (id === admin.id) throw new Error('You cannot delete your own account.')
  await auth.api.removeUser({ body: { userId: id }, headers: await headers() })
  return id
}

export async function ensurePrimaryAdministrator() {
  const existing = await auth.api.listUsers({ query: { searchValue: 'darren@ecomuk.com', searchField: 'email', searchOperator: 'eq', limit: 1 }, headers: await headers() })
  if (existing.users[0]) return existing.users[0]
  const result = await auth.api.createUser({ body: { name: 'Darren', email: 'darren@ecomuk.com', password: 'Demo123!', role: 'system_admin' }, headers: await headers() })
  return result.user
}
