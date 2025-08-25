// // import React, { useState } from 'react'
// // import Card from '../../components/ui/Card'
// // import Button from '../../components/ui/Button'
// // import DataTable from '../../components/data/DataTable'
// // import { Field } from '../../components/ui/Field'
// // import { Input } from '../../components/ui/Input'
// // import { api } from '../../lib/api'

// // function mask(val, last = 4) {
// //   if (!val) return ''
// //   const s = String(val)
// //   return s.length <= last ? s : '••••' + s.slice(-last)
// // }

// // export default function AgentCustomers(){
// //   const [rows,setRows]=useState([])
// //   const [form,setForm]=useState({
// //     name:'', email:'', phone_no:'',
// //     pan_no:'', aadhaar_no:'',
// //     age:'', spouse_name:'', number_of_children:'',
// //     parents_text:''
// //     // ❌ premium_number removed (admin-only)
// //   })

// //   async function add(){
// //     if(!form.name){ alert('Name is required'); return }
// //     if(form.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan_no)) { alert('Invalid PAN'); return }
// //     if(form.aadhaar_no && !/^[0-9]{12}$/.test(form.aadhaar_no)) { alert('Invalid Aadhaar'); return }
// //     if(form.age && (isNaN(parseInt(form.age)) || parseInt(form.age) < 0 || parseInt(form.age) > 120)){ alert('Invalid age'); return }
// //     if(form.number_of_children && (isNaN(parseInt(form.number_of_children)) || parseInt(form.number_of_children) < 0)){ alert('Invalid number of children'); return }

// //     const payload = {
// //       name: form.name,
// //       email: form.email || undefined,
// //       phone_no: form.phone_no || undefined,
// //       pan_no: form.pan_no || undefined,
// //       aadhaar_no: form.aadhaar_no || undefined,
// //       age: form.age === '' ? undefined : parseInt(form.age,10),
// //       spouse_name: form.spouse_name || undefined,
// //       number_of_children: form.number_of_children === '' ? undefined : parseInt(form.number_of_children,10),
// //       parents: form.parents_text ? form.parents_text.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
// //       // ❌ no premium_number here
// //     }

// //     await api.agent.addCustomer(payload)
// //     setForm({
// //       name:'', email:'', phone_no:'',
// //       pan_no:'', aadhaar_no:'',
// //       age:'', spouse_name:'', number_of_children:'',
// //       parents_text:''
// //     })
// //     setRows(await api.agent.customers())
// //   }

// //   return <div className="grid gap-6 md:grid-cols-2">
// //     <Card title="Add Customer" actions={<Button onClick={add}>Add</Button>}>
// //       <div className="flex flex-wrap gap-3">
// //         <Field label="Name"><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
// //         <Field label="Email"><Input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
// //         <Field label="Phone"><Input value={form.phone_no} onChange={e=>setForm({...form,phone_no:e.target.value})}/></Field>

// //         <Field label="PAN"><Input value={form.pan_no} onChange={e=>setForm({...form,pan_no:e.target.value.toUpperCase()})} placeholder="ABCDE1234F"/></Field>
// //         <Field label="Aadhaar"><Input value={form.aadhaar_no} onChange={e=>setForm({...form,aadhaar_no:e.target.value.replace(/[^0-9]/g,'')})} placeholder="12 digits"/></Field>

// //         <Field label="Age"><Input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></Field>
// //         <Field label="Spouse Name"><Input value={form.spouse_name} onChange={e=>setForm({...form,spouse_name:e.target.value})}/></Field>
// //         <Field label="# Children"><Input type="number" value={form.number_of_children} onChange={e=>setForm({...form,number_of_children:e.target.value})}/></Field>
// //         <Field label="Parents (comma separated)"><Input value={form.parents_text} onChange={e=>setForm({...form,parents_text:e.target.value})} placeholder="e.g. Ramesh, Sita"/></Field>
// //       </div>
// //     </Card>

