// import React, { useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import { Field } from '../../components/ui/Field'
// import { Input, Select } from '../../components/ui/Input'
// import { api } from '../../lib/api'

// function SectionTitle({ children }) {
//   return <div className="text-sm font-semibold opacity-80 mb-2">{children}</div>
// }

// export default function Hire() {
//   const [mode, setMode] = useState('employee') // 'employee' | 'agent'

//   // common
//   const [name, setName] = useState('')
//   const [email, setEmail] = useState('')
//   const [phone, setPhone] = useState('')

//   // agent-only
//   const [supervisorId, setSupervisorId] = useState('')

//   // profile/bank/edu
//   const [bank, setBank] = useState({ bank_name: '', bank_ifsc: '', bank_account_no: '' })
//   const [edu, setEdu] = useState({ edu_10: '', edu_12: '', edu_degree: '' })

//   const [saving, setSaving] = useState(false)
//   const [result, setResult] = useState(null) // { id, temp_password }

//   function resetAll() {
//     setName(''); setEmail(''); setPhone('');
//     setSupervisorId('');
//     setBank({ bank_name: '', bank_ifsc: '', bank_account_no: '' })
//     setEdu({ edu_10: '', edu_12: '', edu_degree: '' })
//     setResult(null)
//   }

//   async function resolveUserIdByEmail(maybeId, email) {
//     if (maybeId) return maybeId
//     const users = await api.admin.users()
//     const found = users.find(u => (u.email || '').toLowerCase() === email.toLowerCase())
//     return found?.id
//   }

//   async function hire() {
//     if (!name || !email) {
//       alert('Name and Email are required.'); 
//       return
//     }
//     setSaving(true); setResult(null)
//     try {
//       if (mode === 'agent') {
//         // 1) create base user (agent)
//         const createRes = await api.admin.createUser({
//           role: 'agent',
//           name,
//           email,
//           phone_no: phone,
//           employee_supervisor_id: supervisorId || undefined,
//         })
//         const temp_password = createRes?.temp_password
//         const createdId = await resolveUserIdByEmail(createRes?.id || createRes?.user_id, email)

//         if (!createdId) throw new Error('Could not resolve new agent user ID')

//         // 2) optional: set supervisor if provided (in case your backend separates it)
//         if (supervisorId) {
//           await api.admin.setAgentSupervisor(createdId, supervisorId)
//         }

//         // 3) upserts: profile, bank, education
//         await api.admin.upsertAgentProfile(createdId, { name, email, phone_no: phone })
//         await api.admin.upsertAgentBank(createdId, bank)
//         await api.admin.upsertAgentEducation(createdId, edu)

//         setResult({ id: createdId, temp_password })
//       } else {
//         // EMPLOYEE flow
//         const createRes = await api.admin.createUser({
//           role: 'employee',
//           name,
//           email,
//           phone_no: phone,
//         })
//         const temp_password = createRes?.temp_password
//         const createdId = await resolveUserIdByEmail(createRes?.id || createRes?.user_id, email)
//         if (!createdId) throw new Error('Could not resolve new employee user ID')

//         await api.admin.upsertEmployeeProfile(createdId, { name, email, phone_no: phone })
//         await api.admin.upsertEmployeeBank(createdId, bank)
//         await api.admin.upsertEmployeeEducation(createdId, edu)

//         setResult({ id: createdId, temp_password })
//       }
//     } catch (e) {
//       console.error(e)
//       alert(e.message || 'Failed to hire')
//     } finally {
//       setSaving(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <Card
//         title="Hire"
//         subtitle="Create a new Employee or Agent and fill out their details"
//         actions={
//           <div className="flex gap-2">
//             <Button variant={mode === 'employee' ? 'solid' : 'ghost'} onClick={() => setMode('employee')}>Employee</Button>
//             <Button variant={mode === 'agent' ? 'solid' : 'ghost'} onClick={() => setMode('agent')}>Agent</Button>
//           </div>
//         }
//       >
//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="space-y-3">
//             <SectionTitle>Basic Info</SectionTitle>
//             <div className="flex flex-wrap gap-3">
//               <Field label="Name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" /></Field>
//               <Field label="Email"><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" /></Field>
//               <Field label="Phone"><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="7000000000" /></Field>
//               {mode === 'agent' && (
//                 <Field label="Supervisor (Employee ID)" help="Optional">
//                   <Input value={supervisorId} onChange={e => setSupervisorId(e.target.value)} placeholder="employee UUID" />
//                 </Field>
//               )}
//             </div>

