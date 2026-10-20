'use client'

import { useState } from 'react'
import { CircleHelp, LayoutDashboard, Menu, Settings, Users, X } from 'lucide-react'
import { SignOutButton } from '@/components/auth-form'

const nav = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Contacts', icon: Users },
]

type CrmDashboardProps = {
  currentUserId: string
  currentUserName: string
  currentUserEmail: string
  currentUserRole?: string | null
}

export default function CrmDashboard({ currentUserName, currentUserEmail, currentUserRole }: CrmDashboardProps) {
  const [active, setActive] = useState('Dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const userInitials = currentUserName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-[#1b2621]">
      <aside className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-[#dfe5df] bg-[#fbfcfa] px-5 py-6 transition-transform lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2">
          <img src="/exel-contracts-ltd.svg" alt="Exel Contracts Ltd" className="h-auto w-[150px]" />
          <button className="lg:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <div className="mt-12 flex flex-1 flex-col">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a8780]">Workspace</p>
          <nav className="mt-3 flex flex-col gap-1">
            {nav.map(({ label, icon: Icon }) => (
              <button key={label} onClick={() => { setActive(label); setMobileOpen(false) }} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${active === label ? 'bg-[#e7f0f7] text-[#0f5993]' : 'text-[#67736c] hover:bg-[#f0f3ef]'}`}>
                <Icon size={18} strokeWidth={1.8} />{label}
              </button>
            ))}
          </nav>
          <p className="mt-10 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7a8780]">Manage</p>
          <nav className="mt-3 flex flex-col gap-1">
            <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#67736c] hover:bg-[#f0f3ef]"><Settings size={18} strokeWidth={1.8} />Settings</button>
            <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-[#67736c] hover:bg-[#f0f3ef]"><CircleHelp size={18} strokeWidth={1.8} />Help center</button>
          </nav>
        </div>
        <div className="border-t border-[#dfe5df] pt-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-[#dce2f0] text-xs font-semibold text-[#405275]">{userInitials}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{currentUserName}</p><p className="truncate text-xs text-[#7a8780]">{currentUserEmail}</p></div>
            <SignOutButton />
          </div>
        </div>
      </aside>
      <main className="lg:pl-64">
        <header className="flex h-20 items-center justify-between border-b border-[#dfe5df] bg-[#fbfcfa]/80 px-5 backdrop-blur md:px-10">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden" aria-label="Open navigation"><Menu size={22} /></button>
          <div className="flex items-center gap-2 text-sm text-[#7a8780]"><span>Workspace</span><span aria-hidden="true">/</span><span className="font-medium text-[#1b2621]">Dashboard</span></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
          <p className="text-sm font-medium text-[#6f8493]">Wednesday, October 8, 2026</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Good morning, {currentUserName.split(' ')[0]}<span className="text-[#c48b4d">.</span></h1>
        </div>
      </main>
    </div>
  )
}
