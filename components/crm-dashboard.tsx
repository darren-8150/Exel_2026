'use client'

import Image from 'next/image'

export default function CrmDashboard({ currentUserName }: { currentUserId: string; currentUserName: string; currentUserEmail: string; currentUserRole?: string | null }) {
  const firstName = currentUserName.trim().split(/\s+/)[0] || 'there'

  return (
    <main className="min-h-screen bg-[#f7f8f6] px-6 py-10 text-[#1b2621]">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center text-center">
        <Image
          src="/exel-contracts-ltd.svg"
          alt="Exel Contracts Ltd"
          width={220}
          height={80}
          className="mb-14 h-auto w-52"
          priority
        />
        <p className="text-sm font-medium text-[#6f8493]">Wednesday, October 8, 2026</p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">
          Good morning, {firstName}
        </h1>
      </div>
    </main>
  )
}
