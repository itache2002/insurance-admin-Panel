// // // // // import React, { useState } from 'react'
// // // // // import Card from '../../components/ui/Card'
// // // // // import Button from '../../components/ui/Button'
// // // // // import DataTable from '../../components/data/DataTable'
// // // // // import { api } from '../../lib/api'
// // // // // export default function EmployeeAgents(){
// // // // //   const [rows,setRows]=useState([])
// // // // //   return <Card title="My Agents" actions={<Button variant="outline" onClick={async()=>setRows(await api.employee.agents())}>Refresh</Button>}>
// // // // //     <DataTable columns={[{key:'id',label:'ID'},{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'phone_no',label:'Phone'}]} rows={rows}/>
// // // // //   </Card>
// // // // // }



// // // // import React, { useEffect, useState } from 'react'
// // // // import Card from '../../components/ui/Card'
// // // // import Button from '../../components/ui/Button'
// // // // import { Field } from '../../components/ui/Field'
// // // // import { Input } from '../../components/ui/Input'
// // // // import DataTable from '../../components/data/DataTable'
// // // // import { api } from '../../lib/api'

// // // // export default function EmployeeAgents(){
// // // //   const [rows, setRows] = useState([])
// // // //   const [loading, setLoading] = useState(false)

// // // //   const [form, setForm] = useState({
// // // //     name:'', email:'', phone_no:'',
// // // //     pan_no:'', aadhaar_no:'',
// // // //     bank_name:'', bank_ifsc:'', bank_account_no:'',
// // // //     edu_10:'', edu_12:'', edu_degree:''
// // // //   })
// // // //   const [newCreds, setNewCreds] = useState(null)

// // // //   async function load(){
// // // //     setLoading(true)
// // // //     try{
// // // //       const data = await api.employee.agentsOverview()
// // // //       setRows(Array.isArray(data) ? data : [])
// // // //     } finally { setLoading(false) }
// // // //   }
// // // //   useEffect(()=>{ load() }, [])

// // // //   function onChange(k, v){ setForm(f => ({...f, [k]: v})) }

// // // //   async function create(){
// // // //     if(!form.name || !form.email){ alert('Name and Email are required'); return }
// // // //     const payload = {
// // // //       name: form.name, email: form.email, phone_no: form.phone_no,
// // // //       pan_no: form.pan_no?.toUpperCase(),
// // // //       aadhaar_no: form.aadhaar_no?.replace(/[^0-9]/g,''),
// // // //       bank_name: form.bank_name, bank_ifsc: form.bank_ifsc, bank_account_no: form.bank_account_no,
// // // //       edu_10: form.edu_10, edu_12: form.edu_12, edu_degree: form.edu_degree
// // // //     }
// // // //     const res = await api.employee.addAgent(payload)
// // // //     setNewCreds({ email: res?.user?.email, temp_password: res?.temp_password })
// // // //     setForm({
// // // //       name:'', email:'', phone_no:'',
// // // //       pan_no:'', aadhaar_no:'',
// // // //       bank_name:'', bank_ifsc:'', bank_account_no:'',
// // // //       edu_10:'', edu_12:'', edu_degree:''
// // // //     })
// // // //     await load()
// // // //   }

// // // //   return (
// // // //     <div className="grid gap-6 md:grid-cols-2">
// // // //       <Card
// // // //         title="Add New Agent (Full Details)"
// // // //         subtitle="Agent will be assigned under you. Share the temporary password only once."
// // // //         actions={<Button onClick={create}>Create Agent</Button>}
// // // //       >
// // // //         <div className="space-y-4">
// // // //           <div className="grid md:grid-cols-3 gap-3">
// // // //             <Field label="Name"><Input value={form.name} onChange={e=>onChange('name', e.target.value)} /></Field>
// // // //             <Field label="Email"><Input value={form.email} onChange={e=>onChange('email', e.target.value)} /></Field>
// // // //             <Field label="Phone"><Input value={form.phone_no} onChange={e=>onChange('phone_no', e.target.value)} /></Field>
// // // //           </div>

