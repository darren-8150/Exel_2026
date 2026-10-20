'use client'

import { createContact, getContactsForSite } from '@/app/actions/contacts'
import { createBillingAddress, getBillingAddressesForSite } from '@/app/actions/billing-addresses'
import { createSite, updateSite } from '@/app/actions/sites'
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
  const [showEditForm, setShowEditForm] = useState(false)
  const [editFields, setEditFields] = useState({ name: '', accountName: '', customerSuffix: '', webAddress: '' })
  const [billingAddresses, setBillingAddresses] = useState<Awaited<ReturnType<typeof getBillingAddressesForSite>>>([])
  const [showBillingForm, setShowBillingForm] = useState(false)
  const [billingFields, setBillingFields] = useState({ address: '', city: '', postcode: '', country: '' })

  const filteredSites = useMemo(() => sites.filter((site) => site.name.toLowerCase().includes(query.trim().toLowerCase())), [sites, query])

  async function openBillingAddresses() {
    if (!selectedSite) return
    setTab('Billing Address')
    setBillingAddresses(await getBillingAddressesForSite(selectedSite.id))
  }

  async function handleCreateBillingAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSite) return
    setSaving(true)
    try {
      const billingAddress = await createBillingAddress(selectedSite.id, billingFields)
      setBillingAddresses((current) => [billingAddress, ...current])
      setBillingFields({ address: '', city: '', postcode: '', country: '' })
      setShowBillingForm(false)
    } finally { setSaving(false) }
  }

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

  function openEditForm() {
    if (!selectedSite) return
    setEditFields({ name: selectedSite.name, accountName: selectedSite.accountName || selectedSite.name, customerSuffix: selectedSite.customerSuffix || '', webAddress: selectedSite.webAddress || '' })
    setShowEditForm(true)
  }

  async function handleEditSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSite) return
    setSaving(true)
    try {
      const updated = await updateSite(selectedSite.id, editFields)
      setSelectedSite(updated)
      setSites((current) => current.map((site) => site.id === updated.id ? updated : site))
      setShowEditForm(false)
    } finally { setSaving(false) }
  }

  async function handleCreateSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true)
    try { const site = await createSite(siteName); setSites((current) => [site, ...current]); setSiteName(''); setShowSiteForm(false); setSelectedSite(site); setTab('Details'); setEditFields({ name: site.name, accountName: site.accountName || site.name, customerSuffix: site.customerSuffix || '', webAddress: site.webAddress || '' }); setShowEditForm(true) } finally { setSaving(false) }
  }

  if (selectedSite) return <section aria-labelledby="site-detail-title">
    <div><button type="button" onClick={() => { setSelectedSite(null); setTab('Details') }} className="inline-flex items-center gap-2 rounded-lg bg-[#0f5993] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b4775]">← Back</button></div>
    <div className="mt-6 overflow-hidden rounded-lg border border-[#cfd6dc] bg-[#f8fafc] shadow-sm"><div className="border-b border-[#cfd6dc] bg-white px-4 pt-4"><div className="flex items-center justify-between gap-4"><h1 id="site-detail-title" className="font-serif text-3xl tracking-tight text-[#29404f]">{selectedSite.name}</h1>{tab === 'Details' ? <button type="button" onClick={openEditForm} className="inline-flex shrink-0 items-center rounded-lg bg-[#0f5993] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b4775]">Edit</button> : tab === 'Contacts' ? <button type="button" onClick={() => setShowContactForm(true)} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#0f5993] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b4775]"><Plus size={16} />New contact</button> : <button type="button" onClick={() => setShowBillingForm(true)} className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#0f5993] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b4775]"><Plus size={16} />New billing address</button>}</div><div role="tablist" aria-label="Site sections" className="mt-5 flex flex-wrap gap-1">{(['Details', 'Contacts', 'Billing Address'] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => item === 'Contacts' ? openContacts() : item === 'Billing Address' ? openBillingAddresses() : setTab(item)} className={`rounded-t-md border border-b-0 px-4 py-3 text-sm font-medium transition ${tab === item ? 'relative z-10 -mb-px border-[#cfd6dc] bg-white text-[#0f5993]' : 'border-transparent bg-[#f4f6f8] text-[#0f5993] hover:bg-white'}`}>{item}</button>)}</div></div>
      <div className="min-h-48 border-t border-[#cfd6dc] bg-white p-5">{tab === 'Details' ? <div><dl className="grid gap-5 sm:grid-cols-2"><div><dt className="label">Account name</dt><dd>{selectedSite.accountName || selectedSite.name}</dd></div><div><dt className="label">Customer suffix</dt><dd>{selectedSite.customerSuffix || '—'}</dd></div><div><dt className="label">Web address</dt><dd>{selectedSite.webAddress || '—'}</dd></div><div><dt className="label">When logged</dt><dd>{selectedSite.loggedAt ? new Date(selectedSite.loggedAt).toLocaleString() : '—'}</dd></div><div><dt className="label">Logged by</dt><dd>{selectedSite.loggedBy || '—'}</dd></div></dl></div> : tab === 'Contacts' ? <div><h2 className="text-lg font-semibold text-[#29404f]">Contacts</h2>{contactsLoading ? <p className="mt-5 text-sm text-[#6f8493]">Loading contacts…</p> : contacts.length ? <div className="mt-5 overflow-x-auto rounded-lg border border-[#d9e2e9]"><table className="w-full text-left text-sm"><thead className="bg-[#f8fafc]"><tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Email</th><th className="px-4 py-3">Status</th></tr></thead><tbody>{contacts.map((contact) => <tr key={contact.id} className="border-t border-[#e7edf1] hover:bg-[#e7f0f7]"><td className="px-4 py-3 font-medium">{contact.name}</td><td className="px-4 py-3">{contact.company}</td><td className="px-4 py-3">{contact.email}</td><td className="px-4 py-3">{contact.status}</td></tr>)}</tbody></table></div> : <p className="mt-5 text-sm text-[#6f8493]">No contacts recorded for this site.</p>}</div> : <div><h2 className="text-lg font-semibold text-[#29404f]">Billing Address</h2><div className="mt-5 overflow-x-auto rounded-lg border border-[#d9e2e9]"><table className="w-full text-left text-sm"><thead className="bg-[#f8fafc]"><tr><th className="px-4 py-3">Address</th><th className="px-4 py-3">Town / City</th><th className="px-4 py-3">Postcode</th><th className="px-4 py-3">Country</th></tr></thead><tbody>{billingAddresses.length ? billingAddresses.map((item) => <tr key={item.id} className="border-t border-[#e7edf1] hover:bg-[#e7f0f7]"><td className="px-4 py-3">{item.address}</td><td className="px-4 py-3">{item.city}</td><td className="px-4 py-3">{item.postcode}</td><td className="px-4 py-3">{item.country}</td></tr>) : <tr><td colSpan={4} className="border-t border-[#e7edf1] px-4 py-6 text-[#6f8493]">No billing address recorded for this site.</td></tr>}</tbody></table></div></div>}</div>
    </div>
    {showBillingForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="new-billing-title"><form onSubmit={handleCreateBillingAddress} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 id="new-billing-title" className="font-serif text-2xl">New billing address</h2><button type="button" onClick={() => setShowBillingForm(false)} aria-label="Close billing address dialog" className="rounded-lg p-2 text-[#6f8493] hover:bg-[#e7f0f7]"><X size={18} /></button></div><div className="mt-5 grid gap-4"><input required value={billingFields.address} onChange={(e) => setBillingFields({ ...billingFields, address: e.target.value })} placeholder="Address" className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /><input required value={billingFields.city} onChange={(e) => setBillingFields({ ...billingFields, city: e.target.value })} placeholder="Town / City" className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /><input required value={billingFields.postcode} onChange={(e) => setBillingFields({ ...billingFields, postcode: e.target.value })} placeholder="Postcode" className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /><input required value={billingFields.country} onChange={(e) => setBillingFields({ ...billingFields, country: e.target.value })} placeholder="Country" className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowBillingForm(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#6f8493]">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-sm font-semibold text-white">{saving ? 'Saving…' : 'Save address'}</button></div></form></div>}
    {showEditForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-site-title"><form onSubmit={handleEditSite} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 id="edit-site-title" className="font-serif text-2xl">Edit site</h2><button type="button" onClick={() => setShowEditForm(false)} aria-label="Close edit site dialog" className="rounded-lg p-2 text-[#6f8493] hover:bg-[#e7f0f7]"><X size={18} /></button></div><div className="mt-5 grid gap-4"><label className="text-sm font-medium text-[#29404f]">Site name<input required value={editFields.name} onChange={(e) => setEditFields({ ...editFields, name: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></label><label className="text-sm font-medium text-[#29404f]">Account name<input value={editFields.accountName} onChange={(e) => setEditFields({ ...editFields, accountName: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></label><label className="text-sm font-medium text-[#29404f]">Customer suffix<input value={editFields.customerSuffix} onChange={(e) => setEditFields({ ...editFields, customerSuffix: e.target.value })} className="mt-1 w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></label><label className="text-sm font-medium text-[#29404f]">Web address<input type="url" value={editFields.webAddress} onChange={(e) => setEditFields({ ...editFields, webAddress: e.target.value })} placeholder="https://example.com" className="mt-1 w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></label></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowEditForm(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#6f8493]">Cancel</button><button type="submit" disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-sm font-semibold text-white">{saving ? 'Saving…' : 'Save changes'}</button></div></form></div>}
    {showContactForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4"><form onSubmit={handleCreateContact} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex justify-between"><h2 className="font-serif text-2xl">New contact</h2><button type="button" onClick={() => setShowContactForm(false)} aria-label="Close"><X size={18} /></button></div><div className="mt-5 space-y-3"><input required placeholder="Full name" value={contactFields.name} onChange={(e) => setContactFields({ ...contactFields, name: e.target.value })} className="w-full rounded-lg border px-3 py-2.5" /><input required placeholder="Company" value={contactFields.company} onChange={(e) => setContactFields({ ...contactFields, company: e.target.value })} className="w-full rounded-lg border px-3 py-2.5" /><input required type="email" placeholder="Email address" value={contactFields.email} onChange={(e) => setContactFields({ ...contactFields, email: e.target.value })} className="w-full rounded-lg border px-3 py-2.5" /></div><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowContactForm(false)}>Cancel</button><button disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-white">{saving ? 'Saving…' : 'Save contact'}</button></div></form></div>}
  </section>

  return <section aria-labelledby="sites-title"><div className="flex items-end justify-between"><div><h1 id="sites-title" className="font-serif text-4xl">Sites</h1></div><button type="button" onClick={() => setShowSiteForm(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#0f5993] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} />New site</button></div><div className="mt-8 overflow-hidden rounded-lg border border-[#d9e2e9] bg-white"><div className="border-b bg-[#f8fafc] px-4 py-3"><label className="text-sm">Search: <input value={query} onChange={(e) => setQuery(e.target.value)} className="ml-2 rounded border px-3 py-2" /></label></div><table className="w-full text-left text-sm"><thead><tr><th className="px-4 py-3">Site name</th></tr></thead><tbody>{filteredSites.map((site) => <tr key={site.id} className="cursor-pointer border-t hover:bg-[#e7f0f7]"><td><button type="button" onClick={() => setSelectedSite(site)} className="w-full px-4 py-3 text-left font-medium">{site.name}</button></td></tr>)}</tbody></table></div>{showSiteForm && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"><form onSubmit={handleCreateSite} className="w-full max-w-md rounded-2xl bg-white p-6"><h2 className="font-serif text-2xl">New site</h2><input required value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Site name" className="mt-5 w-full rounded-lg border px-3 py-2.5" /><div className="mt-5 flex justify-end gap-3"><button type="button" onClick={() => setShowSiteForm(false)}>Cancel</button><button disabled={saving} className="rounded-lg bg-[#0f5993] px-4 py-2 text-white">Save</button></div></form></div>}</section>
}
