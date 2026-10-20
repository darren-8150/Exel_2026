import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import CrmDashboard from '@/components/crm-dashboard'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <CrmDashboard currentUserId={session.user.id} currentUserRole={session.user.role} />
}
