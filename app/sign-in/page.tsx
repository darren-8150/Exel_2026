import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm, AuthLink, AuthShell } from '@/components/auth-form'

export default async function SignInPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/')
  return <AuthShell title="Welcome back" description="Sign in to continue to your customer workspace."><AuthForm /><AuthLink mode="sign-in" /></AuthShell>
}
