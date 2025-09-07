// import React, { useState } from 'react'
// import Card from '../components/ui/Card'
// import Button from '../components/ui/Button'
// import { useAuth } from '../lib/auth'
// import { Input } from '../components/ui/Input'
// import { getAccessToken } from '../lib/api'
// export default function Profile(){
//   const { user, mustChangePassword, setMustChangePassword } = useAuth()
//   const [pwd,setPwd]=useState('')
//   async function change(){
//     const res = await fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/auth/change-password',{
//       method:'POST', headers:{'Content-Type':'application/json', Authorization:'Bearer '+getAccessToken()}, body:JSON.stringify({new_password:pwd})
//     })
//     if(res.ok){ setMustChangePassword(false); setPwd(''); alert('Password changed!') } else { alert('Failed') }
//   }
//   return <div className="grid gap-6 md:grid-cols-2">
//     <Card title="Profile" subtitle="Your account">
//       <div className="grid grid-cols-2 gap-3 text-sm">
//         <div className="tag">Name: <b className="ml-1">{user?.name}</b></div>
//         <div className="tag">Email: <b className="ml-1">{user?.email}</b></div>
//         <div className="tag">Role: <b className="ml-1">{user?.role}</b></div>
//         <div className="tag">ID: <b className="ml-1">{user?.id}</b></div>
//       </div>
//     </Card>
//     <Card title="Change Password">
//       <label className="block"><div className="text-sm mb-1">New Password</div><Input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="min 8 chars"/></label>
//       <Button className="mt-3" onClick={change}>Change Password</Button>
//       {mustChangePassword && <div className="text-xs text-yellow-400 mt-2">⚠️ Please change your temporary password.</div>}
//     </Card>
//   </div>
// }


import React, { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { toast } from '../components/ui/Toast'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'

export default function Profile(){
  const { user, mustChangePassword, setMustChangePassword } = useAuth()

  // form state
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [saving, setSaving] = useState(false)

  async function change(){
    if (!currentPwd.trim()){
      toast.error('Current password is required'); return
    }
    if (newPwd.length < 8){
      toast.error('New password must be at least 8 characters'); return
    }
    if (newPwd !== confirmPwd){
      toast.error('Passwords do not match'); return
    }

    setSaving(true)
    try {
      await api.changePassword(currentPwd, newPwd) // calls /api/auth/change-password
      setMustChangePassword(false)
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      toast.success('Password changed')
    } catch (e) {
      // request() already toasts an error; keep a console for dev
      console.error('change password failed', e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card title="Profile" subtitle="Your account">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="tag">Name: <b className="ml-1">{user?.name}</b></div>
          <div className="tag">Email: <b className="ml-1">{user?.email}</b></div>
          <div className="tag">Role: <b className="ml-1">{user?.role}</b></div>
          <div className="tag">ID: <b className="ml-1">{user?.id}</b></div>
        </div>
      </Card>

      <Card title="Change Password">
        <label className="block mb-3">
          <div className="text-sm mb-1">Current Password</div>
          <Input
            type="password"
            value={currentPwd}
            onChange={e=>setCurrentPwd(e.target.value)}
            placeholder="your current password"
          />
        </label>

        <label className="block mb-3">
          <div className="text-sm mb-1">New Password</div>
          <Input
            type="password"
            value={newPwd}
            onChange={e=>setNewPwd(e.target.value)}
            placeholder="min 8 chars"
          />
        </label>

        <label className="block mb-4">
          <div className="text-sm mb-1">Confirm New Password</div>
          <Input
            type="password"
            value={confirmPwd}
            onChange={e=>setConfirmPwd(e.target.value)}
            placeholder="re-enter new password"
          />
        </label>

        <Button className="mt-1" onClick={change} disabled={saving}>
          {saving ? 'Changing…' : 'Change Password'}
        </Button>

        {mustChangePassword && (
          <div className="text-xs text-yellow-400 mt-2">
            ⚠️ Please change your temporary password.
          </div>
        )}
      </Card>
    </div>
  )
}
