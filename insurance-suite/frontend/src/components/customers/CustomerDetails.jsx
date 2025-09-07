import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'
import { api } from '../../lib/api'

export default function CustomerDetails({ open, onClose, id, role }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!open || !id) return
    setErr('')
    ;(async () => {
      try {
        const row = role === 'admin'
          ? await api.admin.customerById(id)
          : await api.employee.customerById(id)
        setData(row)
      } catch (e) {
        setErr(e?.message || 'Failed to load customer')
      }
    })()
  }, [open, id, role])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[min(900px,95vw)] max-h-[85vh] overflow-auto rounded-2xl border border-border bg-slate-900 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Customer Details</div>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>

        {err && <div className="text-sm text-rose-300 mb-3">{err}</div>}
        {!data && !err && <div className="text-sm opacity-70">Loading…</div>}

        {data && (
          <div className="grid gap-3 md:grid-cols-2 text-sm">
            <Info label="Name" value={data.name} />
            <Info label="Status" value={String(data.status)} />
            <Info label="Email" value={data.email} />
            <Info label="Phone" value={data.phone_no} />
            <Info label="PAN" value={data.pan_no} />
            <Info label="Aadhaar" value={data.aadhaar_no} />
            <Info label="Age" value={data.age} />
            <Info label="Spouse" value={data.spouse_name} />
            <Info label="# Children" value={data.number_of_children} />
            <Info label="Parents" value={Array.isArray(data.parents) ? data.parents.join(', ') : ''} />
            <Info label="Premium #" value={data.premium_number} />
            <div className="md:col-span-2 text-xs opacity-70">
              Agent: {data.agent_name || data.agent_id} {data.agent_email ? `(${data.agent_email})` : ''}
            </div>
          </div>
        )}

        <div className="mt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="opacity-70">{label}</div>
      <div className="tag">{value ?? '—'}</div>
    </div>
  )
}
