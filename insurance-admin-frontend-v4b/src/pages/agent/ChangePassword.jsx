import React, { useState } from 'react'
import { http } from '../../lib/api'

export default function ChangePassword() {
  const [old_password, setOld] = useState('')
  const [new_password, setNew] = useState('')
  const [msg, setMsg] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setMsg('')
    try {
      await http('/api/agent/change-password', { method:'POST', body:{ old_password, new_password } })
      setMsg('Password changed. You can continue using the app.')
      setOld(''); setNew('')
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <div className="card max-w-lg">
      <div className="text-lg font-semibold mb-4">Change Password</div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="label">Current Password</label>
          <input className="input" type="password" value={old_password} onChange={e=>setOld(e.target.value)} />
        </div>
        <div>
          <label className="label">New Password</label>
          <input className="input" type="password" value={new_password} onChange={e=>setNew(e.target.value)} />
        </div>
        <button className="btn">Update Password</button>
      </form>
      {msg && <div className="mt-3 text-sm text-muted">{msg}</div>}
    </div>
  )
}
