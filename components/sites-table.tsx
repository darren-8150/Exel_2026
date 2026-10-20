'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

const sites = Array.from({ length: 420 }, (_, index) => ({
  id: String(index + 1),
  name: `Exel Site ${String(index + 1).padStart(3, '0')}`,
}))

export default function SitesTable() {
  const [query, setQuery] = useState('')
  const filteredSites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return sites
    return sites.filter((site) => site.name.toLowerCase().includes(normalizedQuery))
  }, [query])

  return (
    <section aria-labelledby="sites-title">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#6f8493]">Workspace</p>
          <h1 id="sites-title" className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Sites</h1>
          <p className="mt-2 text-sm leading-6 text-[#6f8493]">Browse and open your managed sites.</p>
        </div>
        <label className="relative block w-full sm:w-80">
          <span className="sr-only">Search sites</span>
          <Search size={17} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f8493]" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sites" className="w-full rounded-xl border border-[#d9e2e9] bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#91a2ae] focus:border-[#0f5993] focus:ring-2 focus:ring-[#0f5993]/10" />
        </label>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-[#dfe5df] bg-white shadow-[0_8px_24px_rgba(15,89,147,0.05)]">
        <div className="flex items-center justify-between border-b border-[#e8eef2] px-5 py-4"><p className="text-sm font-semibold text-[#1b2621]">Site name</p><p className="text-xs text-[#6f8493]">{filteredSites.length} sites</p></div>
        <div className="max-h-[min(65vh,680px)] overflow-y-auto">
          {filteredSites.length ? filteredSites.map((site) => <Link key={site.id} href={`/sites/${site.id}`} className="group flex items-center justify-between border-b border-[#eef2f4] px-5 py-4 text-sm transition last:border-b-0 hover:bg-[#e7f0f7]"><span className="font-medium text-[#29404f] group-hover:text-[#0f5993]">{site.name}</span><span className="text-xs text-[#91a2ae] opacity-0 transition group-hover:opacity-100">Open site</span></Link>) : <p className="px-5 py-10 text-center text-sm text-[#6f8493]">No sites match your search.</p>}
        </div>
      </div>
    </section>
  )
}