// // // //           <div className="grid md:grid-cols-2 gap-3">
// // // //             <Field label="PAN"><Input value={form.pan_no} onChange={e=>onChange('pan_no', e.target.value.toUpperCase())} placeholder="ABCDE1234F" /></Field>
// // // //             <Field label="Aadhaar"><Input value={form.aadhaar_no} onChange={e=>onChange('aadhaar_no', e.target.value.replace(/[^0-9]/g,''))} placeholder="12 digits" /></Field>
// // // //           </div>

// // // //           <div className="grid md:grid-cols-3 gap-3">
// // // //             <Field label="Bank Name"><Input value={form.bank_name} onChange={e=>onChange('bank_name', e.target.value)} /></Field>
// // // //             <Field label="IFSC"><Input value={form.bank_ifsc} onChange={e=>onChange('bank_ifsc', e.target.value)} /></Field>
// // // //             <Field label="Account #"><Input value={form.bank_account_no} onChange={e=>onChange('bank_account_no', e.target.value)} /></Field>
// // // //           </div>

// // // //           <div className="grid md:grid-cols-3 gap-3">
// // // //             <Field label="Class 10"><Input value={form.edu_10} onChange={e=>onChange('edu_10', e.target.value)} /></Field>
// // // //             <Field label="Class 12"><Input value={form.edu_12} onChange={e=>onChange('edu_12', e.target.value)} /></Field>
// // // //             <Field label="Degree"><Input value={form.edu_degree} onChange={e=>onChange('edu_degree', e.target.value)} /></Field>
// // // //           </div>

// // // //           {newCreds && (
// // // //             <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-sm">
// // // //               <div className="font-semibold mb-1">Temporary Credentials</div>
// // // //               <div>Email: <b>{newCreds.email}</b></div>
// // // //               <div>Password: <b className="select-all">{newCreds.temp_password}</b></div>
// // // //               <div className="opacity-80 mt-1">Share ONLY once. Agent must change password on first login.</div>
// // // //               <div className="mt-2">
// // // //                 <Button variant="outline" onClick={()=>setNewCreds(null)}>Hide</Button>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </Card>

// // // //       <Card
// // // //         title="Agents Under Me"
// // // //         subtitle="With their customer counts"
// // // //         actions={<Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
// // // //       >
// // // //         <DataTable
// // // //           columns={[
// // // //             { key:'agent_name', label:'Agent Name' },
// // // //             { key:'agent_email', label:'Email' },
// // // //             { key:'customer_count', label:'# Customers' },
// // // //           ]}
// // // //           rows={rows}
// // // //         />
// // // //       </Card>
// // // //     </div>
// // // //   )
// // // // }



// // // import React, { useEffect, useState } from 'react'
// // // import Card from '../../components/ui/Card'
// // // import Button from '../../components/ui/Button'
// // // import DataTable from '../../components/data/DataTable'
// // // import { Field } from '../../components/ui/Field'
// // // import { Input } from '../../components/ui/Input'
// // // import { api } from '../../lib/api'

// // // const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/
// // // const AADHAAR_RE = /^[0-9]{12}$/

// // // export default function EmployeeAgents() {
// // //   const [agents, setAgents] = useState([])
// // //   const [loading, setLoading] = useState(false)

// // //   const [form, setForm] = useState({
// // //     name: '', email: '', phone_no: '',
// // //     pan_no: '', aadhaar_no: '',
// // //     bank_name: '', bank_ifsc: '', bank_account_no: '',
// // //     edu_10: '', edu_12: '', edu_degree: '',
// // //   })

// // //   function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

// // //   async function loadAgents() {
// // //     setLoading(true)
// // //     try {
// // //       if (api.employee.agentsOverview) {
// // //         setAgents(await api.employee.agentsOverview())
// // //       } else {
// // //         const list = await api.employee.agents()
// // //         setAgents((list || []).map(a => ({ ...a, customer_count: undefined })))
// // //       }
// // //     } finally {
// // //       setLoading(false)
// // //     }
// // //   }

// // //   useEffect(() => { loadAgents() }, [])

