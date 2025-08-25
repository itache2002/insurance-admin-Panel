// //   import React, { useEffect, useMemo, useState } from 'react'
// // import Card from '../../components/ui/Card'
// // import Button from '../../components/ui/Button'
// // import DataTable from '../../components/data/DataTable'
// // import { Input } from '../../components/ui/Input'
// // import { api } from '../../lib/api'
// // import { toast } from '../../components/ui/Toast'

// // const isUuid = v => typeof v === 'string' &&
// //   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)

// // const prettyName = (email) =>
// //   (email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—')

// // // ----- lightweight modal for agent profile -----
// // function AgentDetailsModal({ open, id, onClose }) {
// //   const [data, setData] = useState(null)
// //   const [loading, setLoading] = useState(false)

// //   useEffect(() => {
// //     if (!open || !id) return
// //     setLoading(true)
// //     api.admin.agentSummary(id)
// //       .then(setData)
// //       .catch(() => toast.error('Failed to load agent details'))
// //       .finally(() => setLoading(false))
// //   }, [open, id])

// //   if (!open) return null
// //   return (
// //     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
// //       <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
// //         <div className="mb-3 flex items-center justify-between">
// //           <h3 className="text-lg font-semibold">Agent Details</h3>
// //           <Button variant="ghost" onClick={onClose}>Close</Button>
// //         </div>

// //         {loading && <div className="text-sm opacity-70">Loading…</div>}
// //         {!loading && data && (
// //           <div className="space-y-4">
// //             <div className="grid gap-3 md:grid-cols-2">
// //               <div className="tag">ID: <b className="ml-1">{data.agent?.id}</b></div>
// //               <div className="tag">Customers: <b className="ml-1">{data.customer_count}</b></div>
// //               <div className="tag">Name: <b className="ml-1">{data.agent?.name || prettyName(data.agent?.email)}</b></div>
// //               <div className="tag">Email: <b className="ml-1">{data.agent?.email}</b></div>
// //             </div>

// //             <div className="grid gap-3 md:grid-cols-3">
// //               <div className="kpi">
// //                 <div className="text-xs opacity-70">Sales (total)</div>
// //                 <div className="text-xl font-bold">{data.totals?.sales_count ?? 0}</div>
// //               </div>
// //               <div className="kpi">
// //                 <div className="text-xs opacity-70">Premium (total)</div>
// //                 <div className="text-xl font-bold">{data.totals?.total_premium ?? 0}</div>
// //               </div>
// //               <div className="kpi">
// //                 <div className="text-xs opacity-70">Commission (total)</div>
// //                 <div className="text-xl font-bold">{data.totals?.total_commission ?? 0}</div>
// //               </div>
// //             </div>

// //             <div className="grid gap-3 md:grid-cols-2">
// //               <div className="kpi">
// //                 <div className="text-xs opacity-70">Base Salary</div>
// //                 <div className="text-xl font-bold">₹{data.comp?.base_salary ?? 0}/month</div>
// //               </div>
// //               <div className="kpi">
// //                 <div className="text-xs opacity-70">Commission Rate</div>
// //                 <div className="text-xl font-bold">{data.comp?.commission_rate ?? 0}%</div>
// //               </div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   )
// // }

// // export default function AdminAgents() {
// //   const [rows, setRows] = useState([])
// //   const [loading, setLoading] = useState(false)

// //   const [baseEdit, setBaseEdit] = useState({})
// //   const [rateEdit, setRateEdit] = useState({})
// //   const [saving, setSaving] = useState({})

// //   // details modal
// //   const [open, setOpen] = useState(false)
// //   const [selectedId, setSelectedId] = useState(null)

// //   const load = async () => {
// //     setLoading(true)
// //     try {
// //       const data = await api.admin.agents()
// //       setRows(Array.isArray(data) ? data : [])
// //     } finally {
// //       setLoading(false)
// //     }
// //   }
// //   useEffect(() => { load() }, [])

