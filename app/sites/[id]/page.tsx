import Link from 'next/link'
import { headers } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getSiteAddressWithCustomer } from '@/app/actions/site-addresses'

type SitePageProps = { params: Promise<{ id: string }> }

export default async function SitePage({ params }: SitePageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const { id } = await params
  const site = await getSiteAddressWithCustomer(id)
  if (!site) notFound()

  const siteName = site.companyName || site.buildingName || 'Site'
  const title = site.customerName ? `${site.customerName} - ${siteName}` : siteName
  const addressLines = [site.buildingName, site.address1, site.address2, site.address3, site.address4, site.county, site.postcode].filter(Boolean)

  return (
    <main className="min-h-screen bg-[#f7f8f6] px-5 py-8 text-[#29404f] md:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link href={`/?customer=${site.siteId}`} className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#d9e2e9] bg-white px-4 py-2 text-sm font-medium text-[#0f5993] hover:bg-[#e7f0f7]">
          <ArrowLeft size={16} aria-hidden="true" />
          Back to {site.customerName || 'customer'}
        </Link>
        <header className="flex flex-col gap-1">
          <p className="text-sm font-medium text-[#6f8493]">Site</p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight">{title}</h1>
        </header>
        <section className="rounded-lg border border-[#d9e2e9] bg-white p-5">
          <h2 className="text-lg font-semibold">Address</h2>
          <address className="mt-3 flex flex-col gap-1 text-sm not-italic leading-relaxed">
            {addressLines.length ? addressLines.map((line, index) => <span key={index}>{line}</span>) : <span className="text-[#6f8493]">No address recorded.</span>}
          </address>
        </section>
      </div>
    </main>
  )
}
