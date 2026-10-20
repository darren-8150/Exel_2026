import Link from 'next/link'

type SitePageProps = { params: Promise<{ id: string }> }

export default async function SitePage({ params }: SitePageProps) {
  const { id } = await params
  const siteName = `Exel Site ${id.padStart(3, '0')}`

  return <main className="min-h-screen bg-[#f7f8f6] px-5 py-10 text-[#1b2621] md:px-10"><div className="mx-auto max-w-5xl"><Link href="/" className="text-sm font-medium text-[#0f5993] hover:underline">Back to dashboard</Link><p className="mt-12 text-sm font-medium text-[#6f8493]">Site</p><h1 className="mt-2 font-serif text-5xl tracking-tight">{siteName}</h1></div></main>
}
