import React, { useEffect, useState } from 'react'
import { http } from '../../lib/api'
import { Link } from 'react-router-dom'

function fmtMonth(d=new Date()){ const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01` }

export default function AgentDashboard() {
  const [me, setMe] = useState(null)
  const [summary, setSummary] = useState(null)

  useEffect(()=>{
    (async()=>{
      const m = await http('/api/agent/me')
      setMe(m)
      const s = await http(`/api/agent/targets/summary?month=${fmtMonth()}`)
      setSummary(s)
    })()
  }, [])

  return (
    <div className="grid gap-6">
      {me?.must_change_password && (
        <div className="card border-yellow-400/40">
          <div className="text-yellow-300 font-medium">Action required: Change your password</div>
          <div className="text-sm text-muted">Your account is using a temporary password. Please <Link className="link" to="/agent/change-password">change it now</Link>.</div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Salary" value={me ? `₹${me.base_salary || 0}` : '—'} />
        <KPI title="Incentive Rate" value={me ? `${me.incentive_rate || 0}` : '—'} />
        <KPI title="Target" value={summary ? summary.target_value : '—'} />
        <KPI title="Achieved" value={summary ? summary.achieved_value : '—'} />
      </div>

      <div className="card">
        <div className="text-lg font-semibold mb-2">This Month Progress</div>
        {summary ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <Progress title="Completion" value={summary.completion_pct} />
            <div className="kpi">
              <div className="text-sm text-muted">Month</div>
              <div className="text-xl">{new Date(summary.month).toLocaleString('default',{ month:'long', year:'numeric'})}</div>
            </div>
          </div>
        ) : 'Loading…'}
      </div>
    </div>
  )
}

function KPI({ title, value }){ return (<div className="kpi"><div className="text-sm text-muted">{title}</div><div className="text-2xl font-semibold">{value}</div></div>) }

function Progress({ title, value=0 }){
  return (
    <div className="card">
      <div className="mb-2 text-sm text-muted">{title}</div>
      <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-accent" style={{width: `${value}%`}} />
      </div>
      <div className="mt-2 text-sm">{value}%</div>
    </div>
  )
}