// //   const cols = useMemo(() => ([
// //     {
// //       key: 'id',
// //       label: 'ID',
// //       render: (_v, r) => (r.id || r.agent_id || '—')
// //     },
// //     {
// //       key: 'name',
// //       label: 'Name',
// //       render: (_v, r) => (r.name || r.agent_name || prettyName(r.email))
// //     },
// //     { key: 'email', label: 'Email' },
// //     { key: 'customer_count', label: '# Customers' },
// //     {
// //       key: 'base_salary',
// //       label: 'Base Salary',
// //       render: (_v, r) => {
// //         const id = r.id || r.agent_id
// //         return (
// //           <div className="flex items-center gap-2">
// //             <Input
// //               value={baseEdit[id] ?? ''}
// //               onChange={(e) => setBaseEdit(s => ({ ...s, [id]: e.target.value.replace(/[^\d.]/g, '') }))}
// //               placeholder="e.g. 2000"
// //               className="w-28"
// //             />
// //             <span className="text-xs opacity-70">₹/month</span>
// //           </div>
// //         )
// //       }
// //     },
// //     {
// //       key: 'commission_rate',
// //       label: 'Commission %',
// //       render: (_v, r) => {
// //         const id = r.id || r.agent_id
// //         return (
// //           <div className="flex items-center gap-2">
// //             <Input
// //               value={rateEdit[id] ?? ''}
// //               onChange={(e) => setRateEdit(s => ({ ...s, [id]: e.target.value.replace(/[^\d.]/g, '') }))}
// //               placeholder="e.g. 0.5"
// //               className="w-20"
// //             />
// //             <span className="text-xs opacity-70">%</span>
// //           </div>
// //         )
// //       }
// //     },
// //     {
// //       key: 'actions',
// //       label: 'Actions',
// //       render: (_v, r) => {
// //         const id = r.id || r.agent_id
// //         const disabled = saving[id]
// //         return (
// //           <div className="flex gap-2">
// //             <Button
// //               disabled={disabled}
// //               onClick={async () => {
// //                 if (!isUuid(id)) { toast.error('Invalid agent id'); return }
// //                 const base = Number(baseEdit[id]) || 0
// //                 const rate = Number(rateEdit[id]) || 0
// //                 setSaving(s => ({ ...s, [id]: true }))
// //                 try {
// //                   await api.admin.setAgentComp(id, base, rate)
// //                   toast.success('Compensation saved')
// //                 } finally {
// //                   setSaving(s => ({ ...s, [id]: false }))
// //                 }
// //               }}
// //             >{disabled ? 'Saving…' : 'Save'}</Button>
// //             <Button variant="outline" onClick={() => { setBaseEdit(s => ({ ...s, [id]: '' })); setRateEdit(s => ({ ...s, [id]: '' })) }}>
// //               Cancel
// //             </Button>
// //             <Button variant="destructive" onClick={async () => {
// //               if (!isUuid(id)) { toast.error('Invalid agent id'); return }
// //               if (!confirm('Delete this agent?')) return
// //               await api.admin.deleteAgent(id)
// //               setRows(rs => rs.filter(x => (x.id || x.agent_id) !== id))
// //             }}>Delete</Button>
// //           </div>
// //         )
// //       }
// //     }
// //   ]), [baseEdit, rateEdit, saving])

// //   return (
// //     <>
// //       <Card
// //         title="Agents"
// //         subtitle="Edit base salary & commission, or delete agents"
// //         actions={<Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
// //       >
// //         <DataTable
// //           columns={cols}
// //           rows={rows}
// //           loading={loading}
// //           onRowClick={(row) => {
// //             const id = row.id || row.agent_id
// //             if (!isUuid(id)) { toast.error('Invalid agent id'); return }
// //             setSelectedId(id)
// //             setOpen(true)
// //           }}
// //         />
// //         <div className="mt-3 text-xs opacity-60">
// //           Tip: If Base Salary / Commission shows “—”, it just hasn’t been set yet. Enter values and click “Save”.
// //         </div>
// //       </Card>

// //       <AgentDetailsModal open={open} id={selectedId} onClose={() => setOpen(false)} />
// //     </>
// //   )
// // }



// import React, { useEffect, useMemo, useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import DataTable from '../../components/data/DataTable'
// import { Input } from '../../components/ui/Input'
// import { api } from '../../lib/api'
// import { toast } from '../../components/ui/Toast'

// const isUuid = v =>
//   typeof v === 'string' &&
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)

// const prettyName = (email) =>
//   (email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—')

