import { betterAuth } from 'better-auth'
import { admin } from 'better-auth/plugins'
import { createAccessControl } from 'better-auth/plugins/access'
import { pool } from '@/lib/db'

const adminStatements = {
  user: ['create', 'list', 'set-role', 'ban', 'impersonate', 'delete', 'set-password', 'set-email', 'get', 'update'],
  session: ['list', 'revoke', 'delete'],
} as const
const accessControl = createAccessControl(adminStatements)
const administratorRole = accessControl.newRole(adminStatements)
const standardRole = accessControl.newRole({ user: [], session: [] })

const runtimeOrigins = [process.env.V0_RUNTIME_URL, process.env.V0_DEV_APP_URL, process.env.V0_BUILD_URL, process.env.V0_SANDBOX_URL].filter(Boolean) as string[]
const productionOrigins = [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL].filter(Boolean).map((origin) => origin.startsWith('http') ? origin : `https://${origin}`)

export const auth = betterAuth({
  database: pool,
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.V0_RUNTIME_URL),
  trustedOrigins: process.env.NODE_ENV === 'development' ? ['http://localhost:3000', ...runtimeOrigins] : productionOrigins,
  emailAndPassword: { enabled: true },
  plugins: [admin({
    defaultRole: 'standard_user',
    adminRoles: ['administrator', 'system_admin'],
    ac: accessControl,
    roles: {
      standard_user: standardRole,
      ipad_user: standardRole,
      administrator: administratorRole,
      system_admin: administratorRole,
    },
  })],
  ...(process.env.NODE_ENV === 'development' ? { advanced: { defaultCookieAttributes: { sameSite: 'none' as const, secure: true } } } : {}),
})

export type AppRole = 'standard_user' | 'ipad_user' | 'administrator' | 'system_admin'
export const appRoles: { value: AppRole; label: string }[] = [
  { value: 'standard_user', label: 'Standard user' },
  { value: 'ipad_user', label: 'iPad user' },
  { value: 'administrator', label: 'Administrator' },
  { value: 'system_admin', label: 'System admin' },
]

export function isAdminRole(role: unknown): role is 'administrator' | 'system_admin' {
  return role === 'administrator' || role === 'system_admin'
}

export function isAppRole(role: unknown): role is AppRole {
  return appRoles.some((item) => item.value === role)
}

export function displayRole(role: unknown) {
  return appRoles.find((item) => item.value === role)?.label ?? 'Standard user'
}

export async function requireAdmin() {
  const { headers } = await import('next/headers')
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !isAdminRole(session.user.role)) throw new Error('Unauthorized')
  return session.user
}

export async function requireSystemAdmin() {
  const user = await requireAdmin()
  if (user.role !== 'system_admin') throw new Error('Forbidden')
  return user
}

export function normalizeRole(role: unknown): AppRole {
  return isAppRole(role) ? role : 'standard_user'
}

export function getAdminErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unable to complete that request.'
}

export const ADMIN_EMAIL = 'darren@ecomuk.com'
export const ADMIN_NAME = 'Darren'
export const ADMIN_PASSWORD = 'Demo123!'
export const ADMIN_ROLE = 'system_admin' as const

export { pool }