//             <SectionTitle>Bank Details</SectionTitle>
//             <div className="flex flex-wrap gap-3">
//               <Field label="Bank Name"><Input value={bank.bank_name} onChange={e => setBank({ ...bank, bank_name: e.target.value })} /></Field>
//               <Field label="IFSC"><Input value={bank.bank_ifsc} onChange={e => setBank({ ...bank, bank_ifsc: e.target.value })} /></Field>
//               <Field label="Account #"><Input value={bank.bank_account_no} onChange={e => setBank({ ...bank, bank_account_no: e.target.value })} /></Field>
//             </div>

//             <SectionTitle>Education</SectionTitle>
//             <div className="flex flex-wrap gap-3">
//               <Field label="10th"><Input value={edu.edu_10} onChange={e => setEdu({ ...edu, edu_10: e.target.value })} /></Field>
//               <Field label="12th"><Input value={edu.edu_12} onChange={e => setEdu({ ...edu, edu_12: e.target.value })} /></Field>
//               <Field label="Degree"><Input value={edu.edu_degree} onChange={e => setEdu({ ...edu, edu_degree: e.target.value })} /></Field>
//             </div>

//             <div className="flex gap-3 mt-2">
//               <Button onClick={hire} disabled={saving}>{saving ? 'Saving…' : `Hire ${mode === 'agent' ? 'Agent' : 'Employee'}`}</Button>
//               <Button variant="ghost" onClick={resetAll}>Reset</Button>
//             </div>

//             {result && (
//               <div className="mt-3 space-y-2">
//                 <div className="tag">New ID: <b className="ml-1">{result.id}</b></div>
//                 {result.temp_password && (
//                   <div className="tag">Temp Password: <b className="ml-1">{result.temp_password}</b></div>
//                 )}
//                 <div className="text-xs text-yellow-400">⚠️ The new user must change their password on first login.</div>
//               </div>
//             )}
//           </div>

//           <div className="space-y-3">
//             <Card title="Tips" subtitle="Admin-only access">
//               <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
//                 <li>Use a valid email — the account is created with this address.</li>
//                 <li>For Agents, optionally link a Supervisor (Employee) using their user ID.</li>
//                 <li>Bank and Education sections update their respective tables immediately after creation.</li>
//               </ul>
//             </Card>
//           </div>
//         </div>
//       </Card>
//     </div>
//   )
// }



