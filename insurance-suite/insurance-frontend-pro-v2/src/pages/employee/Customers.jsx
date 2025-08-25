// // import React, { useState } from 'react'
// // import Card from '../../components/ui/Card'
// // import Button from '../../components/ui/Button'
// // import DataTable from '../../components/data/DataTable'
// // import { Field } from '../../components/ui/Field'
// // import { Input, Select } from '../../components/ui/Input'
// // import { api } from '../../lib/api'
// // export default function EmployeeCustomers(){
// //   const [rows,setRows]=useState([]); const [cid,setCid]=useState(''); const [status,setStatus]=useState('Closed')
// //   return <div className="grid gap-6 md:grid-cols-2">
// //     <Card title="Customers Under My Agents" actions={<Button variant="outline" onClick={async()=>setRows(await api.employee.customers())}>Refresh</Button>}>
// //       <DataTable columns={[{key:'id',label:'ID'},{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'phone_no',label:'Phone'},{key:'status',label:'Status'}]} rows={rows}/>
// //     </Card>
// //     <Card title="Update Customer Status">
// //       <div className="flex flex-wrap gap-3">
// //         <Field label="Customer ID"><Input value={cid} onChange={e=>setCid(e.target.value)} /></Field>
// //         <Field label="Status"><Select value={status} onChange={e=>setStatus(e.target.value)}><option>Pending</option><option>Closed</option><option>Denied</option></Select></Field>
// //         <Button onClick={()=>api.employee.setCustomerStatus(cid,status)}>Update</Button>
// //       </div>
// //     </Card>
// //   </div>
// // }



// import React, { useEffect, useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import DataTable from '../../components/data/DataTable'
// import { Field } from '../../components/ui/Field'
// import { Input, Select } from '../../components/ui/Input'
// import { api } from '../../lib/api'

// function StatusPill({ value }) {
//   const cls =
//     value === 'Closed'
//       ? 'bg-green-500/20 text-green-300 ring-1 ring-green-500/30'
//       : value === 'Pending'
//       ? 'bg-yellow-500/20 text-yellow-300 ring-1 ring-yellow-500/30'
//       : 'bg-red-500/20 text-red-300 ring-1 ring-red-500/30' // Denied / anything else
//   return (
//     <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
//       {value}
//     </span>
//   )
// }

// export default function EmployeeCustomers(){
//   const [rows,setRows]=useState([])
//   const [loading,setLoading]=useState(false)

//   // filters / search
//   const [search,setSearch]=useState('')
//   const [filterStatus,setFilterStatus]=useState('')

//   // updater
//   const [cid,setCid]=useState('')
//   const [status,setStatus]=useState('Closed')

//   async function load(){
//     setLoading(true)
//     try{
//       // Fetch ALL customers under my agents (server supports optional ?status but API helper returns all)
//       const data = await api.employee.customers()
//       setRows(Array.isArray(data) ? data : [])
//     } finally { setLoading(false) }
//   }
//   useEffect(()=>{ load() }, [])

//   const filtered = rows.filter(r=>{
//     const s = search.trim().toLowerCase()
//     const matchSearch = !s || [r.name, r.email, r.phone_no].some(x => (x||'').toLowerCase().includes(s))
//     const matchStatus = !filterStatus || r.status === filterStatus
//     return matchSearch && matchStatus
//   })

//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       <Card
//         title="Customers Under My Agents"
//         actions={<Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>}
//       >
//         <div className="flex gap-2 mb-3">
//           <Input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)} />
//           <Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
//             <option value="">All</option>
//             <option>Pending</option>
//             <option>Closed</option>
//             <option>Denied</option>
//           </Select>
//         </div>

//         <DataTable
//           columns={[
//             { key:'id', label:'ID' },
//             { key:'name', label:'Name' },
//             { key:'email', label:'Email' },
//             { key:'phone_no', label:'Phone' },
//             { key:'status', label:'Status', render:(v)=> <StatusPill value={v} /> },
//           ]}
//           rows={filtered}
//         />
//       </Card>

//       <Card title="Update Customer Status">
//         <div className="flex flex-wrap gap-3">
//           <Field label="Customer ID"><Input value={cid} onChange={e=>setCid(e.target.value)} /></Field>
//           <Field label="Status">
//             <Select value={status} onChange={e=>setStatus(e.target.value)}>
//               <option>Closed</option>
//               <option>Pending</option>
//               <option>Denied</option>
//             </Select>
//           </Field>
//           <Button onClick={async()=>{
//             if(!cid) return
//             await api.employee.setCustomerStatus(cid, status)
//             setCid('')
//             await load()
//           }}>
//             Update
//           </Button>
//         </div>
//       </Card>
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Select } from '../../components/ui/Input'
import DataTable from '../../components/data/DataTable'
import { api } from '../../lib/api'
import CustomerDetails from '../../components/customers/CustomerDetails'

const StatusBadge = ({ v }) => {
  const s = String(v || '').toLowerCase()
  const map = {
    closed: 'bg-emerald-600/20 text-emerald-300 border-emerald-600/40',
    pending: 'bg-amber-600/20 text-amber-300 border-amber-600/40',
    denied: 'bg-rose-600/20 text-rose-300 border-rose-600/40'
  }
  const cls = map[s] || 'bg-slate-700/40 text-slate-200 border-slate-600/40'
  return <span className={`px-2 py-0.5 rounded-full text-xs border ${cls}`}>{v}</span>
}

export default function EmployeeCustomers(){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('')

  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState(null)

  async function load(){
    setLoading(true)
    try {
      const qs = filterStatus ? `?status=${encodeURIComponent(filterStatus)}` : ''
      const data = await api.employee.customers(qs)
      setRows(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }
  useEffect(()=>{ load() }, [filterStatus])

  return (
    <>
      <Card
        title="Customers (Under My Agents)"
        subtitle="Click a row to see full details"
        actions={
          <div className="flex gap-2">
            <Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
              <option value="">All</option>
              <option>Pending</option>
              <option>Closed</option>
              <option>Denied</option>
            </Select>
            <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
          </div>
        }
      >
        <DataTable
          loading={loading}
          onRowClick={(r)=>{ setSelectedId(r.id); setOpen(true) }}
          columns={[
            { key:'id', label:'ID', hideBelow:'md' },
            { key:'name', label:'Name' },
            { key:'email', label:'Email', hideBelow:'md' },
            { key:'phone_no', label:'Phone', hideBelow:'lg' },
            { key:'agent_name', label:'Agent', hideBelow:'md' },
            { key:'status', label:'Status', render:(v)=><StatusBadge v={v}/> },
          ]}
          rows={rows}
        />
      </Card>

      <CustomerDetails
        open={open}
        onClose={()=>setOpen(false)}
        id={selectedId}
        role="employee"
      />
    </>
  )
}
