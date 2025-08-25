// // // import React, { useEffect, useState } from 'react'
// // // import Card from '../../components/ui/Card'
// // // import Button from '../../components/ui/Button'
// // // import { Field } from '../../components/ui/Field'
// // // import { Input, Select } from '../../components/ui/Input'
// // // import DataTable from '../../components/data/DataTable'
// // // import { api } from '../../lib/api'

// // // export default function AdminCustomers(){
// // //   const [rows,setRows]=useState([]); const [cid,setCid]=useState(''); const [status,setStatus]=useState('Pending')
// // //   async function load(){ setRows(await api.customers.list()) }
// // //   useEffect(()=>{ load() }, [])
// // //   return <div className="grid gap-6 md:grid-cols-2">
// // //     <Card title="All Customers" actions={<Button variant="outline" onClick={load}>Refresh</Button>}>
// // //       <DataTable columns={[{key:'id',label:'ID'},{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'phone_no',label:'Phone'},{key:'status',label:'Status'}]} rows={rows}/>
// // //     </Card>
// // //     <Card title="Update Customer Status">
// // //       <div className="flex flex-wrap gap-3">
// // //         <Field label="Customer ID"><Input value={cid} onChange={e=>setCid(e.target.value)}/></Field>
// // //         <Field label="Status"><Select value={status} onChange={e=>setStatus(e.target.value)}><option>Pending</option><option>Closed</option><option>Denied</option></Select></Field>
// // //         <Button onClick={()=>api.admin.setCustomerStatus(cid,status)}>Update</Button>
// // //       </div>
// // //     </Card>
// // //   </div>
// // // }


// // import React, { useEffect, useState } from 'react'
// // import Card from '../../components/ui/Card'
// // import Button from '../../components/ui/Button'
// // import { Field } from '../../components/ui/Field'
// // import { Input, Select } from '../../components/ui/Input'
// // import DataTable from '../../components/data/DataTable'
// // import { api } from '../../lib/api'

// // function mask(val, last = 4) {
// //   if (!val) return ''
// //   const s = String(val)
// //   return s.length <= last ? s : '••••' + s.slice(-last)
// // }

// // export default function AdminCustomers(){
// //   const [rows,setRows]=useState([])
// //   const [loading,setLoading]=useState(false)

// //   // status filter
// //   const [filterStatus,setFilterStatus]=useState('')

// //   // status updater
// //   const [cid,setCid]=useState('')
// //   const [status,setStatus]=useState('Pending')

// //   // premium number (admin-only)
// //   const [pcid,setPcid]=useState('')
// //   const [pnum,setPnum]=useState('')

// //   async function load(){
// //     setLoading(true)
// //     try{
// //       const data = await api.admin.customers(filterStatus ? { status: filterStatus } : {})
// //       setRows(Array.isArray(data) ? data : [])
// //     } finally {
// //       setLoading(false)
// //     }
// //   }
// //   useEffect(()=>{ load() }, [filterStatus])

// //   return (
// //     <div className="grid gap-6 md:grid-cols-2">
// //       <Card
// //         title="All Customers"
// //         subtitle="All customers across agents"
// //         actions={
// //           <div className="flex gap-2">
// //             <Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
// //               <option value="">All</option>
// //               <option>Pending</option>
// //               <option>Closed</option>
// //               <option>Denied</option>
// //             </Select>
// //             <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
// //           </div>
// //         }
// //       >
// //         <DataTable
// //           columns={[
// //             {key:'id',label:'ID'},
// //             {key:'name',label:'Name'},
// //             {key:'email',label:'Email'},
// //             {key:'phone_no',label:'Phone'},
// //             {key:'agent_name',label:'Agent', render:(_,row)=>row.agent_name || row.agent_id},
// //             {key:'pan_no',label:'PAN', render:(v)=>mask(v,3)},
// //             {key:'aadhaar_no',label:'Aadhaar', render:(v)=>mask(v,4)},
// //             {key:'age',label:'Age'},
// //             {key:'spouse_name',label:'Spouse'},
// //             {key:'number_of_children',label:'# Kids'},
// //             {key:'parents',label:'Parents', render:(v)=>Array.isArray(v)?v.join(', '):''},
// //             {key:'premium_number',label:'Premium #', render:(v)=>mask(v,4)},
// //             {key:'status',label:'Status'}
// //           ]}
// //           rows={rows}
// //         />
// //       </Card>

