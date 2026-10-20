'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown, CircleHelp, LayoutDashboard, Menu, Search, Settings, Users, X } from 'lucide-react'
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
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const userInitials = currentUserName
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

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
          <div className="ml-auto flex items-center gap-3"><div className="relative hidden sm:block"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#89958e]" size={16} /><input aria-label="Search contacts" className="w-52 rounded-xl border border-[#dfe5df] bg-white py-2.5 pl-9 pr-3 text-sm outline-none placeholder:text-[#9aa59e] focus:border-[#8fb4a3]" placeholder="Search anything" /></div><button className="rounded-xl p-2.5 text-[#67736c] hover:bg-[#eef2ee]" aria-label="Settings"><Settings size={18} /></button><div ref={profileRef} className="relative hidden border-l border-[#dfe5df] pl-3 md:block"><button type="button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="menu" aria-label="Open account menu" className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#eef2ee]"><div className="flex size-8 items-center justify-center rounded-full bg-[#dce2f0] text-[11px] font-semibold text-[#405275]">{userInitials}</div><ChevronDown size={14} className={`text-[#89958e] transition ${profileOpen ? 'rotate-180' : ''}`} /></button>{profileOpen && <div role="menu" className="absolute right-0 top-12 z-30 w-64 rounded-2xl border border-[#dfe5df] bg-white p-2 shadow-[0_14px_35px_rgba(27,38,33,0.12)]"><div className="border-b border-[#eef1ee] px-3 py-3"><p className="truncate text-sm font-semibold text-[#1b2621]">{currentUserName}</p><p className="truncate text-xs text-[#7a8780]">{currentUserRole || 'User'}</p></div><div className="px-1 pt-1"><SignOutButton className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[#67736c] hover:bg-[#f0f3ef] hover:text-[#0f5993]" /></div></div>}</div></div>
        </header>
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
          <p className="text-sm font-medium text-[#6f8493]">Wednesday, October 8, 2026</p>
          <h1 className="mt-2 font-serif text-4xl tracking-tight md:text-5xl">Good morning, {currentUserName.split(' ')[0]}<span className="text-[#c48b4d">.</span></h1>
        </div>
      </main>
    </div>
  )
}
