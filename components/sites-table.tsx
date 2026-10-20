'use client'

import { createContact, getContactsForSite } from '@/app/actions/contacts'
import { createSite } from '@/app/actions/sites'
import { Plus, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'

type Site = { id: string; name: string; accountName?: string | null; customerSuffix?: string | null; webAddress?: string | null; loggedAt?: Date | string | null; loggedBy?: string | null }
type Contact = Awaited<ReturnType<typeof getContactsForSite>>[number]

export default function SitesTable({ initialSites }: { initialSites: Site[] }) {
  const [sites, setSites] = useState(initialSites)
  const [query, setQuery] = useState('')
  const [selectedSite, setSelectedSite] = useState<Site | null>(null)
  const [tab, setTab] = useState<'Details' | 'Contacts' | 'Billing Address'>('Details')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactsLoading, setContactsLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactFields, setContactFields] = useState({ name: '', company: '', email: '' })
  const [showSiteForm, setShowSiteForm] = useState(false)
  const [siteName, setSiteName] = useState('')
  const [saving, setSaving] = useState(false)

  const filteredSites = useMemo(() => sites.filter((site) => site.name.toLowerCase().includes(query.trim().toLowerCase())), [sites, query])

  async function openContacts() {
    if (!selectedSite) return
    setTab('Contacts')
    setContactsLoading(true)
    try { setContacts(await getContactsForSite(selectedSite.id)) } finally { setContactsLoading(false) }
  }

  async function handleCreateContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSite) return
    setSaving(true)
    try { const contact = await createContact(selectedSite.id, contactFields.name, contactFields.company, contactFields.email); setContacts((current) => [...current, contact]); setContactFields({ name: '', company: '', email: '' }); setShowContactForm(false) } finally { setSaving(false) }
  }

  async function handleCreateSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true)
    try { const site = await createSite(siteName); setSites((current) => [site, ...current]); setSiteName(''); setShowSiteForm(false) } finally { setSaving(false) }
  }

  if (selectedSite) return <section aria-labelledby="site-detail-title">
    <div className="flex items-center justify-between"><button type="button" onClick={() => { setSelectedSite(null); setTab('Details') }} className="text-sm font-semibold text-[#0f5993] hover:underline">← Back to Sites</button>{tab === 'Contacts' && <button type="button" onClick={() => setShowContactForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#0f5993] px-3 py-2 text-sm font-semibold text-white hover:bg-[#0b4775]"><Plus size={16} />New contact</button>}</div>
    <div className="mt-6 overflow-hidden rounded-lg border border-[#d9e2e9] bg-white shadow-sm"><div className="border-b border-[#d9e2e9] px-5 pt-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#6f8493]">Site</p><h1 id="site-detail-title" className="mt-2 font-serif text-4xl tracking-tight">{selectedSite.name}</h1><div role="tablist" className="mt-6 flex gap-6">{(['Details', 'Contacts', 'Billing Address'] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => item === 'Contacts' ? openContacts() : setTab(item)} className={`border-b-2 px-1 pb-3 text-sm font-semibold ${tab === item ? 'border-[#0f5993] text-[#0f5993]' : 'border-transparent text-[#6f8493]'}`}>{item}</button>)}</div></div>
      <div className="min-h-48 p-5">{tab === 'Details' ? <dl className="grid gap-5 sm:grid-cols-2"><div><dt className="label">Account name</dt><dd>{selectedSite.accountName || selectedSite.name}</dd></div><div><dt className="label">Customer suffix</dt><dd>{selectedSite.customerSuffix || '—'}</dd></div><div><dt className="label">Web address</dt><dd>{selectedSite.webAddress || '—'}</dd></div><div><dt className="label">When logged</dt><dd>{selectedSite.loggedAt ? new Date(selectedSite.loggedAt).toLocaleString() : '—'}</dd></div><div><dt className="label">Logged by</dt><dd>{selectedSite.loggedBy || '—'}</dd></div></dl> : tab === 'Contacts' ? <div><h2 className="text-lg font-semibold text-[#29404f]">Contacts</h2>{contactsLoading ? <p className="mt-5 text-sm text-[#6f8493]">Loading contacts…</p> : contacts.length ? <div className="mt-5 overflow-x-auto rounded-lg border border-[#d9e2e9]"><table className="w-full text-left text-sm"><thead className="bg-[#f8fafc]"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{contacts.map((contact) => <tr key={contact.id} className="border-t border-[#e7edf1] hover:bg-[#e7f0f7]"><td className="px-4 py-3 font-medium">{contact.name}</td><td className="px-4 py-3">{contact.company}</td><td className="px-4 py-3">{contact.email}</td><td className="px-4 py-3">{contact.status}</td></tr>)}</tbody></table></div> : <p className="mt-5 text-sm text-[#6f8493]">No contacts recorded for this site.</p>}</div> : <div><h2 className="text-lg font-semibold text-[#29404f]">Billing Address</h2><p className="mt-2 text-sm text-[#6f8493]">Billing address information will appear here.</p></div>}</div>
    </div>
    {showContactForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4"><form onSubmit={handleCreateContact} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex justify-between"><h2 className="font-serif text-2xl">New contact</h2><button type="button" onClick={() => setShowContactForm(false)} aria-label="Close"><X size={18} /></button></div><div className="mt-5 space-y-3"><input required placeholder="Full name" value={contactFields.name} onChange={(e) => setContactFields({ ...contactFields, name: e.target.value })} className="w-full rounded-lg border px-3 py-2.5" /><input required placeholder="Company" value={contactFields.company} onChange={(e) => setContactFields({ ...contactFields, company: e.target.value })} className="w-full rounded-lg border px-3 py-2.5" /><input required type="email" placeholder="Email address" value={contactFields.email} onChange={(e) => setContactFields({ ...contactFields, email: e.target.value })} className="w-full rounded-lg border px-3 py-2.5" /></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowContactForm(false)}>Cancel</button><button disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-white">{saving ? 'Saving…' : 'Save contact'}</button></div></form></div>}
  </section>

  return <section aria-labelledby="sites-title"><div className="flex items-end justify-between"><div><p className="text-sm text-[#6f8493]">Workspace</p><h1 id="sites-title" className="mt-2 font-serif text-4xl">Sites</h1></div><button type="button" onClick={() => setShowSiteForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#0f5993] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} />New site</button></div><div className="mt-8 overflow-hidden rounded-lg border border-[#d9e2e9] bg-white"><div className="border-b bg-[#f8fafc] px-4 py-3"><label className="text-sm">Search: <input value={query} onChange={(e) => setQuery(e.target.value)} className="ml-2 rounded border px-3 py-2" /></label></div><table className="w-full text-left text-sm"><thead><tr><th className="px-4 py-3">Site name</th></tr></thead><tbody>{filteredSites.map((site) => <tr key={site.id} className="cursor-pointer border-t hover:bg-[#e7f0f7]"><td><button type="button" onClick={() => setSelectedSite(site)} className="w-full px-4 py-3 text-left font-medium">{site.name}</button></td></tr>)}</tbody></table></div>{showSiteForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"><form onSubmit={handleCreateSite} className="w-full max-w-md rounded-2xl bg-white p-6"><h2 className="font-serif text-2xl">New site</h2><input required value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Site name" className="mt-5 w-full rounded-lg border px-3 py-2.5" /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setShowSiteForm(false)}>Cancel</button><button disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-white">Save</button></div></form></div>}</section>
}