// //       <Card title="Update Customer Status">
// //         <div className="flex flex-wrap gap-3">
// //           <Field label="Customer ID"><Input value={cid} onChange={e=>setCid(e.target.value)} /></Field>
// //           <Field label="Status">
// //             <Select value={status} onChange={e=>setStatus(e.target.value)}>
// //               <option>Pending</option><option>Closed</option><option>Denied</option>
// //             </Select>
// //           </Field>
// //           <Button onClick={async()=>{ await api.admin.setCustomerStatus(cid,status); setCid(''); load() }}>
// //             Update
// //           </Button>
// //         </div>
// //       </Card>

// //       <Card title="Set Premium Number">
// //         <div className="flex flex-wrap gap-3">
// //           <Field label="Customer ID"><Input value={pcid} onChange={e=>setPcid(e.target.value)} /></Field>
// //           <Field label="Premium Number "><Input value={pnum} onChange={e=>setPnum(e.target.value)} /></Field>
// //           <Button onClick={async()=>{ await api.admin.setCustomerPremiumNumber(pcid, pnum); setPcid(''); setPnum(''); load() }}>
// //             Save
// //           </Button>
// //         </div>
// //       </Card>
// //     </div>
// //   )
// // }

// import React, { useEffect, useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import { Field } from '../../components/ui/Field'
// import { Input, Select } from '../../components/ui/Input'
// import DataTable from '../../components/data/DataTable'
// import { api } from '../../lib/api'
// import StatusPill from '../../components/ui/StatusPill'

// function mask(val, last = 4) {
//   if (!val) return ''
//   const s = String(val)
//   return s.length <= last ? s : '••••' + s.slice(-last)
// }

// export default function AdminCustomers(){
//   const [rows,setRows]=useState([])
//   const [loading,setLoading]=useState(false)

//   // status filter
//   const [filterStatus,setFilterStatus]=useState('')

//   // status updater
//   const [cid,setCid]=useState('')
//   const [status,setStatus]=useState('Pending')

//   // premium number (admin-only)
//   const [pcid,setPcid]=useState('')
//   const [pnum,setPnum]=useState('')

//   async function load(){
//     setLoading(true)
//     try{
//       const data = await api.admin.customers(filterStatus ? { status: filterStatus } : {})
//       setRows(Array.isArray(data) ? data : [])
//     } finally {
//       setLoading(false)
//     }
//   }
//   useEffect(()=>{ load() }, [filterStatus])

//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       <Card
//         title="All Customers"
//         subtitle="All customers across agents"
//         actions={
//           <div className="flex gap-2">
//             <Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
//               <option value="">All</option>
//               <option>Pending</option>
//               <option>Closed</option>
//               <option>Denied</option>
//             </Select>
//             <Button variant="outline" onClick={load} disabled={loading}>
//               {loading ? 'Loading…' : 'Refresh'}
//             </Button>
//           </div>
//         }
//       >
//         <DataTable
//           columns={[
//             {key:'id',label:'ID'},
//             {key:'name',label:'Name'},
//             {key:'email',label:'Email'},
//             {key:'phone_no',label:'Phone'},
//             {key:'agent_name',label:'Agent', render:(_,row)=>row.agent_name || row.agent_id},
//             {key:'pan_no',label:'PAN', render:(v)=>mask(v,3)},
//             {key:'aadhaar_no',label:'Aadhaar', render:(v)=>mask(v,4)},
//             {key:'age',label:'Age'},
//             {key:'spouse_name',label:'Spouse'},
//             {key:'number_of_children',label:'# Kids'},
//             {key:'parents',label:'Parents', render:(v)=>Array.isArray(v)?v.join(', '):''},
//             {key:'premium_number',label:'Policy No', render:(v)=>mask(v,4)},
//             {key:'status',label:'Status', render:(v)=> <StatusPill value={v} /> },
//           ]}
//           rows={rows}
//         />
//       </Card>

//       <Card title="Update Customer Status">
//         <div className="flex flex-wrap gap-3">
//           <Field label="Customer ID">
//             <Input value={cid} onChange={e=>setCid(e.target.value)} />
//           </Field>
//           <Field label="Status">
//             <Select value={status} onChange={e=>setStatus(e.target.value)}>
//               <option>Pending</option>
//               <option>Closed</option>
//               <option>Denied</option>
//             </Select>
//           </Field>
//           <Button
//             onClick={async()=>{
//               await api.admin.setCustomerStatus(cid,status)
//               setCid('')
//               load()
//             }}
//           >
//             Update
//           </Button>
//                 <Card title="Set Policy Number">
//         <div className="flex flex-wrap gap-3">
//           <Field label="Customer ID">
//             <Input value={pcid} onChange={e=>setPcid(e.target.value)} />
//           </Field>
//           <Field label="Policy Number">
//             <Input value={pnum} onChange={e=>setPnum(e.target.value)} />
//           </Field>
//           <Button
//             onClick={async()=>{
//               await api.admin.setCustomerPremiumNumber(pcid, pnum)
//               setPcid(''); setPnum('')
//               load()
//             }}
//           >
//             Save
//           </Button>
//         </div>
//       </Card>
//         </div>
//       </Card>
//     </div>
//   )
// }
import React, { useEffect, useState, Suspense } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Input, Select } from '../../components/ui/Input'
import DataTable from '../../components/data/DataTable'
import { api } from '../../lib/api'
import ErrorBoundary from '../../components/util/ErrorBoundary'

