// src/pages/employee/HireAgent.jsx
import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { toast } from '../../components/ui/Toast'

export default function HireAgent() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    // basic
    name: '', email: '', phone_no: '',
    // kyc
    pan_no: '', aadhaar_no: '',
    // bank
    bank_name: '', bank_ifsc: '', bank_account_no: '',
    // education
    edu_10: '', edu_12: '', edu_degree: '',
  })

  const set = (k) => (e) => setForm(s => ({ ...s, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.email) { toast.error('Email is required'); return }
    setLoading(true)
    try {
      const { user, temp_password } = await api.employee.addAgent(form)
      setResult({ id: user?.id, email: user?.email, temp_password })
      toast.success('Agent created under you')
      // optional: keep values, or reset basics
      setForm(s => ({ ...s, name: '', email: '', phone_no: '' }))
    } catch (err) {
      // api layer already toasts; no-op
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card
        title="Add New Agent (Full Details)"
        subtitle="Agent will be assigned under you. Share the temporary password only once."
        actions={<Button onClick={submit} disabled={loading}>{loading ? 'Creating…' : 'Create Agent'}</Button>}
      >
        <form onSubmit={submit} className="space-y-6">
          {/* Basic */}
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Name"><Input value={form.name} onChange={set('name')} /></Field>
            <Field label="Email"><Input value={form.email} onChange={set('email')} type="email" /></Field>
            <Field label="Phone"><Input value={form.phone_no} onChange={set('phone_no')} /></Field>
          </div>

          {/* KYC */}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="PAN"><Input placeholder="ABCDE1234F"value={form.pan_no}className="uppercase"maxLength={10}onChange={set('pan_no', v => v.replace(/[^a-z0-9]/gi,'').toUpperCase().slice(0,10))}/></Field>
            <Field label="Aadhaar"><Input placeholder="12 digits" value={form.aadhaar_no} onChange={set('aadhaar_no')} /></Field>
          </div>

          {/* Bank */}
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Bank Name"><Input value={form.bank_name} onChange={set('bank_name')} /></Field>
            <Field label="IFSC"><Input value={form.bank_ifsc} onChange={set('bank_ifsc')} /></Field>
            <Field label="Account #"><Input value={form.bank_account_no} onChange={set('bank_account_no')} /></Field>
          </div>

          {/* Education */}
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Class 10"><Input value={form.edu_10} onChange={set('edu_10')} /></Field>
            <Field label="Class 12"><Input value={form.edu_12} onChange={set('edu_12')} /></Field>
            <Field label="Degree"><Input value={form.edu_degree} onChange={set('edu_degree')} /></Field>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading}>{loading ? 'Creating…' : 'Create Agent'}</Button>
          </div>
        </form>
      </Card>

      {/* Result panel */}
      {result && (
        <Card title="Agent Created">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="kpi"><div className="text-xs opacity-70">Agent ID</div><div className="text-sm font-mono break-all">{result.id}</div></div>
            <div className="kpi"><div className="text-xs opacity-70">Email</div><div className="text-sm">{result.email}</div></div>
            <div className="kpi">
              <div className="text-xs opacity-70">Temp Password</div>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-slate-800">{result.temp_password}</code>
                <Button
                  variant="outline"
                  onClick={() => navigator.clipboard.writeText(result.temp_password)}
                >Copy</Button>
              </div>
              <div className="mt-2 text-xs opacity-70">
                Share it **only once**. The agent must change the password at first login.
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