// // ---------- Modal ----------
// function AgentDetailsModal({ open, id, onClose }) {
//   const [data, setData] = useState(null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     if (!open || !id) return
//     setLoading(true)
//     api.admin.agentSummary(id)              // id may be UUID OR email
//       .then(setData)
//       .catch((e) => toast.error(e?.message || 'Failed to load agent details'))
//       .finally(() => setLoading(false))
//   }, [open, id])

//   if (!open) return null
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//       <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
//         <div className="mb-3 flex items-center justify-between">
//           <h3 className="text-lg font-semibold">Agent Details</h3>
//           <Button variant="ghost" onClick={onClose}>Close</Button>
//         </div>

//         {loading && <div className="text-sm opacity-70">Loading…</div>}
//         {!loading && data && (
//           <div className="space-y-4">
//             <div className="grid gap-3 md:grid-cols-2">
//               <div className="tag">ID: <b className="ml-1">{data.agent?.id}</b></div>
//               <div className="tag">Customers: <b className="ml-1">{data.customer_count}</b></div>
//               <div className="tag">Name: <b className="ml-1">{data.agent?.name || prettyName(data.agent?.email)}</b></div>
//               <div className="tag">Email: <b className="ml-1">{data.agent?.email}</b></div>
//             </div>

//             <div className="grid gap-3 md:grid-cols-3">
//               <div className="kpi"><div className="text-xs opacity-70">Sales (total)</div><div className="text-xl font-bold">{data.totals?.sales_count ?? 0}</div></div>
//               <div className="kpi"><div className="text-xs opacity-70">Premium (total)</div><div className="text-xl font-bold">{data.totals?.total_premium ?? 0}</div></div>
//               <div className="kpi"><div className="text-xs opacity-70">Commission (total)</div><div className="text-xl font-bold">{data.totals?.total_commission ?? 0}</div></div>
//             </div>

//             <div className="grid gap-3 md:grid-cols-2">
//               <div className="kpi"><div className="text-xs opacity-70">Base Salary</div><div className="text-xl font-bold">₹{data.comp?.base_salary ?? 0}/month</div></div>
//               <div className="kpi"><div className="text-xs opacity-70">Commission Rate</div><div className="text-xl font-bold">{data.comp?.commission_rate ?? 0}%</div></div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// // ---------- Page ----------
// export default function AdminAgents() {
//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(false)

//   const [baseEdit, setBaseEdit] = useState({})
//   const [rateEdit, setRateEdit] = useState({})
//   const [saving, setSaving] = useState({})

//   // details modal
//   const [open, setOpen] = useState(false)
//   const [selectedId, setSelectedId] = useState(null)

//   async function load() {
//     setLoading(true)
//     try {
//       const data = await api.admin.agents()
//       setRows(Array.isArray(data) ? data : [])
//     } finally { setLoading(false) }
//   }
//   useEffect(() => { load() }, [])

//   const cols = useMemo(() => ([
//     {
//       key: 'id',
//       label: 'ID',
//       render: (_v, r) => (r.id || r.agent_id || '—')
//     },
//     {
//       key: 'name',
//       label: 'Name',
//       render: (_v, r) => (r.name || r.agent_name || prettyName(r.email))
//     },
//     { key: 'email', label: 'Email' },
//     { key: 'customer_count', label: '# Customers' },
//     {
//       key: 'base_salary',
//       label: 'Base Salary',
//       render: (_v, r) => {
//         const id = r.id || r.agent_id
//         // Prefill with row value if no edit in progress
//         const val = baseEdit[id] ?? (r.base_salary ?? '')
//         return (
//           <div className="flex items-center gap-2">
//             <Input
//               value={val}
//               onChange={(e) =>
//                 setBaseEdit(s => ({ ...s, [id]: e.target.value.replace(/[^\d.]/g, '') }))
//               }
//               placeholder="e.g. 2000"
//               className="w-28"
//             />
//             <span className="text-xs opacity-70">₹/month</span>
//           </div>
//         )
//       }
//     },
//     {
//       key: 'commission_rate',
//       label: 'Commission %',
//       render: (_v, r) => {
//         const id = r.id || r.agent_id
//         const val = rateEdit[id] ?? (r.commission_rate ?? '')
//         return (
//           <div className="flex items-center gap-2">
//             <Input
//               value={val}
//               onChange={(e) =>
//                 setRateEdit(s => ({ ...s, [id]: e.target.value.replace(/[^\d.]/g, '') }))
//               }
//               placeholder="e.g. 0.5"
//               className="w-20"
//             />
//             <span className="text-xs opacity-70">%</span>
//           </div>
//         )
//       }
//     },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (_v, r) => {
//         const id = r.id || r.agent_id
//         const canMutate = isUuid(id) // Save/Delete require a UUID
//         const disabled = saving[id] || !canMutate
//         return (
//           <div className="flex gap-2">
//             <Button
//               disabled={disabled}
//               onClick={async () => {
//                 const base = Number(baseEdit[id] ?? r.base_salary) || 0
//                 const rate = Number(rateEdit[id] ?? r.commission_rate) || 0
//                 setSaving(s => ({ ...s, [id]: true }))
//                 try {
//                   await api.admin.setAgentComp(id, base, rate)
//                   toast.success('Compensation saved')
//                 } finally {
//                   setSaving(s => ({ ...s, [id]: false }))
//                 }
//               }}
//               title={canMutate ? '' : 'Missing agent ID; cannot save'}
//             >
//               {saving[id] ? 'Saving…' : 'Save'}
//             </Button>