// // //   async function createAgent() {
// // //     if (!form.name.trim()) return alert('Name is required')
// // //     if (!form.email.trim()) return alert('Email is required')
// // //     if (form.pan_no && !PAN_RE.test(form.pan_no.trim().toUpperCase())) {
// // //       return alert('PAN must look like ABCDE1234F')
// // //     }
// // //     if (form.aadhaar_no && !AADHAAR_RE.test(form.aadhaar_no.replace(/\D/g, ''))) {
// // //       return alert('Aadhaar must be 12 digits')
// // //     }

// // //     const payload = {
// // //       name: form.name.trim(),
// // //       email: form.email.trim(),
// // //       phone_no: form.phone_no.trim() || undefined,
// // //       pan_no: form.pan_no.trim() || undefined,
// // //       aadhaar_no: form.aadhaar_no.trim() || undefined,
// // //       bank_name: form.bank_name.trim() || undefined,
// // //       bank_ifsc: form.bank_ifsc.trim() || undefined,
// // //       bank_account_no: form.bank_account_no.trim() || undefined,
// // //       edu_10: form.edu_10.trim() || undefined,
// // //       edu_12: form.edu_12.trim() || undefined,
// // //       edu_degree: form.edu_degree.trim() || undefined,
// // //     }

// // //     const res = await api.employee.addAgent(payload) // expects POST /api/employee/agents
// // //     // Show temp password once
// // //     if (res?.temp_password) {
// // //       alert(`Agent created.\nTemporary password: ${res.temp_password}\nShare it only once.`)
// // //     }

// // //     // reset and refresh
// // //     setForm({
// // //       name: '', email: '', phone_no: '',
// // //       pan_no: '', aadhaar_no: '',
// // //       bank_name: '', bank_ifsc: '', bank_account_no: '',
// // //       edu_10: '', edu_12: '', edu_degree: '',
// // //     })
// // //     loadAgents()
// // //   }

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Create form */}
// // //       <Card
// // //         title="Add New Agent (Full Details)"
// // //         subtitle="Agent will be assigned under you. Share the temporary password only once."
// // //         actions={<Button onClick={createAgent}>Create Agent</Button>}
// // //       >
// // //         {/* PERSONAL */}
// // //         <div className="mb-6">
// // //           <div className="text-sm text-slate-300 mb-3 font-medium">Personal</div>
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //             <Field label="Name">
// // //               <Input value={form.name} onChange={e => set('name', e.target.value)} />
// // //             </Field>
// // //             <Field label="Email">
// // //               <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} />
// // //             </Field>
// // //             <Field label="Phone">
// // //               <Input value={form.phone_no} onChange={e => set('phone_no', e.target.value)} />
// // //             </Field>
// // //           </div>
// // //         </div>

// // //         {/* IDs */}
// // //         <div className="mb-6">
// // //           <div className="text-sm text-slate-300 mb-3 font-medium">Identification</div>
// // //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// // //             <Field label="PAN">
// // //               <Input
// // //                 placeholder="ABCDE1234F"
// // //                 value={form.pan_no}
// // //                 onChange={e => set('pan_no', e.target.value.toUpperCase())}
// // //               />
// // //             </Field>
// // //             <Field label="Aadhaar">
// // //               <Input
// // //                 placeholder="12 digits"
// // //                 value={form.aadhaar_no}
// // //                 onChange={e => set('aadhaar_no', e.target.value.replace(/[^0-9]/g, ''))}
// // //               />
// // //             </Field>
// // //           </div>
// // //         </div>

// // //         {/* BANK */}
// // //         <div className="mb-6">
// // //           <div className="text-sm text-slate-300 mb-3 font-medium">Bank Details</div>
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //             <Field label="Bank Name">
// // //               <Input value={form.bank_name} onChange={e => set('bank_name', e.target.value)} />
// // //             </Field>
// // //             <Field label="IFSC">
// // //               <Input value={form.bank_ifsc} onChange={e => set('bank_ifsc', e.target.value.toUpperCase())} />
// // //             </Field>
// // //             <Field label="Account #">
// // //               <Input value={form.bank_account_no} onChange={e => set('bank_account_no', e.target.value)} />
// // //             </Field>
// // //           </div>
// // //         </div>

