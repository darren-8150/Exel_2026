'use client'

import { getSuppliers } from '@/app/actions/suppliers'
import { Search } from 'lucide-react'
import { useState, useTransition } from 'react'

type SupplierResult = Awaited<ReturnType<typeof getSuppliers>>
const SUPPLIERS_PAGE_SIZE = 50

export default function SuppliersChecks({ initialData }: { initialData: SupplierResult }) {
  const [data, setData] = useState(initialData)
  const [query, setQuery] = useState('')
  const [isPending, startTransition] = useTransition()
  const totalPages = Math.max(1, Math.ceil(data.total / SUPPLIERS_PAGE_SIZE))

  function loadSuppliers(page: number, nextQuery = query) {
    startTransition(() => {
      getSuppliers(page, nextQuery).then(setData)
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    loadSuppliers(1, query)
  }

  return <section className="rounded-2xl border border-[#dfe5df] bg-white p-6 shadow-[0_12px_30px_rgba(15,89,147,0.06)]"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#6f8493]">Admin Area</p><h1 className="mt-2 font-serif text-4xl tracking-tight text-[#1b2621]">Suppliers Checks</h1></div><form onSubmit={handleSubmit} className="flex w-full gap-2 md:max-w-md"><label className="sr-only" htmlFor="supplier-search">Search suppliers</label><div className="relative flex-1"><Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6f8493]" /><input id="supplier-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search supplier name" className="w-full rounded-lg border border-[#d9e2e9] py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0f5993]" /></div><button type="submit" disabled={isPending} className="rounded-lg bg-[#0f5993] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">Search</button></form></div><div className="mt-6 overflow-hidden rounded-xl border border-[#d9e2e9]"><table className="w-full text-left text-sm"><thead className="bg-[#f8fafc]"><tr className="border-b border-[#d9e2e9]"><th className="px-4 py-3 font-semibold text-[#29404f]">Supplier Name</th></tr></thead><tbody>{data.rows.length ? data.rows.map((supplier) => <tr key={supplier.id} className="border-t border-[#e7edf1] hover:bg-[#e7f0f7]"><td className="px-4 py-3 text-[#29404f]">{supplier.name}</td></tr>) : <tr><td className="px-4 py-8 text-center text-[#6f8493]">{query ? 'No suppliers match your search.' : 'No suppliers available.'}</td></tr>}</tbody></table></div><div className="mt-4 flex items-center justify-between text-sm text-[#6f8493]"><span>{data.total} supplier{data.total === 1 ? '' : 's'}</span><div className="flex items-center gap-2"><button type="button" onClick={() => loadSuppliers(data.page - 1)} disabled={isPending || data.page <= 1} className="rounded-lg border border-[#d9e2e9] px-3 py-2 disabled:opacity-40">Previous</button><span>Page {data.page} of {totalPages}</span><button type="button" onClick={() => loadSuppliers(data.page + 1)} disabled={isPending || data.page >= totalPages} className="rounded-lg border border-[#d9e2e9] px-3 py-2 disabled:opacity-40">Next</button></div></div></section>
}
