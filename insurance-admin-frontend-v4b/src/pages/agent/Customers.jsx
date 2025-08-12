// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'

// const init = {
//   name:'', age:'', defenders_like:'', number_of_children:'',
//   spouse:'', parents:'', status:'pending', aadhaar_number:'', pan_number:''
// }

// export default function Customers() {
//   const [form, setForm] = useState(init)
//   const [rows, setRows] = useState([])

//   function onChange(e){ setForm(f=>({...f, [e.target.name]: e.target.value})) }

//   async function create(e){
//     e.preventDefault()
//     const payload = {
//       ...form,
//       age: form.age ? Number(form.age) : undefined,
//       number_of_children: form.number_of_children ? Number(form.number_of_children) : undefined
//     }
//     await http('/api/agent/customers', { method:'POST', body: payload })
//     setForm(init)
//     await load()
//     alert('Customer added!')
//   }

//   async function load(){ setRows(await http('/api/agent/customers')) }
//   useEffect(()=>{ load() }, [])

//   return (
//     <div className="grid gap-6">
//       <form onSubmit={create} className="card space-y-4">
//         <div className="text-lg font-semibold">Add Customer</div>
//         <div className="grid sm:grid-cols-2 gap-4">
//           <Field name="name" label="Name" value={form.name} onChange={onChange} />
//           <Field name="age" label="Age" value={form.age} onChange={onChange} />
//           <Field name="defenders_like" label="Defenders Like" value={form.defenders_like} onChange={onChange} />
//           <Field name="number_of_children" label="No. of Children" value={form.number_of_children} onChange={onChange} />
//           <Field name="spouse" label="Spouse" value={form.spouse} onChange={onChange} />
//           <Field name="parents" label="Parents" value={form.parents} onChange={onChange} />
//           <div>
//             <label className="label">Status</label>
//             <select className="input select" name="status" value={form.status} onChange={onChange}>
//               <option value="pending">Pending</option>
//             </select>
//           </div>
//           <Field name="aadhaar_number" label="Aadhaar" value={form.aadhaar_number} onChange={onChange} />
//           <Field name="pan_number" label="PAN" value={form.pan_number} onChange={onChange} />
//         </div>
//         <button className="btn">Add Customer</button>
//       </form>

//       <div className="card">
//         <div className="text-lg font-semibold mb-4">My Customers</div>
//         <table className="table">
//           <thead>
//             <tr>
//               <th className="th">Name</th>
//               <th className="th">Status</th>
//               <th className="th">Created</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map(r => (
//               <tr key={r.id}>
//                 <td className="td">{r.name}</td>
//                 <td className="td"><span className={`badge badge-${r.status}`}>{r.status}</span></td>
//                 <td className="td">{new Date(r.created_at).toLocaleString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
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




import React, { useEffect, useState } from 'react'
import { http } from '../../lib/api'

const init = {
  name:'', age:'', defenders_like:'', number_of_children:'',
  spouse:'', parents:'', aadhaar_number:'', pan_number:''
  // status is not editable by agent; always 'pending' on create
}

export default function Customers() {
  const [form, setForm] = useState(init)
  const [rows, setRows] = useState([])

  function onChange(e){ setForm(f=>({...f, [e.target.name]: e.target.value})) }

  async function create(e){
    e.preventDefault()
    const payload = {
      ...form,
      // enforce pending regardless of any client value
      status: 'pending',
      age: form.age ? Number(form.age) : undefined,
      number_of_children: form.number_of_children ? Number(form.number_of_children) : undefined
    }
    await http('/api/agent/customers', { method:'POST', body: payload })
    setForm(init)
    await load()
    alert('Customer added with status: pending')
  }

  async function load(){ setRows(await http('/api/agent/customers')) }
  useEffect(()=>{ load() }, [])

  return (
    <div className="grid gap-6">
      <form onSubmit={create} className="card space-y-4">
        <div className="text-lg font-semibold">Add Customer</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="name" label="Name" value={form.name} onChange={onChange} />
          <Field name="age" label="Age" value={form.age} onChange={onChange} />
          <Field name="defenders_like" label="Defenders Like" value={form.defenders_like} onChange={onChange} />
          <Field name="number_of_children" label="No. of Children" value={form.number_of_children} onChange={onChange} />
          <Field name="spouse" label="Spouse" value={form.spouse} onChange={onChange} />
          <Field name="parents" label="Parents" value={form.parents} onChange={onChange} />

          {/* Read-only status display (always pending) */}
          <div>
            <label className="label">Status</label>
            <div className="kpi">
              <div className="text-sm text-muted">New customers are created as</div>
              <div><span className="badge badge-pending">pending</span></div>
            </div>
          </div>

          <Field name="aadhaar_number" label="Aadhaar" value={form.aadhaar_number} onChange={onChange} />
          <Field name="pan_number" label="PAN" value={form.pan_number} onChange={onChange} />
        </div>
        <button className="btn">Add Customer</button>
      </form>

      <div className="card">
        <div className="text-lg font-semibold mb-4">My Customers</div>
        <table className="table">
          <thead>
            <tr>
              <th className="th">Name</th>
              <th className="th">Status</th>
              <th className="th">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td className="td">{r.name}</td>
                <td className="td"><span className={`badge badge-${r.status}`}>{r.status}</span></td>
                <td className="td">{new Date(r.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