// // //         {/* EDUCATION */}
// // //         <div>
// // //           <div className="text-sm text-slate-300 mb-3 font-medium">Education</div>
// // //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// // //             <Field label="Class 10">
// // //               <Input value={form.edu_10} onChange={e => set('edu_10', e.target.value)} />
// // //             </Field>
// // //             <Field label="Class 12">
// // //               <Input value={form.edu_12} onChange={e => set('edu_12', e.target.value)} />
// // //             </Field>
// // //             <Field label="Degree">
// // //               <Input value={form.edu_degree} onChange={e => set('edu_degree', e.target.value)} />
// // //             </Field>
// // //           </div>
// // //         </div>
// // //       </Card>

// // //       {/* List of agents under me */}
// // //       <Card
// // //         title="Agents Under Me"
// // //         actions={<Button variant="outline" onClick={loadAgents} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
// // //       >
// // //         <DataTable
// // //           columns={[
// // //             { key: 'agent_name', label: 'Name' },
// // //             { key: 'agent_email', label: 'Email' },
// // //             { key: 'customer_count', label: '# Customers', render: v => (v ?? '—') },
// // //           ]}
// // //           rows={agents}
// // //         />
// // //       </Card>
// // //     </div>
// // //   )
// // // }

// // import React, { useEffect, useState } from 'react'
// // import Card from '../../components/ui/Card'
// // import Button from '../../components/ui/Button'
// // import DataTable from '../../components/data/DataTable'
// // import { api } from '../../lib/api'

// // export default function AdminEmployees(){
// //   const [rows,setRows]=useState([])
// //   const [loading,setLoading]=useState(false)

// //   async function load(){
// //     setLoading(true)
// //     try{
// //       const list = await api.admin.employees()
// //       setRows(Array.isArray(list) ? list : [])
// //     } finally { setLoading(false) }
// //   }
// //   useEffect(()=>{ load() },[])

// //   async function onDeleteEmployee(e, row){
// //     e.stopPropagation()
// //     const id = row.id
// //     if(!id) return
// //     if(!confirm(`Delete employee "${row.name || row.email}"? This cannot be undone.`)) return
// //     await api.admin.deleteEmployee(id)
// //     await load()
// //   }

// //   return (
// //     <Card
// //       title="Employees"
// //       subtitle="Manage employees"
// //       actions={<Button variant="outline" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</Button>}
// //     >
// //       <DataTable
// //         loading={loading}
// //         columns={[
// //           { key:'id', label:'ID', hideBelow:'md' },
// //           { key:'name', label:'Name' },
// //           { key:'email', label:'Email', hideBelow:'md' },
// //           { key:'base_salary', label:'Base Salary', render:(v)=> v ?? '—' },
// //           {
// //             key:'_actions',
// //             label:'Actions',
// //             render:(_,r)=>(
// //               <Button
// //                 className="!px-3 !py-1 bg-rose-600 hover:bg-rose-500 text-white"
// //                 onClick={(e)=>onDeleteEmployee(e,r)}
// //               >
// //                 Delete
// //               </Button>
// //             )
// //           }
// //         ]}
// //         rows={rows}
// //       />
// //     </Card>
// //   )
// // }


// import React, { useEffect, useMemo, useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import DataTable from '../../components/data/DataTable'
// import { api } from '../../lib/api'
// import { toast } from '../../components/ui/Toast'
// import { Input } from '../../components/ui/Input'

// const prettyName = (email) =>
//   (email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—')

// export default function EmployeeAgents() {
//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(false)

//   async function load() {
//     setLoading(true)
//     try {
//       // preferred: overview (includes #customers)
//       let data = await api.employee.agentsOverview().catch(() => null)
//       if (!Array.isArray(data)) {
//         // fallback: bare agents list
//         const list = await api.employee.agents()
//         data = (list || []).map(a => ({
//           agent_id: a.agent_id || a.id,
//           agent_name: a.agent_name || a.name || prettyName(a.agent_email || a.email),
//           agent_email: a.agent_email || a.email,
//           customer_count: 0
//         }))
//       }
//       setRows(data || [])
//     } catch (e) {
//       toast.error(e?.message || 'Failed to load agents')
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => { load() }, [])

