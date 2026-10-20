'use client'

import { createSite } from '@/app/actions/sites'
import { Plus, Search } from 'lucide-react'
import Link from 'next/link'
import { useMemo, useState } from 'react'

type Site = { id: string; name: string }

export default function SitesTable({ initialSites }: { initialSites: Site[] }) {
  const [sites, setSites] = useState(initialSites)
  const [query, setQuery] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const filteredSites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return normalizedQuery ? sites.filter((site) => site.name.toLowerCase().includes(normalizedQuery)) : sites
  }, [query, sites])

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const site = await createSite(name)
      setSites((current) => [site, ...current])
      setName('')
      setShowCreate(false)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create site.')
    } finally {
      setSaving(false)
    }
  }

  return <section aria-labelledby="sites-title">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-[#6f8493]">Workspace</p><h1 id="sites-title" className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Sites</h1><p className="mt-2 text-sm leading-6 text-[#6f8493]">Browse and open your managed sites.</p></div><div className="flex flex-col gap-3 sm:flex-row"><label className="relative block w-full sm:w-72"><span className="sr-only">Search sites</span><Search size={17} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6f8493]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search sites" className="w-full rounded-xl border border-[#d9e2e9] bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#91a2ae] focus:border-[#0f5993] focus:ring-2 focus:ring-[#0f5993]/10" /></label><button type="button" onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f5993] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0b4775]"><Plus size={17} />New site</button></div></div>
    <div className="mt-8 overflow-hidden rounded-2xl border border-[#dfe5df] bg-white shadow-[0_8px_24px_rgba(15,89,147,0.05)]"><div className="flex items-center justify-between border-b border-[#e8eef2] px-5 py-4"><p className="text-sm font-semibold text-[#1b2621]">Site name</p><p className="text-xs text-[#6f8493]">{filteredSites.length} sites</p></div><div className="max-h-[min(65vh,680px)] overflow-y-auto">{filteredSites.length ? filteredSites.map((site) => <Link key={site.id} href={`/sites/${site.id}`} className="group flex items-center justify-between border-b border-[#eef2f4] px-5 py-4 text-sm transition last:border-b-0 hover:bg-[#e7f0f7]"><span className="font-medium text-[#29404f] group-hover:text-[#0f5993]">{site.name}</span><span className="text-xs text-[#91a2ae] opacity-0 transition group-hover:opacity-100">Open site</span></Link>) : <p className="px-5 py-10 text-center text-sm text-[#6f8493]">No sites match your search.</p>}</div></div>
    {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="new-site-title"><div className="w-full max-w-md rounded-2xl border border-[#dfe5df] bg-white p-6 shadow-[0_20px_60px_rgba(15,89,147,0.18)]"><div className="flex items-center justify-between"><h2 id="new-site-title" className="font-serif text-2xl">New site</h2><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg px-2 py-1 text-xl text-[#6f8493] hover:bg-[#e7f0f7]" aria-label="Close new site dialog">×</button></div><form onSubmit={handleCreate} className="mt-6 space-y-5"><label className="block text-sm font-medium text-[#344054]">Site name<input required maxLength={160} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-[#d9dee7] px-4 py-3 outline-none focus:border-[#0f5993]" placeholder="Enter site name" /></label>{error && <p role="alert" className="text-sm text-[#b42318]">{error}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#6f8493] hover:bg-[#e7f0f7]">Cancel</button><button disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Create site'}</button></div></form></div></div>}
  </section>
}
