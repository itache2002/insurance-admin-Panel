// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'
// import Modal from '../../components/Modal'
// import ResponsiveTable from '../../components/ResponsiveTable'

// export default function Customers() {
//   const [rows, setRows] = useState([])
//   const [q, setQ] = useState('')
//   const [status, setStatus] = useState('')
//   const [from, setFrom] = useState('')
//   const [to, setTo] = useState('')

//   const [detailOpen, setDetailOpen] = useState(false)
//   const [detail, setDetail] = useState(null)
//   const [savingStatus, setSavingStatus] = useState(false)
//   const [statusEdit, setStatusEdit] = useState('')

//   async function load(){
//     const params = new URLSearchParams()
//     if (q) params.set('q', q)
//     if (status) params.set('status', status)
//     if (from) params.set('from', from)
//     if (to) params.set('to', to)
//     const data = await http('/api/admin/customers' + (params.toString()? `?${params.toString()}` : ''))
//     setRows(data)
//   }
//   useEffect(()=>{ load() }, [])

//   async function openDetail(id){
//     const d = await http(`/api/admin/customers/${id}`)
//     setDetail(d)
//     setStatusEdit(d.status)
//     setDetailOpen(true)
//   }

//   async function saveStatus(){
//     if (!detail) return
//     setSavingStatus(true)
//     try {
//       const updated = await http(`/api/admin/customers/${detail.id}/status`, { method: 'PATCH', body: { status: statusEdit } })
//       setDetail({ ...detail, status: updated.status, updated_at: updated.updated_at })
//       await load()
//     } catch (e) {
//       alert(e.message)
//     } finally {
//       setSavingStatus(false)
//     }
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="card grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
//         <Field label="Search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Customer or Agent name" />
//         <div>
//           <label className="label">Status</label>
//           <select className="input select" value={status} onChange={e=>setStatus(e.target.value)}>
//             <option value="">All</option>
//             <option value="pending">Pending</option>
//             <option value="Verified">Verified</option>
//             <option value="Unverified">Unverified</option>
//           </select>
//         </div>
//         <Field label="From" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
//         <Field label="To" type="date" value={to} onChange={e=>setTo(e.target.value)} />
//         <div className="flex items-end">
//           <button className="btn w-full" onClick={load}>Apply</button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="text-lg font-semibold mb-4">All Customers</div>
//         <table className="table">
//           <thead>
//             <tr>
//               <th className="th">Customer</th>
//               <th className="th">Status</th>
//               <th className="th">Agent</th>
//               <th className="th">Agent Email</th>
//               <th className="th">Created</th>
//               <th className="th">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map(r => (
//               <tr key={r.id}>
//                 <td className="td">{r.customer_name}</td>
//                 <td className="td"><span className={`badge badge-${r.status}`}>{r.status}</span></td>
//                 <td className="td">{r.agent_name || '—'}</td>
//                 <td className="td">{r.agent_email || '—'}</td>
//                 <td className="td">{new Date(r.created_at).toLocaleString()}</td>
//                 <td className="td"><button className="btn" onClick={()=>openDetail(r.id)}>View</button></td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Modal open={detailOpen} onClose={()=>setDetailOpen(false)} title="Customer Detail">
//         {detail ? (
//           <div className="grid gap-3">
//             <div className="grid sm:grid-cols-2 gap-3">
//               <KV k="Name" v={detail.name} />
//               <KV k="Status" v={<span className={`badge badge-${detail.status}`}>{detail.status}</span>} />
//               <KV k="Age" v={detail.age ?? '—'} />
//               <KV k="Defenders Like" v={detail.defenders_like ?? '—'} />
//               <KV k="No. of Children" v={detail.number_of_children ?? '—'} />
//               <KV k="Spouse" v={detail.spouse ?? '—'} />
//               <KV k="Parents" v={detail.parents ?? '—'} />
//               <KV k="Aadhaar" v={detail.aadhaar_number ?? '—'} />
//               <KV k="PAN" v={detail.pan_number ?? '—'} />
//               <KV k="Created" v={new Date(detail.created_at).toLocaleString()} />
//               <KV k="Updated" v={detail.updated_at ? new Date(detail.updated_at).toLocaleString() : '—'} />
//               <KV k="Agent" v={`${detail.agent_name || '—'} (${detail.agent_email || ''})`} />
//               <KV k="Agent Phone" v={detail.agent_phone || '—'} />
//             </div>