import React, { useEffect, useMemo, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { AlertTriangle } from 'lucide-react'
import { toast } from '../../components/ui/Toast.jsx'

function SectionTitle({ children }) {
  return <div className="text-sm font-semibold opacity-80 mb-2">{children}</div>
}

export default function Hire() {
  const [mode, setMode] = useState('employee') // 'employee' | 'agent'

  // common
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // identity
  const [pan, setPan] = useState('')
  const [aadhaar, setAadhaar] = useState('')

  // agent-only
  const [supervisorId, setSupervisorId] = useState('')

  // bank/edu
  const [bank, setBank] = useState({ bank_name: '', bank_ifsc: '', bank_account_no: '' })
  const [edu, setEdu] = useState({ edu_10: '', edu_12: '', edu_degree: '' })

  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState(null)

  // Email presence checks
  const [emailCheck, setEmailCheck] = useState({ loading:false, inUsers:false, inAgents:false, inEmployees:false })

  useEffect(() => {
    let ignore = false
    async function run() {
      const e = (email || '').trim().toLowerCase()
      if (!e) { setEmailCheck({ loading:false, inUsers:false, inAgents:false, inEmployees:false }); return }
      setEmailCheck(prev => ({ ...prev, loading:true }))
      try {
        const [users, agents, employees] = await Promise.all([ api.admin.users(), api.admin.agents(), api.admin.employees() ])
        const hasInUsers = users.some(u => (u.email || '').toLowerCase() === e)
        const hasInAgents = agents.some(a => (a.email || '').toLowerCase() === e)
        const hasInEmployees = employees.some(emp => (emp.email || '').toLowerCase() === e)
        if (!ignore) setEmailCheck({ loading:false, inUsers:hasInUsers, inAgents:hasInAgents, inEmployees:hasInEmployees })
      } catch (err) {
        if (!ignore) setEmailCheck({ loading:false, inUsers:false, inAgents:false, inEmployees:false })
        toast.error(err.message || 'Email check failed')
      }
    }
    const t = setTimeout(run, 350)
    return () => { ignore = true; clearTimeout(t) }
  }, [email])

  const conflictText = useMemo(() => {
    if (!email) return ''
    const flags = []
    if (emailCheck.inUsers) flags.push('User')
    if (emailCheck.inAgents) flags.push('Agent')
    if (emailCheck.inEmployees) flags.push('Employee')
    if (!flags.length) return ''
    return `Email already exists as: ${flags.join(', ')}`
  }, [email, emailCheck])

  function hasBlockingConflict() {
    if (emailCheck.inUsers) return 'This email is already registered as a user.'
    if (mode === 'agent' && emailCheck.inAgents) return 'This email already belongs to an Agent.'
    if (mode === 'employee' && emailCheck.inEmployees) return 'This email already belongs to an Employee.'
    if (mode === 'agent' && emailCheck.inEmployees) return 'This email belongs to an Employee. Use a different email.'
    if (mode === 'employee' && emailCheck.inAgents) return 'This email belongs to an Agent. Use a different email.'
    return ''
  }

  function resetAll() {
    setName(''); setEmail(''); setPhone('');
    setPan(''); setAadhaar('');
    setSupervisorId('');
    setBank({ bank_name: '', bank_ifsc: '', bank_account_no: '' })
    setEdu({ edu_10: '', edu_12: '', edu_degree: '' })
    setResult(null)
    setEmailCheck({ loading:false, inUsers:false, inAgents:false, inEmployees:false })
  }

  async function resolveUserIdByEmail(maybeId, email) {
    if (maybeId) return maybeId
    const users = await api.admin.users()
    const found = users.find(u => (u.email || '').toLowerCase() === (email || '').toLowerCase())
    return found?.id
  }

  function validateKyc() {
    if (pan && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return 'Invalid PAN format'
    if (aadhaar && !/^[0-9]{12}$/.test(aadhaar)) return 'Invalid Aadhaar (12 digits)'
    return ''
  }

  async function hire() {
    const conflict = hasBlockingConflict()
    if (conflict) return toast.error(conflict)
    if (!name || !email) return toast.error('Name and Email are required.')
    const kycMsg = validateKyc()
    if (kycMsg) return toast.error(kycMsg)

    setSaving(true); setResult(null)
    try {
      if (mode === 'agent') {
        const createRes = await api.admin.createUser({ role:'agent', name, email, phone_no: phone, employee_supervisor_id: supervisorId || undefined })
        const temp_password = createRes?.temp_password
        const createdId = await resolveUserIdByEmail(createRes?.id || createRes?.user_id, email)
        if (!createdId) throw new Error('Could not resolve new agent user ID')

        if (supervisorId) await api.admin.setAgentSupervisor(createdId, supervisorId)
        await api.admin.upsertAgentProfile(createdId, { name, email, phone_no: phone, pan_no: pan || null, aadhaar_no: aadhaar || null })
        await api.admin.upsertAgentBank(createdId, bank)
        await api.admin.upsertAgentEducation(createdId, edu)

        setResult({ id: createdId, temp_password }); toast.success('Agent hired successfully')
      } else {
        const createRes = await api.admin.createUser({ role:'employee', name, email, phone_no: phone })
        const temp_password = createRes?.temp_password
        const createdId = await resolveUserIdByEmail(createRes?.id || createRes?.user_id, email)
        if (!createdId) throw new Error('Could not resolve new employee user ID')

        await api.admin.upsertEmployeeProfile(createdId, { name, email, phone_no: phone, pan_no: pan || null, aadhaar_no: aadhaar || null })
        await api.admin.upsertEmployeeBank(createdId, bank)
        await api.admin.upsertEmployeeEducation(createdId, edu)

        setResult({ id: createdId, temp_password }); toast.success('Employee hired successfully')
      }
    } catch (err) {
      console.error(err); toast.error(err.message || 'Failed to hire')
    } finally {
      setSaving(false)
    }
  }

  const conflict = hasBlockingConflict()

  return (
    <div className="space-y-6">
      <Card title="Hire" subtitle="Create a new Employee or Agent and fill out their details"
        actions={<div className="flex gap-2">
          <Button variant={mode === 'employee' ? 'solid' : 'ghost'} onClick={() => setMode('employee')}>Employee</Button>
          <Button variant={mode === 'agent' ? 'solid' : 'ghost'} onClick={() => setMode('agent')}>Agent</Button>
        </div>}
      >
        {email && (emailCheck.loading || conflict || (!conflict && (emailCheck.inAgents || emailCheck.inEmployees || emailCheck.inUsers))) && (
          <div className={'mb-4 rounded-xl border p-3 flex items-start gap-2 ' + (conflict ? 'border-red-400/40 text-red-200 bg-red-950/30' : 'border-accent/40 bg-slate-900')}>
            <AlertTriangle size={16} className="mt-0.5" />
            <div className="text-sm">
              {emailCheck.loading ? 'Checking email…' : (conflict || conflictText || 'Email looks available.')}
            </div>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <SectionTitle>Basic Info</SectionTitle>
            <div className="flex flex-wrap gap-3">
              <Field label="Name"><Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" /></Field>
              <Field label="Email"><Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" /></Field>
              <Field label="Phone"><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="7000000000" /></Field>
              {mode === 'agent' && (
                <Field label="Supervisor (Employee ID)" help="Optional">
                  <Input value={supervisorId} onChange={e => setSupervisorId(e.target.value)} placeholder="employee UUID" />
                </Field>
              )}
            </div>

            <SectionTitle>KYC / Identity</SectionTitle>
            <div className="flex flex-wrap gap-3">
              <Field label="PAN"><Input value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" /></Field>
              <Field label="Aadhaar"><Input value={aadhaar} onChange={e => setAadhaar(e.target.value.replace(/[^0-9]/g,''))} placeholder="12 digits" /></Field>
            </div>

            <SectionTitle>Bank Details</SectionTitle>
            <div className="flex flex-wrap gap-3">
              <Field label="Bank Name"><Input value={bank.bank_name} onChange={e => setBank({ ...bank, bank_name: e.target.value })} /></Field>
              <Field label="IFSC"><Input value={bank.bank_ifsc} onChange={e => setBank({ ...bank, bank_ifsc: e.target.value })} /></Field>
              <Field label="Account #"><Input value={bank.bank_account_no} onChange={e => setBank({ ...bank, bank_account_no: e.target.value })} /></Field>
            </div>

            <SectionTitle>Education</SectionTitle>
            <div className="flex flex-wrap gap-3">
              <Field label="10th"><Input value={edu.edu_10} onChange={e => setEdu({ ...edu, edu_10: e.target.value })} /></Field>
              <Field label="12th"><Input value={edu.edu_12} onChange={e => setEdu({ ...edu, edu_12: e.target.value })} /></Field>
              <Field label="Degree"><Input value={edu.edu_degree} onChange={e => setEdu({ ...edu, edu_degree: e.target.value })} /></Field>
            </div>

            <div className="flex gap-3 mt-2">
              <Button onClick={hire} disabled={saving || !!conflict}>{saving ? 'Saving…' : `Hire ${mode === 'agent' ? 'Agent' : 'Employee'}`}</Button>
              <Button variant="ghost" onClick={resetAll}>Reset</Button>
            </div>

            {result && (
              <div className="mt-3 space-y-2">
                <div className="tag">New ID: <b className="ml-1">{result.id}</b></div>
                {result.temp_password && <div className="tag">Temp Password: <b className="ml-1">{result.temp_password}</b></div>}
                <div className="text-xs text-yellow-400">⚠️ The new user must change their password on first login.</div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Card title="Tips" subtitle="Admin-only access">
              <ul className="list-disc pl-5 space-y-2 text-sm opacity-90">
                <li>PAN format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F).</li>
                <li>Aadhaar: 12 digits. Values are validated client-side and on DB via CHECK constraints.</li>
                <li>We only show PAN/Aadhaar in full on edit screens; lists should be masked.</li>
              </ul>
            </Card>
          </div>
        </div>
      </Card>
    </div>
  )
}
