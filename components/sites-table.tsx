'use client'

import { createSite } from '@/app/actions/sites'
import { ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

type Site = { id: string; name: string }

const pageSize = 10

export default function SitesTable({ initialSites }: { initialSites: Site[] }) {
  const [sites, setSites] = useState(initialSites)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [detailTab, setDetailTab] = useState<'Details' | 'Contacts' | 'Billing Address'>('Details')

  const filteredSites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return normalizedQuery ? sites.filter((site) => site.name.toLowerCase().includes(normalizedQuery)) : sites
  }, [query, sites])
  const pageCount = Math.max(1, Math.ceil(filteredSites.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const visibleSites = filteredSites.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function updateQuery(value: string) {
    setQuery(value)
    setPage(1)
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      const site = await createSite(name)
      setSites((current) => [site, ...current])
      setName('')
      setShowCreate(false)
      setPage(1)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create site.')
    } finally {
      setSaving(false)
    }
  }

  if (selectedSite) {
    const tabs = ['Details', 'Contacts', 'Billing Address'] as const
    return <section aria-labelledby="site-detail-title"><button type="button" onClick={() => { setSelectedSite(null); setDetailTab('Details') }} className="text-sm font-semibold text-[#0f5993] hover:underline">← Back to Sites</button><div className="mt-6 overflow-hidden rounded-lg border border-[#d9e2e9] bg-white shadow-sm"><div className="border-b border-[#d9e2e9] px-5 pt-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#6f8493]">Site</p><h1 id="site-detail-title" className="mt-2 font-serif text-4xl tracking-tight">{selectedSite.name}</h1><div role="tablist" aria-label="Site details" className="mt-6 flex gap-6 overflow-x-auto">{tabs.map((tab) => <button key={tab} type="button" role="tab" aria-selected={detailTab === tab} onClick={() => setDetailTab(tab)} className={`border-b-2 px-1 pb-3 text-sm font-semibold transition ${detailTab === tab ? 'border-[#0f5993] text-[#0f5993]' : 'border-transparent text-[#6f8493] hover:border-[#b8cbd8] hover:text-[#29404f]'}`}>{tab}</button>)}</div></div><div className="min-h-48 p-5"><h2 className="text-lg font-semibold text-[#29404f]">{detailTab}</h2><p className="mt-2 text-sm leading-6 text-[#6f8493]">{detailTab === 'Details' ? 'Site details will appear here.' : detailTab === 'Contacts' ? 'Contacts for this site will appear here.' : 'Billing address information will appear here.'}</p></div></div></section>
  }

  return <section aria-labelledby="sites-title">
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-[#6f8493]">Workspace</p><h1 id="sites-title" className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Sites</h1><p className="mt-2 text-sm leading-6 text-[#6f8493]">Browse and open your managed sites.</p></div><button type="button" onClick={() => setShowCreate(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f5993] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b4775]"><Plus size={17} />New site</button></div>
    <div className="mt-8 overflow-hidden rounded-lg border border-[#d9e2e9] bg-white shadow-sm"><div className="flex flex-col gap-3 border-b border-[#d9e2e9] bg-[#f8fafc] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-2 text-sm text-[#536471]"><span>Show</span><select aria-label="Rows per page" value={pageSize} disabled className="rounded border border-[#cbd5df] bg-white px-2 py-1 text-sm"><option>10</option></select><span>entries</span></div><label className="relative block w-full sm:w-64"><span className="sr-only">Search sites</span><Search size={15} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7c8d99]" /><input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search:" className="w-full rounded border border-[#cbd5df] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0f5993] focus:ring-1 focus:ring-[#0f5993]" /></label></div><div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead><tr className="border-b border-[#cbd5df] bg-white"><th scope="col" className="px-4 py-3 font-semibold text-[#344054]">Site name</th></tr></thead><tbody>{visibleSites.length ? visibleSites.map((site, index) => <tr key={site.id} className={`cursor-pointer border-b border-[#e7edf1] transition hover:bg-[#e7f0f7] ${index % 2 ? 'bg-[#fbfcfd]' : 'bg-white'}`}><td className="p-0"><button type="button" onClick={() => setSelectedSite(site)} className="block w-full px-4 py-3 text-left font-medium text-[#29404f] hover:text-[#0f5993]">{site.name}</button></td></tr>) : <tr><td className="px-4 py-10 text-center text-[#6f8493]">No sites match your search.</td></tr>}</tbody></table></div><div className="flex flex-col gap-3 px-4 py-3 text-sm text-[#6f8493] sm:flex-row sm:items-center sm:justify-between"><span>Showing {filteredSites.length ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, filteredSites.length)} of {filteredSites.length} entries</span><div className="flex items-center gap-1"><button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1} className="inline-flex items-center gap-1 rounded border border-[#cbd5df] px-2.5 py-1.5 hover:bg-[#f1f5f8] disabled:cursor-not-allowed disabled:opacity-50"><ChevronLeft size={14} />Previous</button><span className="rounded bg-[#0f5993] px-3 py-1.5 font-semibold text-white">{currentPage}</span><button type="button" onClick={() => setPage((value) => Math.min(pageCount, value + 1))} disabled={currentPage === pageCount} className="inline-flex items-center gap-1 rounded border border-[#cbd5df] px-2.5 py-1.5 hover:bg-[#f1f5f8] disabled:cursor-not-allowed disabled:opacity-50">Next<ChevronRight size={14} /></button></div></div></div>
    {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="new-site-title"><div className="w-full max-w-md rounded-2xl border border-[#dfe5df] bg-white p-6 shadow-[0_20px_60px_rgba(15,89,147,0.18)]"><div className="flex items-center justify-between"><h2 id="new-site-title" className="font-serif text-2xl">New site</h2><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg p-2 text-[#6f8493] hover:bg-[#e7f0f7]" aria-label="Close new site dialog"><X size={18} /></button></div><form onSubmit={handleCreate} className="mt-6 space-y-5"><label className="block text-sm font-medium text-[#344054]">Site name<input required maxLength={160} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-lg border border-[#d9dee7] px-4 py-3 outline-none focus:border-[#0f5993]" placeholder="Enter site name" /></label>{error && <p role="alert" className="text-sm text-[#b42318]">{error}</p>}<div className="flex justify-end gap-3"><button type="button" onClick={() => setShowCreate(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#6f8493] hover:bg-[#e7f0f7]">Cancel</button><button disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Create site'}</button></div></form></div></div>}
  </section>
}