//             <div className="card">
//               <div className="text-sm text-muted mb-2">Change Status (only from 'pending')</div>
//               <div className="grid sm:grid-cols-[1fr_auto] gap-3">
//                 <select className="input select" value={statusEdit} onChange={e=>setStatusEdit(e.target.value)}>
//                   <option value="pending">pending</option>
//                   <option value="Verified">Verified</option>
//                   <option value="Unverified">Unverified</option>
//                 </select>
//                 <button className="btn" disabled={savingStatus} onClick={saveStatus}>{savingStatus ? 'Saving…' : 'Save'}</button>
//               </div>
//             </div>
//           </div>
//         ) : 'Loading…'}
//       </Modal>
//     </div>
//   )
// }

// function Field({ label, ...props }){
//   return (
//     <div>
//       <label className="label">{label}</label>
//       <input className="input" {...props} />
//     </div>
//   )
// }
// function KV({ k, v }){ return <div className="kpi"><div className="text-sm text-muted">{k}</div><div className="text-white">{v}</div></div> }



// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'
// import Modal from '../../components/Modal'
// import ResponsiveTable from '../../components/ResponsiveTable'

// export default function Customers() {
//   const [rows, setRows] = useState([])
//   const [q, setQ] = useState('')
//   const [status, setStatus] = useState('')
//   const [from, setFrom] = useState('')
//   const [to, setTo] = useState('')

//   const [detailOpen, setDetailOpen] = useState(false)
//   const [detail, setDetail] = useState(null)

//   // inline status editor per row (admin-only page)
//   const [inlineStatus, setInlineStatus] = useState({})

//   // modal status editor
//   const [savingStatus, setSavingStatus] = useState(false)
//   const [statusEdit, setStatusEdit] = useState('')

//   async function load(){
//     const params = new URLSearchParams()
//     if (q) params.set('q', q)
//     if (status) params.set('status', status)
//     if (from) params.set('from', from)
//     if (to) params.set('to', to)
//     const data = await http('/api/admin/customers' + (params.toString()? `?${params.toString()}` : ''))
//     setRows(data)
//     setInlineStatus(Object.fromEntries(data.map(r => [r.id, r.status])))
//   }
//   useEffect(()=>{ load() }, [])

//   async function openDetail(id){
//     const d = await http(`/api/admin/customers/${id}`)
//     setDetail(d)
//     setStatusEdit(d.status)
//     setDetailOpen(true)
//   }

//   async function saveStatus(){
//     if (!detail) return
//     setSavingStatus(true)
//     try {
//       const updated = await http(`/api/admin/customers/${detail.id}/status`, { method: 'PATCH', body: { status: statusEdit } })
//       setDetail({ ...detail, status: updated.status, updated_at: updated.updated_at })
//       await load()
//     } catch (e) {
//       alert(e.message)
//     } finally {
//       setSavingStatus(false)
//     }
//   }

//   async function saveInlineStatus(id){
//     await http(`/api/admin/customers/${id}/status`, { method:'PATCH', body:{ status: inlineStatus[id] } })
//     await load()
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="card grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
//         <Field label="Search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Customer or Agent name" />
//         <div>
//           <label className="label">Status</label>
//           <select className="input select" value={status} onChange={e=>setStatus(e.target.value)}>
//             <option value="">All</option>
//             <option value="pending">Pending</option>
//             <option value="Verified">Verified</option>
//             <option value="Unverified">Unverified</option>
//           </select>
//         </div>
//         <Field label="From" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
//         <Field label="To" type="date" value={to} onChange={e=>setTo(e.target.value)} />
//         <div className="flex items-end">
//           <button className="btn w-full" onClick={load}>Apply</button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="text-lg font-semibold mb-4">All Customers</div>

