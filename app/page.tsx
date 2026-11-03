import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import CrmDashboard from '@/components/crm-dashboard'
import { getSites } from '@/app/actions/sites'
import { getAccountManagers } from '@/app/actions/account-managers'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const sites = await getSites()
  const accountManagers = await getAccountManagers()
  return <CrmDashboard currentUserId={session.user.id} currentUserName={session.user.name} currentUserEmail={session.user.email} currentUserRole={session.user.role} sites={sites} accountManagers={accountManagers} />
}