//             <Button
//               variant="outline"
//               onClick={() => {
//                 setBaseEdit(s => ({ ...s, [id]: undefined }))
//                 setRateEdit(s => ({ ...s, [id]: undefined }))
//               }}
//             >
//               Cancel
//             </Button>

//             <Button
//               variant="destructive"
//               disabled={!canMutate}
//               onClick={async () => {
//                 if (!confirm('Delete this agent?')) return
//                 await api.admin.deleteAgent(id)
//                 setRows(rs => rs.filter(x => (x.id || x.agent_id) !== id))
//                 toast.success('Agent deleted')
//               }}
//               title={canMutate ? '' : 'Missing agent ID; cannot delete'}
//             >
//               Delete
//             </Button>
//           </div>
//         )
//       }
//     }
//   ]), [baseEdit, rateEdit, saving])

//   return (
//     <>
//       <Card
//         title="Agents"
//         subtitle="Edit base salary & commission, or delete agents"
//         actions={<Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
//       >
//         <DataTable
//           columns={cols}
//           rows={rows}
//           loading={loading}
//           onRowClick={(row) => {
//             // Open modal with UUID or fall back to email (backend supports both)
//             const key = row.id || row.agent_id || row.email
//             if (!key) { toast.error('Missing agent identifier'); return }
//             setSelectedId(key)
//             setOpen(true)
//           }}
//         />
//         <div className="mt-3 text-xs opacity-60">
//           Tip: If Base Salary / Commission shows “—”, it just hasn’t been set yet. Enter values and click “Save”.
//         </div>
//       </Card>

//       <AgentDetailsModal open={open} id={selectedId} onClose={() => setOpen(false)} />
//     </>
//   )
// }

import React, { useEffect, useMemo, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import DataTable from '../../components/data/DataTable'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { toast } from '../../components/ui/Toast'

const isUuid = v =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v)