//         <ResponsiveTable
//           columns={[
//             { key:'customer_name', label:'Customer' },
//             { key:'status', label:'Status', render:(r)=> <span className={`badge badge-${r.status}`}>{r.status}</span> },
//             { key:'agent_name', label:'Agent', render:(r)=> r.agent_name || '—' },
//             { key:'agent_email', label:'Agent Email', render:(r)=> r.agent_email || '—' },
//             { key:'created_at', label:'Created', render:(r)=> new Date(r.created_at).toLocaleString() },
//             {
//               key:'action',
//               label:'Action',
//               render:(r)=> (
//                 <div className="flex flex-col gap-2 min-w-[220px]">
//                   <button className="btn" onClick={()=>openDetail(r.id)}>View</button>
//                   <div className="grid grid-cols-[1fr_auto] gap-2">
//                     <select
//                       className="input select"
//                       value={inlineStatus[r.id] ?? r.status}
//                       onChange={e=>setInlineStatus(s=>({...s, [r.id]: e.target.value}))}
//                     >
//                       <option value="pending">pending</option>
//                       <option value="Verified">Verified</option>
//                       <option value="Unverified">Unverified</option>
//                     </select>
//                     <button className="btn-outline" onClick={()=>saveInlineStatus(r.id)}>Save</button>
//                   </div>
//                 </div>
//               )
//             }
//           ]}
//           rows={rows}
//           rowKey="id"
//           renderCard={(r)=>(
//             <div className="grid gap-2">
//               <div className="text-base font-semibold">{r.customer_name}</div>
//               <div><span className={`badge badge-${r.status}`}>{r.status}</span></div>
//               <div className="text-sm text-muted">Agent: <span className="text-white">{r.agent_name || '—'}</span></div>
//               <div className="text-sm text-muted">Email: <span className="text-white">{r.agent_email || '—'}</span></div>
//               <div className="text-sm text-muted">Created: <span className="text-white">{new Date(r.created_at).toLocaleString()}</span></div>
//               <div className="grid grid-cols-[1fr_auto] gap-2">
//                 <select
//                   className="input select"
//                   value={inlineStatus[r.id] ?? r.status}
//                   onChange={e=>setInlineStatus(s=>({...s, [r.id]: e.target.value}))}
//                 >
//                   <option value="pending">pending</option>
//                   <option value="Verified">Verified</option>
//                   <option value="Unverified">Unverified</option>
//                 </select>
//                 <button className="btn-outline" onClick={()=>saveInlineStatus(r.id)}>Save</button>
//               </div>
//               <button className="btn" onClick={()=>openDetail(r.id)}>View Full</button>
//             </div>
//           )}
//         />
//       </div>

//       <Modal open={detailOpen} onClose={()=>setDetailOpen(false)} title="Customer Detail">
//         {detail ? (
//           <div className="grid gap-3">
//             <div className="grid sm:grid-cols-2 gap-3">
//               <KV k="Name" v={detail.name} />
//               <KV k="Status" v={<span className={`badge badge-${detail.status}`}>{detail.status}</span>} />
//               <KV k="Age" v={detail.age ?? '—'} />
//               <KV k="Defenders Like" v={detail.defenders_like ?? '—'} />
//               <KV k="No. of Children" v={detail.number_of_children ?? '—'} />
//               <KV k="Spouse" v={detail.spouse ?? '—'} />
//               <KV k="Parents" v={detail.parents ?? '—'} />
//               <KV k="Aadhaar" v={detail.aadhaar_number ?? '—'} />
//               <KV k="PAN" v={detail.pan_number ?? '—'} />
//               <KV k="Created" v={new Date(detail.created_at).toLocaleString()} />
//               <KV k="Updated" v={detail.updated_at ? new Date(detail.updated_at).toLocaleString() : '—'} />
//               <KV k="Agent" v={`${detail.agent_name || '—'} (${detail.agent_email || ''})`} />
//               <KV k="Agent Phone" v={detail.agent_phone || '—'} />
//             </div>

