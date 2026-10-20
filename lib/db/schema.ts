import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  role: text('role').notNull().default('standard_user'),
  banned: boolean('banned').default(false),
  banReason: text('banReason'),
  banExpires: timestamp('banExpires'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(), expiresAt: timestamp('expiresAt').notNull(), token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'), userAgent: text('userAgent'), impersonatedBy: text('impersonatedBy'), userId: text('userId').notNull(),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(), accountId: text('accountId').notNull(), providerId: text('providerId').notNull(), userId: text('userId').notNull(),
  accessToken: text('accessToken'), refreshToken: text('refreshToken'), idToken: text('idToken'), accessTokenExpiresAt: timestamp('accessTokenExpiresAt'), refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'), scope: text('scope'), password: text('password'), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(), identifier: text('identifier').notNull(), value: text('value').notNull(), expiresAt: timestamp('expiresAt').notNull(), createdAt: timestamp('createdAt').notNull().defaultNow(), updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const contacts = pgTable('contacts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(), userId: text('userId').notNull(), name: text('name').notNull(), company: text('company').notNull(), email: text('email').notNull(), phone: text('phone'), status: text('status').notNull().default('New'), lastContactedAt: timestamp('lastContactedAt'), createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const activities = pgTable('activities', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(), userId: text('userId').notNull(), contactId: integer('contactId').notNull(), type: text('type').notNull(), note: text('note').notNull(), createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const sites = pgTable('sites', {
  id: text('id').primaryKey(), userId: text('userId').notNull(), name: text('name').notNull(), accountName: text('accountName'), customerSuffix: text('customerSuffix'), webAddress: text('webAddress'), loggedAt: timestamp('loggedAt'), loggedBy: text('loggedBy'), createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export type Role = 'standard_user' | 'ipad_user' | 'administrator' | 'system_admin'
export const roles: { value: Role; label: string }[] = [
  { value: 'standard_user', label: 'Standard user' }, { value: 'ipad_user', label: 'iPad user' }, { value: 'administrator', label: 'Administrator' }, { value: 'system_admin', label: 'System admin' },
]
