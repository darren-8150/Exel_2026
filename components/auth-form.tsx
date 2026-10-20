'use client'

import { FormEvent, useState } from 'react'
import { authClient } from '@/lib/auth-client'

export function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    const result = await authClient.signIn.email({ email, password })
    if (result.error) {
      setError('Unable to sign in. Check your email and password and try again.')
      setLoading(false)
      return
    }
    window.location.assign('/')
  }

  return <form onSubmit={handleSubmit} className="mt-8 space-y-5">
    <div><label htmlFor="email" className="mb-2 block text-sm font-medium text-[#344054]">Email</label><input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="w-full rounded-lg border border-[#d9dee7] bg-white px-4 py-3 text-sm text-[#182230] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0f5993] focus:ring-2 focus:ring-[#0f5993]/10" /></div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-medium text-[#344054]">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" className="w-full rounded-lg border border-[#d9dee7] bg-white px-4 py-3 text-sm text-[#182230] outline-none transition placeholder:text-[#98a2b3] focus:border-[#0f5993] focus:ring-2 focus:ring-[#0f5993]/10" /></div>
    {error && <p role="alert" className="rounded-lg bg-[#fef3f2] px-4 py-3 text-sm text-[#b42318]">{error}</p>}
    <button type="submit" disabled={loading} className="mt-6 w-full rounded-lg bg-[#0f5993] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b4775] disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button>
  </form>
}

export function SignOutButton() {
  return <button onClick={() => authClient.signOut({ fetchOptions: { onSuccess: () => window.location.assign('/sign-in') } })} aria-label="Sign out" className="text-[#7a8780] hover:text-[#225b4a]">Sign out</button>
}

export function SignUpForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setError(''); setLoading(true); const result = await authClient.signUp.email({ name, email, password }); if (result.error) { setError('Unable to create your account. Check the details and try again.'); setLoading(false); return }; window.location.assign('/') }
  return <form onSubmit={handleSubmit} className="mt-8 space-y-5"><div><label htmlFor="name" className="mb-2 block text-sm font-medium text-[#315746]">Name</label><input id="name" required value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-sm outline-none focus:border-[#39725d]" /></div><div><label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-[#315746]">Email</label><input id="signup-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-sm outline-none focus:border-[#39725d]" /></div><div><label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-[#315746]">Password</label><input id="signup-password" type="password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-[#dfe5df] bg-white px-4 py-3 text-sm outline-none focus:border-[#39725d]" /></div>{error && <p role="alert" className="rounded-xl bg-[#f8e9e7] px-4 py-3 text-sm text-[#9d4e45]">{error}</p>}<button type="submit" disabled={loading} className="w-full rounded-xl bg-[#225b4a] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Creating account…' : 'Create account'}</button></form>
}

export function AuthShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) { return <main className="flex min-h-screen items-center justify-center bg-[#f3f6fa] px-5 py-12"><section className="w-full max-w-[432px] rounded-xl border border-[#e7ebf0] bg-white px-8 py-10 shadow-[0_8px_24px_rgba(16,24,40,0.06)] sm:px-9"><div className="flex justify-center"><img src="/exel-contracts-ltd.svg" alt="Exel Contracts Ltd" className="h-auto w-[188px]" /></div><h1 className="sr-only">{title}</h1><p className="sr-only">{description}</p>{children}</section></main> }

export function AuthLink({ mode }: { mode: 'sign-in' | 'sign-up' }) { return mode === 'sign-in' ? <p className="mt-6 text-center text-xs font-medium tracking-wide text-[#7a8780]">Powered by <span className="font-semibold text-[#0f5993]">Discover V3.1</span></p> : <p className="mt-6 text-center text-sm text-[#77837c]">Already have an account? <a className="font-semibold text-[#39725d]" href="/sign-in">Sign in</a></p> }