//   const columns = useMemo(() => ([
//     { key: 'agent_name', label: 'Name', render: (v, r) => r.agent_name || prettyName(r.agent_email) },
//     { key: 'agent_email', label: 'Email' },
//     { key: 'customer_count', label: '# Customers' },
//     {
//       key: 'actions',
//       label: 'Actions',
//       render: (_v, r) => (
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={() => toast.info(`Agent ID: ${r.agent_id}`)}
//           >
//             View
//           </Button>
//         </div>
//       )
//     }
//   ]), [])

//   return (
//     <Card
//       title="My Agents"
//       subtitle="Agents assigned under you"
//       actions={<Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
//     >
//       <DataTable columns={columns} rows={rows} loading={loading} />
//       <div className="mt-3 text-xs opacity-60">
//         Tip: use “Hire Agent” to add a new agent directly under you.
//       </div>
//     </Card>
//   )
// }


import React, { useEffect, useMemo, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import DataTable from '../../components/data/DataTable'
import { api } from '../../lib/api'
import { toast } from '../../components/ui/Toast'

const prettyName = (email) =>
  (email ? email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : '—')

/* ---------- Details Modal ---------- */
function AgentDetailsModal({ open, id, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open || !id) return
    setLoading(true)
    api.employee.agentSummary(id)
      .then(setData)
      .catch(() => toast.error('Failed to load agent details'))
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
              <div className="kpi">
                <div className="text-xs opacity-70">Sales (total)</div>
                <div className="text-xl font-bold">{data.totals?.sales_count ?? 0}</div>
              </div>
              <div className="kpi">
                <div className="text-xs opacity-70">Premium (total)</div>
                <div className="text-xl font-bold">{data.totals?.total_premium ?? 0}</div>
              </div>
              <div className="kpi">
                <div className="text-xs opacity-70">Commission (total)</div>
                <div className="text-xl font-bold">{data.totals?.total_commission ?? 0}</div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="kpi">
                <div className="text-xs opacity-70">Base Salary</div>
                <div className="text-xl font-bold">₹{data.comp?.base_salary ?? 0}/month</div>
              </div>
              <div className="kpi">
                <div className="text-xs opacity-70">Commission Rate</div>
                <div className="text-xl font-bold">{data.comp?.commission_rate ?? 0}%</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ---------- Page ---------- */
export default function EmployeeAgents() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  // modal state
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  async function load() {
    setLoading(true)
    try {
      // preferred: overview (includes #customers)
      let data = await api.employee.agentsOverview().catch(() => null)
      if (!Array.isArray(data)) {
        // fallback: bare agents list
        const list = await api.employee.agents()
        data = (list || []).map(a => ({
          agent_id: a.agent_id || a.id,
          agent_name: a.agent_name || a.name || prettyName(a.agent_email || a.email),
          agent_email: a.agent_email || a.email,
          customer_count: 0
        }))
      }
      setRows(data || [])
    } catch (e) {
      toast.error(e?.message || 'Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const columns = useMemo(() => ([
    { key: 'agent_name', label: 'Name', render: (v, r) => r.agent_name || prettyName(r.agent_email) },
    { key: 'agent_email', label: 'Email' },
    { key: 'customer_count', label: '# Customers' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_v, r) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              if (!r.agent_id) return toast.error('Missing agent id')
              setSelectedId(r.agent_id)
              setOpen(true)
            }}
          >
            View
          </Button>
        </div>
      )
    }
  ]), [])

  return (
    <>
      <Card
        title="My Agents"
        subtitle="Agents assigned under you"
        actions={<Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
      >
        <DataTable columns={columns} rows={rows} loading={loading} />
        <div className="mt-3 text-xs opacity-60">
          Tip: use “Hire Agent” to add a new agent directly under you.
        </div>
      </Card>

      <AgentDetailsModal open={open} id={selectedId} onClose={() => setOpen(false)} />
    </>
  )
}