//             <div className="card">
//               <div className="text-sm text-muted mb-2">Change Status (only admin)</div>
//               <div className="grid sm:grid-cols-[1fr_auto] gap-3">
//                 <select className="input select" value={statusEdit} onChange={e=>setStatusEdit(e.target.value)}>
//                   <option value="pending">pending</option>
//                   <option value="Verified">Verified</option>
//                   <option value="Unverified">Unverified</option>
//                 </select>
//                 <button className="btn" disabled={savingStatus} onClick={saveStatus}>
//                   {savingStatus ? 'Saving…' : 'Save'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : 'Loading…'}
//       </Modal>
//     </div>
//   )
// }

// function Field({ label, ...props }){
//   return (
//     <div>
//       <label className="label">{label}</label>
//       <input className="input" {...props} />
//     </div>
//   )
// }
// function KV({ k, v }){ return <div className="kpi"><div className="text-sm text-muted">{k}</div><div className="text-white">{v}</div></div> }



// import React, { useEffect, useMemo, useRef, useState } from 'react'
// import { http } from '../../lib/api'
// import Modal from '../../components/Modal'
// import ResponsiveTable from '../../components/ResponsiveTable'

// /* Toast (inline) */
// function Toast({ open, type='success', message, onClose }) {
//   if (!open) return null
//   const cls = type === 'success'
//     ? 'bg-emerald-600/90 border-emerald-300/60'
//     : 'bg-red-600/90 border-red-300/60'
//   return (
//     <div className={`fixed bottom-6 right-6 z-50 rounded-xl ${cls} text-white px-4 py-3 border shadow-xl`}>
//       <div className="flex items-center gap-3">
//         <span className="font-semibold">{type === 'success' ? 'Updated' : 'Error'}</span>
//         <span className="opacity-90">{message}</span>
//         <button className="ml-3 underline" onClick={onClose}>Dismiss</button>
//       </div>
//     </div>
//   )
// }

// /* simple interval hook that pauses when document hidden */
// function useVisibleInterval(cb, ms) {
//   const saved = useRef(cb)
//   useEffect(() => { saved.current = cb }, [cb])
//   useEffect(() => {
//     let id
//     const tick = () => {
//       if (document.visibilityState === 'visible') saved.current()
//       id = setTimeout(tick, ms)
//     }
//     id = setTimeout(tick, ms)
//     return () => clearTimeout(id)
//   }, [ms])
// }

// export default function Customers() {
//   const [rows, setRows] = useState([])
//   const [q, setQ] = useState('')
//   const [status, setStatus] = useState('')
//   const [from, setFrom] = useState('')
//   const [to, setTo] = useState('')

//   const [detailOpen, setDetailOpen] = useState(false)
//   const [detail, setDetail] = useState(null)

//   // inline status editor per row
//   const [inlineStatus, setInlineStatus] = useState({})
//   const [loading, setLoading] = useState(false)
//   const [err, setErr] = useState('')

//   // toast
//   const [toast, setToast] = useState({ open:false, type:'success', message:'' })
//   const showToast = (message, type='success') => {
//     setToast({ open:true, type, message })
//     window.clearTimeout(showToast.tid)
//     showToast.tid = window.setTimeout(()=> setToast(t=>({...t, open:false})), 2000)
//   }

//   const queryKey = useMemo(() => JSON.stringify({ q, status, from, to }), [q, status, from, to])

//   async function load() {
//     setLoading(true)
//     setErr('')
//     try {
//       const params = new URLSearchParams()
//       if (q) params.set('q', q)
//       if (status) params.set('status', status)
//       if (from) params.set('from', from)
//       if (to) params.set('to', to)
//       const data = await http('/api/admin/customers' + (params.toString()? `?${params.toString()}` : ''))
//       setRows(data)
//       setInlineStatus(Object.fromEntries(data.map(r => [r.id, r.status])))
//     } catch (e) {
//       setErr(e.message || 'Failed to load')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { load() }, [queryKey])

//   // refresh when window/tab regains focus
//   useEffect(() => {
//     const onFocus = () => load()
//     window.addEventListener('focus', onFocus)
//     return () => window.removeEventListener('focus', onFocus)
//   }, [queryKey])

//   // soft polling every 5s (visible only)
//   useVisibleInterval(load, 5000)

//   async function openDetail(id){
//     const d = await http(`/api/admin/customers/${id}`)
//     setDetail(d)
//     setDetailOpen(true)
//   }

