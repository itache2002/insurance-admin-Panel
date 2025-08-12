import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('StrongPass#123')
  const [err, setErr] = useState('')

  async function onSubmit(e){
    e.preventDefault()
    setErr('')
    try {
      const user = await login(email, password)
      if (user.role === 'admin') nav('/admin/dashboard')
      else nav('/agent/dashboard')
    } catch (e) {
      setErr(e.message)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="card w-full max-w-md space-y-4">
        <div className="text-2xl font-semibold">Sign in</div>
        {err && <div className="text-sm text-red-400">{err}</div>}
        <div>
          <label className="label">Email</label>
          <input className="input" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com" />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn w-full" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
      </form>
    </div>
  )
}
