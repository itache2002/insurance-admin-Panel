import React, { useEffect, useState } from 'react'
import { http } from '../../lib/api'

export default function Profile() {
  const [form, setForm] = useState({ name:'', email:'', phone_no:'' })
  const [me, setMe] = useState(null)

  useEffect(()=>{ (async()=>{
    const m = await http('/api/agent/me'); setMe(m)
    setForm({ name:m.name, email:m.email, phone_no:m.phone_no })
  })() }, [])

  function onChange(e){ setForm(f=>({...f, [e.target.name]: e.target.value })) }

  async function save(e){
    e.preventDefault()
    const updated = await http('/api/agent/me', { method:'PUT', body: form })
    setMe(updated)
    alert('Profile updated')
  }

  return (
    <div className="grid gap-6">
      <div className="card space-y-2">
        <div className="text-lg font-semibold">My Compensation</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="kpi"><div className="text-sm text-muted">Salary</div><div className="text-2xl">₹{me?.base_salary || 0}</div></div>
          <div className="kpi"><div className="text-sm text-muted">Incentive Rate</div><div className="text-2xl">{me?.incentive_rate || 0}</div></div>
        </div>
      </div>

      <form onSubmit={save} className="card space-y-4">
        <div className="text-lg font-semibold">Edit Profile</div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field name="name" label="Name" value={form.name} onChange={onChange} />
          <Field name="email" label="Email" value={form.email} onChange={onChange} />
          <Field name="phone_no" label="Phone" value={form.phone_no} onChange={onChange} />
        </div>
        <button className="btn">Save Changes</button>
      </form>
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