//   // Optimistic save (inline)
//   async function saveInlineStatus(id){
//     const newStatus = inlineStatus[id]
//     if (!newStatus) return

//     // optimistic update
//     const prevRows = rows
//     const nextRows = rows.map(r => r.id === id ? { ...r, status: newStatus } : r)
//     setRows(nextRows)

//     try {
//       await http(`/api/admin/customers/${id}/status`, { method:'PATCH', body:{ status: newStatus } })
//       showToast('Status updated to ' + newStatus)
//       // confirm from server (non-blocking refresh)
//       load()
//     } catch (e) {
//       // rollback on error
//       setRows(prevRows)
//       showToast(e.message || 'Failed to update', 'error')
//     }
//   }

//   // Modal save (also optimistic)
//   async function saveDetailStatus(newStatus){
//     if (!detail) return
//     const prev = detail
//     setDetail({ ...detail, status: newStatus })
//     try {
//       await http(`/api/admin/customers/${detail.id}/status`, { method:'PATCH', body:{ status: newStatus } })
//       showToast('Status updated to ' + newStatus)
//       load()
//     } catch (e) {
//       setDetail(prev)
//       showToast(e.message || 'Failed to update', 'error')
//     }
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="card grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
//         <Field label="Search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Customer or Agent name" />
//         <div>
//           <label className="label">Status</label>
//           <select className="input select" value={status} onChange={e=>setStatus(e.target.value)}>
//             <option value="">All</option>
//             <option value="pending">Pending</option>
//             <option value="Verified">Verified</option>
//             <option value="Unverified">Unverified</option>
//           </select>
//         </div>
//         <Field label="From" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
//         <Field label="To" type="date" value={to} onChange={e=>setTo(e.target.value)} />
//         <div className="flex items-end">
//           <button className="btn w-full" onClick={load}>Apply</button>
//         </div>
//       </div>

//       <div className="card">
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-lg font-semibold">All Customers</div>
//           {loading && <div className="text-sm text-muted">Refreshing…</div>}
//           {err && <div className="text-sm text-red-400">{err}</div>}
//         </div>

//         <ResponsiveTable
//           columns={[
//             { key:'customer_name', label:'Customer' },
//             { key:'status', label:'Status', render:(r)=> <span className={`badge badge-${r.status}`}>{r.status}</span> },
//             { key:'agent_name', label:'Agent', render:(r)=> r.agent_name || '—' },
//             { key:'agent_email', label:'Agent Email', render:(r)=> r.agent_email || '—' },
//             { key:'created_at', label:'Created', render:(r)=> new Date(r.created_at).toLocaleString() },
//             {
//               key:'action',
//               label:'Action',
//               render:(r)=> (
//                 <div className="flex flex-col gap-2 min-w-[220px]">
//                   <button className="btn" onClick={()=>openDetail(r.id)}>View</button>
//                   <div className="grid grid-cols-[1fr_auto] gap-2">
//                     <select
//                       className="input select"
//                       value={inlineStatus[r.id] ?? r.status}
//                       onChange={e=>setInlineStatus(s=>({...s, [r.id]: e.target.value}))}
//                     >
//                       <option value="pending">pending</option>
//                       <option value="Verified">Verified</option>
//                       <option value="Unverified">Unverified</option>
//                     </select>
//                     <button className="btn-outline" onClick={()=>saveInlineStatus(r.id)}>Save</button>
//                   </div>
//                 </div>
//               )
//             }
//           ]}
//           rows={rows}
//           rowKey="id"
//           renderCard={(r)=>(
//             <div className="grid gap-2">
//               <div className="text-base font-semibold">{r.customer_name}</div>
//               <div><span className={`badge badge-${r.status}`}>{r.status}</span></div>
//               <div className="text-sm text-muted">Agent: <span className="text-white">{r.agent_name || '—'}</span></div>
//               <div className="text-sm text-muted">Email: <span className="text-white">{r.agent_email || '—'}</span></div>
//               <div className="text-sm text-muted">Created: <span className="text-white">{new Date(r.created_at).toLocaleString()}</span></div>
//               <div className="grid grid-cols-[1fr_auto] gap-2">
//                 <select
//                   className="input select"
//                   value={inlineStatus[r.id] ?? r.status}
//                   onChange={e=>setInlineStatus(s=>({...s, [r.id]: e.target.value}))}
//                 >
//                   <option value="pending">pending</option>
//                   <option value="Verified">Verified</option>
//                   <option value="Unverified">Unverified</option>
//                 </select>
//                 <button className="btn-outline" onClick={()=>saveInlineStatus(r.id)}>Save</button>
//               </div>
//               <button className="btn" onClick={()=>openDetail(r.id)}>View Full</button>
//             </div>
//           )}
//         />
//       </div>

