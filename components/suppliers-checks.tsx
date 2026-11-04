'use client'

import { createSupplier, deleteSupplier, getSuppliers } from '@/app/actions/suppliers'
import { ArrowLeft, Plus, Search, X } from 'lucide-react'
import { useState, useTransition } from 'react'

type SupplierResult = Awaited<ReturnType<typeof getSuppliers>>
const SUPPLIERS_PAGE_SIZE = 50

export default function SuppliersChecks({ initialData }: { initialData: SupplierResult }) {
  const [data, setData] = useState(initialData)
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const [showAddModal, setShowAddModal] = useState(false)
  const [supplierName, setSupplierName] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierResult['rows'][number] | null>(null)
  const [showCertificationModal, setShowCertificationModal] = useState(false)
  const [certificationName, setCertificationName] = useState('')
  const [certificationDate, setCertificationDate] = useState('')
  const [certificationFile, setCertificationFile] = useState<File | null>(null)
  const [certifications, setCertifications] = useState<Array<{ name: string; date: string; fileName: string }>>([])
  const totalPages = Math.max(1, Math.ceil(data.total / SUPPLIERS_PAGE_SIZE))

  function handleAddCertification(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCertifications((current) => [...current, { name: certificationName.trim(), date: certificationDate, fileName: certificationFile?.name || 'No file attached' }])
    setCertificationName('')
    setCertificationDate('')
    setCertificationFile(null)
    setShowCertificationModal(false)
  }

  function handleDeleteSupplier() {
    if (!selectedSupplier || !window.confirm('Are you sure you want to delete this supplier?')) return
    startTransition(() => {
      deleteSupplier(selectedSupplier.id).then(() => {
        setSelectedSupplier(null)
        loadSuppliers(1, query)
      })
    })
  }

  function loadSuppliers(page: number, nextQuery = query) {
    startTransition(() => {
      getSuppliers(page, nextQuery).then(setData)
    })
  }

  function handleAddSupplier(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    startTransition(() => {
      createSupplier(supplierName).then(() => {
        setSupplierName('')
        setShowAddModal(false)
        loadSuppliers(1, query)
      })
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loadSuppliers(1, query)
  }

  return <section className="rounded-2xl border border-[#dfe5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,89,147,0.06)]">{selectedSupplier ? <div><div className="flex items-center justify-between gap-3"><button type="button" onClick={() => setSelectedSupplier(null)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f5993]"><ArrowLeft size={17} />Back to Suppliers Checks</button><div className="flex items-center gap-2"><button type="button" onClick={() => setShowCertificationModal(true)} className="inline-flex items-center gap-2 rounded-lg bg-[#0f5993] px-4 py-2 text-sm font-semibold text-white"><Plus size={16} />Add certification</button><button type="button" onClick={handleDeleteSupplier} disabled={isPending} className="rounded-lg border border-[#b42318] px-4 py-2 text-sm font-semibold text-[#b42318] hover:bg-[#fff1f0] disabled:opacity-60">Delete supplier</button></div></div><div className="mt-6"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f8493]">Supplier Details</p><h1 className="mt-2 font-serif text-4xl tracking-tight text-[#1b2621]">{selectedSupplier.name}</h1><dl className="mt-6 grid gap-5 border-t border-[#d9e2e9] pt-5 md:grid-cols-2"><div><dt className="text-sm text-[#6f8493]">Company Name</dt><dd className="mt-1 font-medium text-[#29404f]">{selectedSupplier.name}</dd></div><div><dt className="text-sm text-[#6f8493]">Email Address</dt><dd className="mt-1 font-medium text-[#29404f]">Not Done</dd></div></dl><div className="mt-6 border-t border-[#d9e2e9] pt-5"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f8493]">Certifications</p><div className="mt-3 overflow-hidden rounded-lg border border-[#d9e2e9]"><table className="w-full text-left text-sm"><thead className="bg-white"><tr><th className="px-4 py-3 font-semibold text-[#29404f]">Certification</th></tr></thead><tbody>{certifications.length ? certifications.map((certification) => <tr key={`${certification.name}-${certification.date}-${certification.fileName}`} className="border-t border-[#e7edf1]"><td className="px-4 py-3 text-[#29404f]"><span className="font-medium">{certification.name}</span><span className="ml-3 text-[#6f8493]">{certification.date} · {certification.fileName}</span></td></tr>) : <tr><td className="border-t border-[#e7edf1] px-4 py-4 text-[#6f8493]">No certifications recorded.</td></tr>}</tbody></table></div></div></div></div> : <><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f8493]">Admin Area</p><h1 className="mt-2 font-serif text-4xl tracking-tight text-[#1b2621]">Suppliers Checks</h1></div><button type="button" onClick={() => setShowAddModal(true)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0f5993] px-4 py-2.5 text-sm font-semibold text-white"><Plus size={17} />Add supplier</button><form onSubmit={handleSubmit} className="flex w-full gap-2 md:max-w-md"><label className="sr-only" htmlFor="supplier-search">Search suppliers</label><div className="relative flex-1"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f8493]" /><input id="supplier-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search supplier name" className="w-full rounded-lg border border-[#d9e2e9] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0f5993]" /></div><button type="submit" disabled={isPending} className="rounded-lg bg-[#0f5993] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Search</button></form></div><div className="mt-6 overflow-hidden rounded-xl border border-[#d9e2e9]"><table className="w-full text-left text-sm"><thead className="bg-[#f8fafc]"><tr className="border-b border-[#d9e2e9]"><th className="px-4 py-3 font-semibold text-[#29404f]">Supplier</th></tr></thead><tbody>{data.rows.length ? data.rows.map((supplier) => <tr key={supplier.id} onClick={() => setSelectedSupplier(supplier)} className="cursor-pointer border-t border-[#e7edf1] hover:bg-[#e7f0f7]"><td className="px-4 py-3 text-[#29404f]">{supplier.name}</td></tr>) : <tr><td className="px-4 py-8 text-center text-[#6f8493]">{query ? 'No suppliers match your search.' : 'No suppliers available.'}</td></tr>}</tbody></table></div><div className="mt-4 flex items-center justify-between text-sm text-[#6f8493]"><span>{data.total} supplier{data.total === 1 ? '' : 's'}</span><div className="flex items-center gap-2"><button type="button" onClick={() => loadSuppliers(data.page - 1)} disabled={isPending || data.page <= 1} className="rounded-lg border border-[#d9e2e9] px-3 py-2 disabled:opacity-40">Previous</button><span>Page {data.page} of {totalPages}</span><button type="button" onClick={() => loadSuppliers(data.page + 1)} disabled={isPending || data.page >= totalPages} className="rounded-lg border border-[#d9e2e9] px-3 py-2 disabled:opacity-40">Next</button></div></div>{showCertificationModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="add-certification-title"><form onSubmit={handleAddCertification} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 id="add-certification-title" className="font-serif text-2xl text-[#1b2621]">Add Certification</h2><button type="button" onClick={() => setShowCertificationModal(false)} aria-label="Close add certification dialog"><X size={18} /></button></div><label className="mt-5 grid gap-1 text-sm font-medium text-[#29404f]">Certification Name<input required value={certificationName} onChange={(event) => setCertificationName(event.target.value)} className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></label><label className="mt-4 grid gap-1 text-sm font-medium text-[#29404f]">Date<input required type="date" value={certificationDate} onChange={(event) => setCertificationDate(event.target.value)} className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></label><label className="mt-4 grid gap-1 text-sm font-medium text-[#29404f]">File<input type="file" onChange={(event) => setCertificationFile(event.target.files?.[0] || null)} className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5 text-sm" /></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowCertificationModal(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#6f8493]">Cancel</button><button type="submit" className="rounded-lg bg-[#0f5993] px-4 py-2 text-sm font-semibold text-white">Add certification</button></div></form></div>}{showAddModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="add-supplier-title"><form onSubmit={handleAddSupplier} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 id="add-supplier-title" className="font-serif text-2xl text-[#1b2621]">Add supplier</h2><button type="button" onClick={() => setShowAddModal(false)} aria-label="Close add supplier dialog"><X size={18} /></button></div><label className="mt-5 grid gap-1 text-sm font-medium text-[#29404f]">Company Name<input autoFocus required value={supplierName} onChange={(event) => setSupplierName(event.target.value)} className="w-full rounded-lg border border-[#d9e2e9] px-3 py-2.5" /></label><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowAddModal(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-[#6f8493]">Cancel</button><button type="submit" disabled={isPending} className="rounded-lg bg-[#0f5993] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{isPending ? 'Saving…' : 'Add supplier'}</button></div></form></div>}
</> }</section>
}