// //     <Card title="My Customers" actions={<Button variant="outline" onClick={async()=>setRows(await api.agent.customers())}>Refresh</Button>}>
// //       <DataTable
// //         columns={[
// //           {key:'id',label:'ID'},
// //           {key:'name',label:'Name'},
// //           {key:'email',label:'Email'},
// //           {key:'phone_no',label:'Phone'},
// //           {key:'pan_no',label:'PAN', render:(v)=>mask(v,3)},
// //           {key:'aadhaar_no',label:'Aadhaar', render:(v)=>mask(v,4)},
// //           {key:'age',label:'Age'},
// //           {key:'spouse_name',label:'Spouse'},
// //           {key:'number_of_children',label:'# Kids'},
// //           {key:'parents',label:'Parents', render:(v)=>Array.isArray(v)?v.join(', '):''},
// //           {key:'premium_number',label:'Premium #', render:(v)=>mask(v,4)},  // read-only display
// //           {key:'status',label:'Status'}
// //         ]}
// //         rows={rows}
// //       />
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
// import StatusPill from '../../components/ui/StatusPill'

// function mask(val, last = 4) {
//   if (!val) return ''
//   const s = String(val)
//   return s.length <= last ? s : '••••' + s.slice(-last)
// }

// export default function AgentCustomers(){
//   const [rows,setRows]=useState([])
//   const [filterStatus, setFilterStatus] = useState('')

//   const [form,setForm]=useState({
//     name:'', email:'', phone_no:'',
//     pan_no:'', aadhaar_no:'',
//     age:'', spouse_name:'', number_of_children:'',
//     parents_text:''
//     // ❌ premium_number is admin-only
//   })

//   async function load(){
//     const data = await api.agent.customers(filterStatus || '')
//     setRows(Array.isArray(data) ? data : [])
//   }
//   useEffect(()=>{ load() }, [filterStatus])

//   async function add(){
//     if(!form.name){ alert('Name is required'); return }
//     if(form.pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.pan_no)) { alert('Invalid PAN'); return }
//     if(form.aadhaar_no && !/^[0-9]{12}$/.test(form.aadhaar_no)) { alert('Invalid Aadhaar'); return }
//     if(form.age && (isNaN(parseInt(form.age)) || parseInt(form.age) < 0 || parseInt(form.age) > 120)){ alert('Invalid age'); return }
//     if(form.number_of_children && (isNaN(parseInt(form.number_of_children)) || parseInt(form.number_of_children) < 0)){ alert('Invalid number of children'); return }

//     const payload = {
//       name: form.name,
//       email: form.email || undefined,
//       phone_no: form.phone_no || undefined,
//       pan_no: form.pan_no || undefined,
//       aadhaar_no: form.aadhaar_no || undefined,
//       age: form.age === '' ? undefined : parseInt(form.age,10),
//       spouse_name: form.spouse_name || undefined,
//       number_of_children: form.number_of_children === '' ? undefined : parseInt(form.number_of_children,10),
//       parents: form.parents_text ? form.parents_text.split(',').map(s=>s.trim()).filter(Boolean) : undefined,
//       // ❌ no premium_number here
//     }

//     await api.agent.addCustomer(payload)
//     setForm({
//       name:'', email:'', phone_no:'',
//       pan_no:'', aadhaar_no:'',
//       age:'', spouse_name:'', number_of_children:'',
//       parents_text:''
//     })
//     load()
//   }

//   return (
//     <div className="grid gap-6 md:grid-cols-2">
//       <Card title="Add Customer" actions={<Button onClick={add}>Add</Button>}>
//         <div className="flex flex-wrap gap-3">
//           <Field label="Name"><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
//           <Field label="Email"><Input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
//           <Field label="Phone"><Input value={form.phone_no} onChange={e=>setForm({...form,phone_no:e.target.value})}/></Field>

