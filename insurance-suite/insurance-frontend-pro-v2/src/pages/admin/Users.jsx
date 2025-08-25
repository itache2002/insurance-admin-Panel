// import React, { useEffect, useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import { Field } from '../../components/ui/Field'
// import { Input, Select } from '../../components/ui/Input'
// import DataTable from '../../components/data/DataTable'
// import { api } from '../../lib/api'

// export default function AdminUsers(){
//   const [form,setForm]=useState({role:'agent',name:'',email:'',phone_no:'',employee_supervisor_id:''})
//   const [users,setUsers]=useState([]); const [temp,setTemp]=useState(null)
//   async function createUser(){ const res = await api.admin.createUser(form); setTemp(res.temp_password); alert('Temp password: '+res.temp_password+'\nShare this only once.') }
//   async function loadUsers(){ setUsers(await api.admin.users()) }
//   useEffect(()=>{ loadUsers() }, [])
//   return <div className="grid gap-6 md:grid-cols-2">
//     <Card title="Create User" subtitle="Admin, Employee, Agent" actions={<Button onClick={createUser}>Create</Button>}>
//       <div className="flex flex-wrap gap-3">
//         <Field label="Role"><Select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}><option value="admin">admin</option></Select></Field>
//         <Field label="Name"><Input onChange={e=>setForm({...form,name:e.target.value})}/></Field>
//         <Field label="Email"><Input onChange={e=>setForm({...form,email:e.target.value})}/></Field>
//         <Field label="Phone"><Input onChange={e=>setForm({...form,phone_no:e.target.value})}/></Field>
//         {form.role==='agent' && <Field label="Supervisor (Employee ID)"><Input onChange={e=>setForm({...form,employee_supervisor_id:e.target.value})}/></Field>}
//       </div>
//       <div className="text-xs text-yellow-400 mt-3">⚠️ New users must change password on first login.</div>
//       {temp && <div className="tag mt-3">Temp password: <b className="ml-1">{temp}</b></div>}
//     </Card>
//     <Card title="All Users" subtitle="Search, sort, paginate" actions={<Button variant="outline" onClick={loadUsers}>Refresh</Button>}>
//       <DataTable columns={[{key:'id',label:'ID'},{key:'role',label:'Role'},{key:'name',label:'Name'},{key:'email',label:'Email'}]} rows={users}/>
//     </Card>
//   </div>
// }


import React, { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import DataTable from '../../components/data/DataTable'
import { Field } from '../../components/ui/Field'
import { Input, Select } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { toast } from '../../components/ui/Toast'

function Tag({ children, color='slate' }) {
  const colors = {
    green: 'bg-green-500/15 text-green-300 border-green-500/30',
    red: 'bg-red-500/15 text-red-300 border-red-500/30',
    yellow: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    slate: 'bg-slate-500/15 text-slate-200 border-slate-500/30'
  }
  return <span className={`px-2 py-0.5 rounded-full border text-xs ${colors[color] || colors.slate}`}>{children}</span>
}

export default function AdminUsers(){
  const [rows, setRows] = useState([])
  const [role, setRole] = useState('')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)

  // modal state for creds
  const [showCreds, setShowCreds] = useState(false)
  const [creds, setCreds] = useState({ user: null, temp_password: null, is_changed: null, role: null })

  async function load(){
    setLoading(true)
    try {
      const data = await api.admin.users()
      setRows(Array.isArray(data) ? data : [])
    } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  const filtered = rows.filter(r => {
    const okRole = !role || r.role === role
    const text = `${r.name||''} ${r.email||''} ${r.phone_no||''}`.toLowerCase()
    const okQ = !q || text.includes(q.toLowerCase())
    return okRole && okQ
  })

  async function onViewCreds(user){
    try {
      const data = await api.admin.initialCreds(user.id)
      if (!data || (!data.temp_password && data.is_changed == null)){
        toast.info('No initial credentials found for this user.')
        return
      }
      setCreds({ user, temp_password: data.temp_password || null, is_changed: !!data.is_changed, role: data.role || null })
      setShowCreds(true)
    } catch (e) {
      // toast is already handled in api layer
    }
  }

  function copy(text){
    navigator.clipboard.writeText(text).then(()=>toast.success('Copied'))
  }

  return (
    <div className="space-y-6">
      <Card
        title="Users"
        subtitle="All users; filter and view initial credentials"
        actions={
          <div className="flex gap-2">
            <Select value={role} onChange={e=>setRole(e.target.value)}>
              <option value="">All roles</option>
              <option value="admin">admin</option>
              <option value="employee">employee</option>
              <option value="agent">agent</option>
            </Select>
            <Input placeholder="Search name/email/phone" value={q} onChange={e=>setQ(e.target.value)} />
            <Button variant="outline" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</Button>
          </div>
        }
      >
        <DataTable
          columns={[
            { key:'name', label:'Name' },
            { key:'email', label:'Email' },
            { key:'phone_no', label:'Phone' },
            { key:'role', label:'Role',
              render:(v)=> <Tag color={v==='admin'?'yellow':v==='employee'?'green':'slate'}>{v}</Tag>
            },
            { key:'created_at', label:'Created', render:(v)=> new Date(v).toLocaleString() },
            { key:'actions', label:'Actions', render:(_,row)=>(
              <div className="flex gap-2">
                <Button size="sm" onClick={()=>onViewCreds(row)}>View Initial Creds</Button>
              </div>
            )}
          ]}
          rows={filtered}
        />
      </Card>

      {/* lightweight modal for creds */}
      {showCreds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-[560px] max-w-[92vw] rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-lg font-semibold">Initial Credentials</div>
                <div className="text-sm text-slate-400">
                  {creds.user?.name} • {creds.user?.email} {creds.role ? `• ${creds.role}` : ''}
                </div>
              </div>
              <Button variant="ghost" onClick={()=>setShowCreds(false)}>✕</Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-300">Temp Password</div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 rounded bg-slate-800 border border-slate-700">
                    {creds.temp_password || '—'}
                  </code>
                  {creds.temp_password && (
                    <Button size="sm" variant="outline" onClick={()=>copy(creds.temp_password)}>Copy</Button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-300">Changed?</div>
                <Tag color={creds.is_changed ? 'green' : 'red'}>
                  {creds.is_changed ? 'Yes (changed)' : 'No (still initial)'}
                </Tag>
              </div>
              <div className="text-xs text-yellow-300/90 bg-yellow-500/10 border border-yellow-500/30 rounded p-2">
                Share the temp password only once. The user should change it on first login.
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button onClick={()=>setShowCreds(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
