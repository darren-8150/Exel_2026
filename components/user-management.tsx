'use client'

import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2, Users, X } from 'lucide-react'
import { createManagedUser, deleteManagedUser, listManagedUsers, updateManagedUser, type ManagedUser } from '@/app/actions/admin-users'
import { roles, type Role } from '@/lib/db/schema'

export default function UserManagement({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [editing, setEditing] = useState<ManagedUser | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'standard_user' as Role })

  async function refresh() {
    setLoading(true)
    try { setUsers(await listManagedUsers()); setError('') } catch { setError('Unable to load users.') } finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [])

  function resetForm() { setForm({ name: '', email: '', password: '', role: 'standard_user' }); setEditing(null); setShowCreate(false) }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setMessage(''); setError('')
    try {
      if (editing) await updateManagedUser({ id: editing.id, name: form.name, role: form.role })
      else await createManagedUser(form)
      resetForm(); setMessage(editing ? 'User updated.' : 'User created.'); await refresh()
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to save user.') }
  }

  async function remove(user: ManagedUser) {
    if (user.id === currentUserId || !window.confirm(`Delete ${user.name}?`)) return
    setMessage(''); setError('')
    try { await deleteManagedUser(user.id); setUsers((current) => current.filter((item) => item.id !== user.id)); setMessage('User deleted.') } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to delete user.') }
  }

  return <section className="mt-8 rounded-2xl border border-[#dfe5df] bg-white p-5 md:p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-[#e4eee8] text-[#225b4a]"><Users size={19} /></div><div><h2 className="font-serif text-xl">User management</h2><p className="mt-1 text-xs text-[#89958e]">Add, edit, remove users, and assign access roles.</p></div></div><button onClick={() => { resetForm(); setShowCreate(true) }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#225b4a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#174838]"><Plus size={16} /> Add user</button></div>
    {message && <p className="mt-4 rounded-xl bg-[#e4eee8] px-4 py-3 text-sm text-[#39725d]">{message}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-[#f8e9e7] px-4 py-3 text-sm text-[#9d4e45]">{error}</p>}
    {loading ? <p className="mt-6 text-sm text-[#89958e]">Loading users…</p> : <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[680px] text-left"><thead><tr className="border-b border-[#edf0ed] text-xs uppercase tracking-[0.12em] text-[#89958e]"><th className="pb-3 font-semibold">User</th><th className="pb-3 font-semibold">Role</th><th className="pb-3 font-semibold">Added</th><th className="pb-3 text-right font-semibold">Actions</th></tr></thead><tbody className="divide-y divide-[#edf0ed]">{users.map((user) => <tr key={user.id}><td className="py-4"><p className="text-sm font-semibold">{user.name}</p><p className="mt-1 text-xs text-[#89958e]">{user.email}</p></td><td className="py-4"><span className="rounded-full bg-[#eef3ef] px-2.5 py-1 text-xs font-semibold text-[#39725d]">{roles.find((role) => role.value === user.role)?.label}</span></td><td className="py-4 text-sm text-[#77837c]">{new Date(user.createdAt).toLocaleDateString()}</td><td className="py-4 text-right"><div className="inline-flex items-center gap-1"><button aria-label={`Edit ${user.name}`} onClick={() => { setEditing(user); setForm({ name: user.name, email: user.email, password: '', role: user.role }); setShowCreate(true) }} className="rounded-lg p-2 text-[#67736c] hover:bg-[#f0f3ef]"><Pencil size={16} /></button><button aria-label={`Delete ${user.name}`} disabled={user.id === currentUserId} onClick={() => remove(user)} className="rounded-lg p-2 text-[#9d4e45] hover:bg-[#f8e9e7] disabled:cursor-not-allowed disabled:opacity-30"><Trash2 size={16} /></button></div></td></tr>)}</tbody></table></div>}
    {showCreate && <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102a43]/35 p-4" role="dialog" aria-modal="true" aria-labelledby="user-form-title"><div className="w-full max-w-2xl rounded-2xl border border-[#dfe5df] bg-white p-5 shadow-[0_20px_60px_rgba(15,89,147,0.18)] md:p-6"><div className="mb-4 flex items-center justify-between"><h3 id="user-form-title" className="font-serif text-lg">{editing ? 'Edit user' : 'Add a user'}</h3><button onClick={resetForm} aria-label="Close user form" className="rounded-lg p-2 text-[#89958e] hover:bg-[#f0f3ef]"><X size={17} /></button></div><form onSubmit={submit} className="grid gap-4 md:grid-cols-2"><label className="text-sm font-medium text-[#315746]">Name<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfe5df] px-3 py-2.5 font-normal outline-none focus:border-[#39725d]" /></label><label className="text-sm font-medium text-[#315746]">Email<input required disabled={Boolean(editing)} type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfe5df] px-3 py-2.5 font-normal outline-none disabled:bg-[#f5f7f5] focus:border-[#39725d]" /></label>{!editing && <label className="text-sm font-medium text-[#315746]">Temporary password<input required minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="mt-2 w-full rounded-xl border border-[#dfe5df] px-3 py-2.5 font-normal outline-none focus:border-[#39725d]" /></label>}<label className="text-sm font-medium text-[#315746]">Role<select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })} className="mt-2 w-full rounded-xl border border-[#dfe5df] bg-white px-3 py-2.5 font-normal outline-none focus:border-[#39725d]">{roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select></label><div className="flex gap-2 md:col-span-2"><button type="submit" className="rounded-xl bg-[#225b4a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#174838]">{editing ? 'Save changes' : 'Create user'}</button><button type="button" onClick={resetForm} className="rounded-xl border border-[#dfe5df] px-4 py-2.5 text-sm font-semibold text-[#67736c]">Cancel</button></div></form></div></div>}
  </section>
}
