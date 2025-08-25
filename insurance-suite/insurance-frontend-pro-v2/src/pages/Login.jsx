import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { ShieldCheck } from 'lucide-react'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const nav = useNavigate()
  const { login, loading, error } = useAuth()

  async function submit(e){ e.preventDefault(); const ok = await login(email,password); if(ok) nav('/') }

  return <div className="min-h-screen grid place-items-center p-4 relative overflow-hidden">
    <div className="absolute inset-0 bg-grad-1 pointer-events-none"></div>
    <form onSubmit={submit} className="glass w-full max-w-md p-8 rounded-2xl shadow-soft space-y-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent2 shadow-glow mb-1"><ShieldCheck size={22}/></div>
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm opacity-80">Sign in to your account</p>
      </div>
      <label className="block"><div className="text-sm mb-1">Email</div><Input value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label>
      <label className="block"><div className="text-sm mb-1">Password</div><Input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/></label>
      {error && <div className="text-sm text-red-400">{error}</div>}
      <Button type="submit" className="w-full">{loading? 'Signing in...' : 'Sign In'}</Button>
    </form>
  </div>
}