const CustomerDetails = React.lazy(() => import('../../components/customers/CustomerDetails'))

function mask(val, last = 4) {
  if (!val) return ''
  const s = String(val)
  return s.length <= last ? s : '••••' + s.slice(-last)
}
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

export default function AdminCustomers(){
  const [rows,setRows]=useState([])
  const [loading,setLoading]=useState(false)
  const [err,setErr]=useState('')
  const [filterStatus,setFilterStatus]=useState('')

  // status updater
  const [cid,setCid]=useState('')
  const [status,setStatus]=useState('Pending')

  // premium number
  const [pcid,setPcid]=useState('')
  const [pnum,setPnum]=useState('')

  // details modal
  const [open,setOpen]=useState(false)
  const [selectedId,setSelectedId]=useState(null)

  async function load(){
    setLoading(true); setErr('')
    try{
      const data = await api.admin.customers(filterStatus ? { status: filterStatus } : {})
      setRows(Array.isArray(data) ? data : [])
    }catch(e){
      setErr(e?.message || 'Failed to load customers')
    }finally{
      setLoading(false)
    }
  }
  useEffect(()=>{ load() }, [filterStatus])

  return (
    <ErrorBoundary>
      <div className="grid gap-6 md:grid-cols-2">
        <Card
          title="All Customers"
          subtitle="All customers across agents"
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
          {err && <div className="mb-3 text-sm text-rose-300">{err}</div>}
          <DataTable
            loading={loading}
            onRowClick={(r)=>{ setSelectedId(r.id); setOpen(true) }}
            columns={[
              {key:'id',label:'ID', hideBelow:'md'},
              {key:'name',label:'Name'},
              {key:'email',label:'Email', hideBelow:'md'},
              {key:'phone_no',label:'Phone', hideBelow:'lg'},
              {key:'agent_name',label:'Agent', render:(_,row)=>row.agent_name || row.agent_id},
              {key:'pan_no',label:'PAN', render:(v)=>mask(v,3), hideBelow:'lg'},
              {key:'aadhaar_no',label:'Aadhaar', render:(v)=>mask(v,4), hideBelow:'lg'},
              {key:'age',label:'Age', hideBelow:'lg'},
              {key:'spouse_name',label:'Spouse', hideBelow:'xl'},
              {key:'number_of_children',label:'# Kids', hideBelow:'xl'},
              {key:'parents',label:'Parents', render:(v)=>Array.isArray(v)?v.join(', '):'', hideBelow:'xl'},
              {key:'premium_number',label:'Policy', render:(v)=>mask(v,4), hideBelow:'lg'},
              {key:'status',label:'Status', render:(v)=><StatusBadge v={v}/> }
            ]}
            rows={rows}
          />
          <div className="text-xs opacity-60 mt-2">Tip: Click a row to view full details.</div>
        </Card>

        <Card title="Update Customer Status">
          <div className="flex flex-wrap gap-3">
            <Field label="Customer ID"><Input value={cid} onChange={e=>setCid(e.target.value)} /></Field>
            <Field label="Status">
              <Select value={status} onChange={e=>setStatus(e.target.value)}>
                <option>Pending</option><option>Closed</option><option>Denied</option>
              </Select>
            </Field>
            <Button onClick={async()=>{ await api.admin.setCustomerStatus(cid,status); setCid(''); load() }}>
              Update
            </Button>
            <Card title="Set Policy Number">
          <div className="flex flex-wrap gap-3">
            <Field label="Customer ID"><Input value={pcid} onChange={e=>setPcid(e.target.value)} /></Field>
            <Field label="Policy Number"><Input value={pnum} onChange={e=>setPnum(e.target.value)} /></Field>
            <Button onClick={async()=>{ await api.admin.setCustomerPremiumNumber(pcid, pnum); setPcid(''); setPnum(''); load() }}>
              Save
            </Button>
          </div>
        </Card>
          </div>
        </Card> 
      </div>

      {/* Modal (render only when we have an id) */}
      {open && selectedId && (
        <Suspense fallback={null}>
          <CustomerDetails open={open} onClose={()=>setOpen(false)} id={selectedId} role="admin" />
        </Suspense>
      )}
    </ErrorBoundary>
  )
}