//       <Modal open={detailOpen} onClose={()=>setDetailOpen(false)} title="Customer Detail">
//         {detail ? (
//           <div className="grid gap-3">
//             <div className="grid sm:grid-cols-2 gap-3">
//               <KV k="Name" v={detail.name} />
//               <KV k="Status" v={<span className={`badge badge-${detail.status}`}>{detail.status}</span>} />
//               <KV k="Age" v={detail.age ?? '—'} />
//               <KV k="Defenders Like" v={detail.defenders_like ?? '—'} />
//               <KV k="No. of Children" v={detail.number_of_children ?? '—'} />
//               <KV k="Spouse" v={detail.spouse ?? '—'} />
//               <KV k="Parents" v={detail.parents ?? '—'} />
//               <KV k="Aadhaar" v={detail.aadhaar_number ?? '—'} />
//               <KV k="PAN" v={detail.pan_number ?? '—'} />
//               <KV k="Created" v={new Date(detail.created_at).toLocaleString()} />
//               <KV k="Updated" v={detail.updated_at ? new Date(detail.updated_at).toLocaleString() : '—'} />
//               <KV k="Agent" v={`${detail.agent_name || '—'} (${detail.agent_email || ''})`} />
//               <KV k="Agent Phone" v={detail.agent_phone || '—'} />
//             </div>

//             <div className="card">
//               <div className="text-sm text-muted mb-2">Change Status (only admin)</div>
//               <div className="grid sm:grid-cols-[1fr_auto] gap-3">
//                 <select
//                   className="input select"
//                   value={detail.status}
//                   onChange={e=>setDetail(d=>({...d, status: e.target.value}))}
//                 >
//                   <option value="pending">pending</option>
//                   <option value="Verified">Verified</option>
//                   <option value="Unverified">Unverified</option>
//                 </select>
//                 <button className="btn" onClick={()=>saveDetailStatus(detail.status)}>Save</button>
//               </div>
//             </div>
//           </div>
//         ) : 'Loading…'}
//       </Modal>

//       <Toast open={toast.open} type={toast.type} message={toast.message} onClose={()=>setToast(t=>({...t, open:false}))} />
//     </div>
//   )
// }

// function Field({ label, ...props }){
//   return (
//     <div>
//       <label className="label">{label}</label>
//       <input className="input" {...props} />
//     </div>
//   )
// }
// function KV({ k, v }){ return <div className="kpi"><div className="text-sm text-muted">{k}</div><div className="text-white">{v}</div></div> }



import React, { useEffect, useMemo, useRef, useState } from 'react'
import { http } from '../../lib/api'
import Modal from '../../components/Modal'
import ResponsiveTable from '../../components/ResponsiveTable'