//           <Field label="PAN"><Input value={form.pan_no} onChange={e=>setForm({...form,pan_no:e.target.value.toUpperCase()})} placeholder="ABCDE1234F"/></Field>
//           <Field label="Aadhaar"><Input value={form.aadhaar_no} onChange={e=>setForm({...form,aadhaar_no:e.target.value.replace(/[^0-9]/g,'')})} placeholder="12 digits"/></Field>

//           <Field label="Age"><Input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></Field>
//           <Field label="Spouse Name"><Input value={form.spouse_name} onChange={e=>setForm({...form,spouse_name:e.target.value})}/></Field>
//           <Field label="# Children"><Input type="number" value={form.number_of_children} onChange={e=>setForm({...form,number_of_children:e.target.value})}/></Field>
//           <Field label="Parents (comma separated)"><Input value={form.parents_text} onChange={e=>setForm({...form,parents_text:e.target.value})} placeholder="e.g. Ramesh, Sita"/></Field>
//         </div>
//       </Card>

//       <Card
//         title="My Customers"
//         actions={
//           <div className="flex gap-2">
//             <Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}>
//               <option value="">All</option>
//               <option>Pending</option>
//               <option>Closed</option>
//               <option>Denied</option>
//             </Select>
//             <Button variant="outline" onClick={load}>Refresh</Button>
//           </div>
//         }
//       >
//         <DataTable
//           columns={[
//             {key:'id',label:'ID'},
//             {key:'name',label:'Name'},
//             {key:'email',label:'Email'},
//             {key:'phone_no',label:'Phone'},
//             {key:'pan_no',label:'PAN', render:(v)=>mask(v,3)},
//             {key:'aadhaar_no',label:'Aadhaar', render:(v)=>mask(v,4)},
//             {key:'age',label:'Age'},
//             {key:'spouse_name',label:'Spouse'},
//             {key:'number_of_children',label:'# Kids'},
//             {key:'parents',label:'Parents', render:(v)=>Array.isArray(v)?v.join(', '):''},
//             {key:'premium_number',label:'Premium #', render:(v)=>mask(v,4)}, // read-only
//             {key:'status',label:'Status', render:(v)=> <StatusPill value={v} /> },
//           ]}
//           rows={rows}
//         />
//       </Card>
//     </div>
//   )
// }



import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import DataTable from '../../components/data/DataTable'
import { Field } from '../../components/ui/Field'
import { Input, Select } from '../../components/ui/Input'
import Alert from '../../components/ui/Alert'
import { api } from '../../lib/api'

function mask(val, last = 4) {
  if (!val) return ''
  const s = String(val)
  return s.length <= last ? s : '••••' + s.slice(-last)
}
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]$/
const AADHAAR_RE = /^[0-9]{12}$/

