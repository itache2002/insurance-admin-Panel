import React, { useEffect, useState } from 'react'
import { http } from '../../lib/api'

export default function Admins() {
  const [form, setForm] = useState({ name:'', email:'', phone_no:'', password:'' })
  const [admins, setAdmins] = useState([])

  async function load(){
    setAdmins(await http('/api/admin/admins'))
  }
  useEffect(()=>{ load() }, [])

  function onChange(e){ setForm(f=>({...f, [e.target.name]: e.target.value})) }

  async function create(e){
    e.preventDefault()
    await http('/api/admin/admins', { method:'POST', body: form })
    setForm({ name:'', email:'', phone_no:'', password:'' })
    await load()
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={create} className="card space-y-4">
        <div className="text-lg font-semibold">Add Admin</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="name" label="Name" value={form.name} onChange={onChange} />
          <Field name="email" label="Email" value={form.email} onChange={onChange} />
          <Field name="phone_no" label="Phone" value={form.phone_no} onChange={onChange} />
          <Field name="password" label="Password" value={form.password} onChange={onChange} />
        </div>
        <button className="btn">Create Admin</button>
      </form>

      <div className="card">
        <div className="text-lg font-semibold mb-4">All Admins</div>
        <table className="table">
          <thead>
            <tr>
              <th className="th">Name</th>
              <th className="th">Email</th>
              <th className="th">Phone</th>
              <th className="th">Created</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(a => (
              <tr key={a.id}>
                <td className="td">{a.name}</td>
                <td className="td">{a.email}</td>
                <td className="td">{a.phone_no}</td>
                <td className="td">{new Date(a.created_at).toLocaleString()}</td>
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