/* Toast */
function Toast({ open, type='success', message, onClose }) {
  if (!open) return null
  const cls = type === 'success'
    ? 'bg-emerald-600/90 border-emerald-300/60'
    : 'bg-red-600/90 border-red-300/60'
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-xl ${cls} text-white px-4 py-3 border shadow-xl`}>
      <div className="flex items-center gap-3">
        <span className="font-semibold">{type === 'success' ? 'Updated' : 'Error'}</span>
        <span className="opacity-90">{message}</span>
        <button className="ml-3 underline" onClick={onClose}>Dismiss</button>
      </div>
    </div>
  )
}

/* Interval that pauses when tab is hidden */
function useVisibleInterval(cb, ms) {
  const saved = useRef(cb)
  useEffect(() => { saved.current = cb }, [cb])
  useEffect(() => {
    let id
    const tick = () => {
      if (document.visibilityState === 'visible') saved.current()
      id = setTimeout(tick, ms)
    }
    id = setTimeout(tick, ms)
    return () => clearTimeout(id)
  }, [ms])
}

export default function Customers() {
  const [rows, setRows] = useState([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const [detailOpen, setDetailOpen] = useState(false)
  const [detail, setDetail] = useState(null)

  // inline editor state
  const [inlineStatus, setInlineStatus] = useState({})
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  // toast
  const [toast, setToast] = useState({ open:false, type:'success', message:'' })
  const showToast = (message, type='success') => {
    setToast({ open:true, type, message })
    window.clearTimeout(showToast.tid)
    showToast.tid = window.setTimeout(()=> setToast(t=>({...t, open:false})), 1800)
  }

  const queryKey = useMemo(() => JSON.stringify({ q, status, from, to }), [q, status, from, to])

  async function load() {
    setLoading(true)
    setErr('')
    try {
      const params = new URLSearchParams()
      if (q) params.set('q', q)
      if (status) params.set('status', status)
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      const data = await http('/api/admin/customers' + (params.toString()? `?${params.toString()}` : ''))
      setRows(data)
      setInlineStatus(Object.fromEntries(data.map(r => [r.id, r.status])))
    } catch (e) {
      setErr(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [queryKey])

  // refresh on focus
  useEffect(() => {
    const onFocus = () => load()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [queryKey])

  // soft polling every 5s
  useVisibleInterval(load, 5000)

  async function openDetail(id){
    const d = await http(`/api/admin/customers/${id}`)
    setDetail(d)
    setDetailOpen(true)
  }

  /** Optimistic inline save with guard:
   *  - if unchanged -> do nothing
   *  - optimistic UI -> immediate table update
   *  - on 400/409 -> rollback and refetch
   */
  async function saveInlineStatus(id){
    const newStatus = inlineStatus[id]
    const row = rows.find(r => r.id === id)
    if (!row) return
    if (!newStatus || newStatus === row.status) return  // 🔒 prevent no-op/dup calls

    const prevRows = rows
    setRows(rows.map(r => r.id === id ? { ...r, status: newStatus } : r))

    try {
      await http(`/api/admin/customers/${id}/status`, { method:'PATCH', body:{ status: newStatus } })
      showToast('Status updated to ' + newStatus)
      // confirm latest snapshot (non-blocking)
      load()
    } catch (e) {
      setRows(prevRows) // rollback
      showToast(e.message || 'Failed to update', 'error')
      // re-sync from server just in case
      load()
    }
  }

  /** Modal save (same guards) */
  async function saveDetailStatus(newStatus){
    if (!detail || detail.status === newStatus) return
    const prev = detail
    setDetail({ ...detail, status: newStatus })
    try {
      await http(`/api/admin/customers/${detail.id}/status`, { method:'PATCH', body:{ status: newStatus } })
      showToast('Status updated to ' + newStatus)
      load()
    } catch (e) {
      setDetail(prev)
      showToast(e.message || 'Failed to update', 'error')
      load()
    }
  }

  return (
    <div className="grid gap-6">
      <div className="card grid sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <Field label="Search" value={q} onChange={e=>setQ(e.target.value)} placeholder="Customer or Agent name" />
        <div>
          <label className="label">Status</label>
          <select className="input select" value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Unverified">Unverified</option>
          </select>
        </div>
        <Field label="From" type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <Field label="To" type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <div className="flex items-end">
          <button className="btn w-full" onClick={load}>Apply</button>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">All Customers</div>
          {loading && <div className="text-sm text-muted">Refreshing…</div>}
          {err && <div className="text-sm text-red-400">{err}</div>}
        </div>

        <ResponsiveTable
          columns={[
            { key:'customer_name', label:'Customer' },
            { key:'status', label:'Status', render:(r)=> <span className={`badge badge-${r.status}`}>{r.status}</span> },
            { key:'agent_name', label:'Agent', render:(r)=> r.agent_name || '—' },
            { key:'agent_email', label:'Agent Email', render:(r)=> r.agent_email || '—' },
            { key:'created_at', label:'Created', render:(r)=> new Date(r.created_at).toLocaleString() },
            {
              key:'action',
              label:'Action',
              render:(r)=> {
                const current = r.status
                const chosen = inlineStatus[r.id] ?? current
                const disabled = chosen === current
                return (
                  <div className="flex flex-col gap-2 min-w-[220px]">
                    <button className="btn" onClick={()=>openDetail(r.id)}>View</button>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <select
                        className="input select"
                        value={chosen}
                        onChange={e=>setInlineStatus(s=>({...s, [r.id]: e.target.value}))}
                      >
                        <option value="pending">pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Unverified">Unverified</option>
                      </select>
                      <button
                        className={`btn-outline ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={disabled}
                        onClick={()=>saveInlineStatus(r.id)}
                      >Save</button>
                    </div>
                  </div>
                )
              }
            }
          ]}
          rows={rows}
          rowKey="id"
          renderCard={(r)=> {
            const current = r.status
            const chosen = inlineStatus[r.id] ?? current
            const disabled = chosen === current
            return (
              <div className="grid gap-2">
                <div className="text-base font-semibold">{r.customer_name}</div>
                <div><span className={`badge badge-${r.status}`}>{r.status}</span></div>
                <div className="text-sm text-muted">Agent: <span className="text-white">{r.agent_name || '—'}</span></div>
                <div className="text-sm text-muted">Email: <span className="text-white">{r.agent_email || '—'}</span></div>
                <div className="text-sm text-muted">Created: <span className="text-white">{new Date(r.created_at).toLocaleString()}</span></div>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <select
                    className="input select"
                    value={chosen}
                    onChange={e=>setInlineStatus(s=>({...s, [r.id]: e.target.value}))}
                  >
                    <option value="pending">pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Unverified">Unverified</option>
                  </select>
                  <button
                    className={`btn-outline ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={disabled}
                    onClick={()=>saveInlineStatus(r.id)}
                  >Save</button>
                </div>
                <button className="btn" onClick={()=>openDetail(r.id)}>View Full</button>
              </div>
            )
          }}
        />
      </div>

      <Modal open={detailOpen} onClose={()=>setDetailOpen(false)} title="Customer Detail">
        {detail ? (
          <div className="grid gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <KV k="Name" v={detail.name} />
              <KV k="Status" v={<span className={`badge badge-${detail.status}`}>{detail.status}</span>} />
              <KV k="Age" v={detail.age ?? '—'} />
              <KV k="Defenders Like" v={detail.defenders_like ?? '—'} />
              <KV k="No. of Children" v={detail.number_of_children ?? '—'} />
              <KV k="Spouse" v={detail.spouse ?? '—'} />
              <KV k="Parents" v={detail.parents ?? '—'} />
              <KV k="Aadhaar" v={detail.aadhaar_number ?? '—'} />
              <KV k="PAN" v={detail.pan_number ?? '—'} />
              <KV k="Created" v={new Date(detail.created_at).toLocaleString()} />
              <KV k="Updated" v={detail.updated_at ? new Date(detail.updated_at).toLocaleString() : '—'} />
              <KV k="Agent" v={`${detail.agent_name || '—'} (${detail.agent_email || ''})`} />
              <KV k="Agent Phone" v={detail.agent_phone || '—'} />
            </div>

            <div className="card">
              <div className="text-sm text-muted mb-2">Change Status (only admin)</div>
              <div className="grid sm:grid-cols-[1fr_auto] gap-3">
                <select
                  className="input select"
                  value={detail.status}
                  onChange={e=>setDetail(d=>({...d, status: e.target.value}))}
                >
                  <option value="pending">pending</option>
                  <option value="Verified">Verified</option>
                  <option value="Unverified">Unverified</option>
                </select>
                <button className="btn" onClick={()=>saveDetailStatus(detail.status)}>Save</button>
              </div>
            </div>
          </div>
        ) : 'Loading…'}
      </Modal>

      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={()=>setToast(t=>({...t, open:false}))} />
    </div>
  )
}

function Field({ label, ...props }){
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...props} />
    </div>
  )
}
function KV({ k, v }){ return <div className="kpi"><div className="text-sm text-muted">{k}</div><div className="text-white">{v}</div></div> }