const prettyName = (email) =>
  (email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—')

// ---------- Modal ----------
function AgentDetailsModal({ open, id, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !id) return
    setLoading(true)
    api.admin.agentSummary(id) // accepts UUID or email
      .then(setData)
      .catch((e) => toast.error(e?.message || 'Failed to load agent details'))
      .finally(() => setLoading(false))
  }, [open, id])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 p-5">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Agent Details</h3>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        {loading && <div className="text-sm opacity-70">Loading…</div>}
        {!loading && data && (
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="tag">ID: <b className="ml-1">{data.agent?.id}</b></div>
              <div className="tag">Customers: <b className="ml-1">{data.customer_count}</b></div>
              <div className="tag">Name: <b className="ml-1">{data.agent?.name || prettyName(data.agent?.email)}</b></div>
              <div className="tag">Email: <b className="ml-1">{data.agent?.email}</b></div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="kpi"><div className="text-xs opacity-70">Sales (total)</div><div className="text-xl font-bold">{data.totals?.sales_count ?? 0}</div></div>
              <div className="kpi"><div className="text-xs opacity-70">Premium (total)</div><div className="text-xl font-bold">{data.totals?.total_premium ?? 0}</div></div>
              <div className="kpi"><div className="text-xs opacity-70">Commission (total)</div><div className="text-xl font-bold">{data.totals?.total_commission ?? 0}</div></div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="kpi"><div className="text-xs opacity-70">Base Salary</div><div className="text-xl font-bold">₹{data.comp?.base_salary ?? 0}/month</div></div>
              <div className="kpi"><div className="text-xs opacity-70">Commission Rate</div><div className="text-xl font-bold">{data.comp?.commission_rate ?? 0}%</div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Page ----------
export default function AdminAgents() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  const [baseEdit, setBaseEdit] = useState({})
  const [rateEdit, setRateEdit] = useState({})
  const [saving, setSaving] = useState({})

  // details modal state
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const data = await api.admin.agents()
      setRows(Array.isArray(data) ? data : [])
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const cols = useMemo(() => ([
    { key: 'id',   label: 'ID',    render: (_v, r) => (r.id || r.agent_id || '—') },
    { key: 'name', label: 'Name',  render: (_v, r) => (r.name || r.agent_name || prettyName(r.email)) },
    { key: 'email', label: 'Email' },
    { key: 'customer_count', label: '# Customers' },
    {
      key: 'base_salary',
      label: 'Base Salary',
      render: (_v, r) => {
        const id = r.id || r.agent_id
        const val = baseEdit[id] ?? (r.base_salary ?? '')
        return (
          <div className="flex items-center gap-2">
            <Input
              value={val}
              onChange={(e) =>
                setBaseEdit(s => ({ ...s, [id]: e.target.value.replace(/[^\d.]/g, '') }))
              }
              placeholder="e.g. 2000"
              className="w-28"
            />
            <span className="text-xs opacity-70">₹/month</span>
          </div>
        )
      }
    },
    {
      key: 'commission_rate',
      label: 'Commission %',
      render: (_v, r) => {
        const id = r.id || r.agent_id
        const val = rateEdit[id] ?? (r.commission_rate ?? '')
        return (
          <div className="flex items-center gap-2">
            <Input
              value={val}
              onChange={(e) =>
                setRateEdit(s => ({ ...s, [id]: e.target.value.replace(/[^\d.]/g, '') }))
              }
              placeholder="e.g. 0.5"
              className="w-20"
            />
            <span className="text-xs opacity-70">%</span>
          </div>
        )
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_v, r) => {
        const id = r.id || r.agent_id
        const canMutate = isUuid(id) // Save/Delete need UUID
        const disabled = saving[id] || !canMutate
        const viewKey = id || r.email // View can use UUID or email

        return (
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (!viewKey) { toast.error('Missing agent identifier'); return }
                setSelectedId(viewKey)
                setOpen(true)
              }}
            >
              View
            </Button>

            <Button
              disabled={disabled}
              onClick={async () => {
                const base = Number(baseEdit[id] ?? r.base_salary) || 0
                const rate = Number(rateEdit[id] ?? r.commission_rate) || 0
                setSaving(s => ({ ...s, [id]: true }))
                try {
                  await api.admin.setAgentComp(id, base, rate)
                  toast.success('Compensation saved')
                } finally {
                  setSaving(s => ({ ...s, [id]: false }))
                }
              }}
              title={canMutate ? '' : 'Missing agent ID; cannot save'}
            >
              {saving[id] ? 'Saving…' : 'Save'}
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setBaseEdit(s => ({ ...s, [id]: undefined }))
                setRateEdit(s => ({ ...s, [id]: undefined }))
              }}
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={!canMutate}
              onClick={async () => {
                if (!confirm('Delete this agent?')) return
                await api.admin.deleteAgent(id)
                setRows(rs => rs.filter(x => (x.id || x.agent_id) !== id))
                toast.success('Agent deleted')
              }}
              title={canMutate ? '' : 'Missing agent ID; cannot delete'}
            >
              Delete
            </Button>
          </div>
        )
      }
    }
  ]), [baseEdit, rateEdit, saving])

  return (
    <>
      <Card
        title="Agents"
        subtitle="Edit base salary & commission, or delete agents"
        actions={<Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
      >
        <DataTable
          columns={cols}
          rows={rows}
          loading={loading}
          // NOTE: no onRowClick — use the "View" button instead
        />
        <div className="mt-3 text-xs opacity-60">
          Tip: If Base Salary / Commission shows “—”, it just hasn’t been set yet. Enter values and click “Save”.
        </div>
      </Card>

      <AgentDetailsModal open={open} id={selectedId} onClose={() => setOpen(false)} />
    </>
  )
}