export default function AgentCustomers(){
  const [rows,setRows]=useState([])
  const [errorMsg, setErrorMsg] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [form,setForm]=useState({
    name:'', email:'', phone_no:'',
    pan_no:'', aadhaar_no:'',
    age:'', spouse_name:'', number_of_children:'',
    parents_text:''
  })

  async function load(){
    setErrorMsg('')
    setRows(await api.agent.customers(statusFilter || undefined))
  }

  async function add(){
    setErrorMsg('')
    if(!form.name){ setErrorMsg('Name is required'); return }
    if(form.pan_no && !PAN_RE.test(form.pan_no)) { setErrorMsg('Invalid PAN (format ABCDE1234F)'); return }
    if(form.aadhaar_no && !AADHAAR_RE.test(form.aadhaar_no)) { setErrorMsg('Invalid Aadhaar (12 digits)'); return }
    if(form.age && (isNaN(parseInt(form.age)) || parseInt(form.age) < 0 || parseInt(form.age) > 120)){ setErrorMsg('Invalid age'); return }
    if(form.number_of_children && (isNaN(parseInt(form.number_of_children)) || parseInt(form.number_of_children) < 0)){ setErrorMsg('Invalid number of children'); return }

    const payload = {
      name: form.name,
      email: form.email || undefined,
      phone_no: form.phone_no || undefined,
      pan_no: form.pan_no || undefined,
      aadhaar_no: form.aadhaar_no || undefined,
      age: form.age === '' ? undefined : parseInt(form.age,10),
      spouse_name: form.spouse_name || undefined,
      number_of_children: form.number_of_children === '' ? undefined : parseInt(form.number_of_children,10),
      parents: form.parents_text
        ? form.parents_text.replace(/[\{\}\[\]"]/g, '').split(',').map(s=>s.trim()).filter(Boolean)
        : undefined,
      // premium_number is admin-only
    }

    try{
      await api.agent.addCustomer(payload)
      setForm({
        name:'', email:'', phone_no:'',
        pan_no:'', aadhaar_no:'',
        age:'', spouse_name:'', number_of_children:'',
        parents_text:''
      })
      await load()
    }catch(e){
      if (e?.status === 409) setErrorMsg(e.message || 'Duplicate value')
      else setErrorMsg(e.message || 'Failed to add customer')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card
        title="Add Customer"
        subtitle="Aadhaar & PAN must be valid. Premium number is set by Admin."
        actions={<Button onClick={add}>Add</Button>}
      >
        {errorMsg && <Alert>{errorMsg}</Alert>}

        <div className="flex flex-wrap gap-3">
          <Field label="Name"><Input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
          <Field label="Email"><Input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
          <Field label="Phone"><Input value={form.phone_no} onChange={e=>setForm({...form,phone_no:e.target.value})}/></Field>

          <Field label="PAN"><Input value={form.pan_no} onChange={e=>setForm({...form,pan_no:e.target.value.toUpperCase()})} placeholder="ABCDE1234F"/></Field>
          <Field label="Aadhaar"><Input value={form.aadhaar_no} onChange={e=>setForm({...form,aadhaar_no:e.target.value.replace(/[^0-9]/g,'')})} placeholder="12 digits"/></Field>

          <Field label="Age"><Input type="number" value={form.age} onChange={e=>setForm({...form,age:e.target.value})}/></Field>
          <Field label="Spouse Name"><Input value={form.spouse_name} onChange={e=>setForm({...form,spouse_name:e.target.value})}/></Field>
          <Field label="# Children"><Input type="number" value={form.number_of_children} onChange={e=>setForm({...form,number_of_children:e.target.value})}/></Field>
          <Field label="Parents (comma separated)">
            <Input value={form.parents_text} onChange={e=>setForm({...form,parents_text:e.target.value})} placeholder="e.g. Ramesh, Sita"/>
          </Field>
        </div>
      </Card>

      <Card
        title="My Customers"
        actions={
          <div className="flex gap-2">
            <Select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
              <option value="">All</option>
              <option>Pending</option>
              <option>Closed</option>
              <option>Denied</option>
            </Select>
            <Button variant="outline" onClick={load}>Refresh</Button>
          </div>
        }
      >
        <DataTable
          columns={[
            {key:'id',label:'ID'},
            {key:'name',label:'Name'},
            {key:'email',label:'Email'},
            {key:'phone_no',label:'Phone'},
            {key:'pan_no',label:'PAN', render:(v)=>mask(v,3)},
            {key:'aadhaar_no',label:'Aadhaar', render:(v)=>mask(v,4)},
            {key:'age',label:'Age'},
            {key:'spouse_name',label:'Spouse'},
            {key:'number_of_children',label:'# Kids'},
            {key:'parents',label:'Parents', render:(v)=>Array.isArray(v)?v.join(', '):''},
            {key:'premium_number',label:' Policy No', render:(v)=>mask(v,4)},
            {
              key:'status', label:'Status',
              render:(v)=>(
                <span className={
                  'px-2 py-0.5 rounded-full text-xs font-medium ' +
                  (v==='Closed' ? 'bg-green-500/15 text-green-300 border border-green-500/30' :
                   v==='Pending' ? 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30' :
                                   'bg-red-500/15 text-red-300 border border-red-500/30')
                }>{v}</span>
              )
            }
          ]}
          rows={rows}
        />
      </Card>
    </div>
  )
}
