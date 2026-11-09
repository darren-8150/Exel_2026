import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import CrmDashboard from '@/components/crm-dashboard'
import { getSites } from '@/app/actions/sites'
import { getAccountManagers } from '@/app/actions/account-managers'
import { getSuppliers } from '@/app/actions/suppliers'
import { getSiteAddressesForSite } from '@/app/actions/site-addresses'

export default async function Page({ searchParams }: { searchParams: Promise<{ customer?: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const sites = await getSites()
  const accountManagers = await getAccountManagers()
  const suppliers = await getSuppliers()
  const { customer } = await searchParams
  const initialCustomerId = customer && sites.some((site) => site.id === customer) ? customer : undefined
  const initialSiteAddresses = initialCustomerId ? await getSiteAddressesForSite(initialCustomerId) : []
  return <CrmDashboard currentUserId={session.user.id} currentUserName={session.user.name} currentUserEmail={session.user.email} currentUserRole={session.user.role} sites={sites} accountManagers={accountManagers} suppliers={suppliers} initialCustomerId={initialCustomerId} initialSiteAddresses={initialSiteAddresses} />
}
