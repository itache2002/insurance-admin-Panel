// import React, { useEffect, useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import { Input } from '../../components/ui/Input'
// import { api } from '../../lib/api'

// function Progress({ value }) {
//   const v = Math.max(0, Math.min(100, Number(value || 0)))
//   return (
//     <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
//       <div className="h-full bg-accent" style={{ width: `${v}%` }} />
//     </div>
//   )
// }

// export default function EmployeeTargets(){
//   const [month, setMonth] = useState(new Date().toISOString().slice(0,7)) // YYYY-MM
//   const [data, setData] = useState({ total_premium: 0, target_value: 0, progress: null })
//   const [loading, setLoading] = useState(false)

//   async function load(){
//     setLoading(true)
//     try{
//       const d = await api.employee.targets(month)
//       setData(d || {})
//     } finally { setLoading(false) }
//   }
//   useEffect(()=>{ load() }, [month])

//   return (
//     <Card
//       title="My Monthly Target"
//       subtitle="Admin sets your target. This view shows your progress based on all agents under you."
//       actions={
//         <div className="flex items-center gap-2">
//           <Input type="month" value={month} onChange={e=>setMonth(e.target.value)} />
//           <Button variant="outline" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</Button>
//         </div>
//       }
//     >
//       <div className="grid gap-6 md:grid-cols-3">
//         <div className="kpi">
//           <div className="text-xs opacity-70">Month</div>
//           <div className="text-xl font-bold">{month}</div>
//         </div>
//         <div className="kpi">
//           <div className="text-xs opacity-70">Total Premium (this month)</div>
//           <div className="text-xl font-bold">₹{data.total_premium ?? 0}</div>
//         </div>
//         <div className="kpi">
//           <div className="text-xs opacity-70">Target</div>
//           <div className="text-xl font-bold">₹{data.target_value ?? 0}</div>
//         </div>
//       </div>

//       <div className="mt-6 space-y-2">
//         <div className="flex items-center justify-between">
//           <div className="text-sm opacity-70">Progress</div>
//           <div className="text-sm">{data.progress != null ? `${data.progress}%` : '—'}</div>
//         </div>
//         <Progress value={data.progress} />
//       </div>

//       <div className="mt-3 text-xs opacity-60">
//         Targets are managed by Admin. Premium totals are aggregated from your supervised agents’ monthly stats.
//       </div>
//     </Card>
//   )
// }


import React, { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'

const toMonth = (d) => d.toISOString().slice(0,7) // "YYYY-MM"
const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(n||0))

export default function EmployeeTargets(){
  const [m, setM] = useState(toMonth(new Date()))
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load(){
    setLoading(true)
    try{
      // backend accepts YYYY-MM; it will normalize to first_day_of_month
      const d = await api.employee.targetSummary(m)
      console.log('targetSummary', m, d)
      if (!d) throw new Error('No data found for this month')
      setData(d)
    } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])        // initial
 useEffect(()=>{ load() }, [m])

  const achieved = Number(data?.achieved_premium || 0)
  const target   = Number(data?.target_premium || 0)
  const pct = target > 0 ? Math.min(100, Math.round(achieved/target*100)) : 0

  return (
    <Card
      title="My Monthly Target"
      subtitle="Admin sets your target. This view aggregates premium from agents under you."
      actions={
        <div className="flex items-center gap-2">
          <Input type="month" value={m} onChange={e=>setM(e.target.value)} />
          <Button variant="outline" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</Button>
        </div>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <div className="kpi"><div className="text-xs opacity-70">Month</div><div className="text-2xl font-bold">{m}</div></div>
        <div className="kpi"><div className="text-xs opacity-70">Total Premium (this month)</div><div className="text-2xl font-bold">{fmt(achieved)}</div></div>
        <div className="kpi"><div className="text-xs opacity-70">Target</div><div className="text-2xl font-bold">{fmt(target)}</div></div>
      </div>

      <div className="mt-6">
        <div className="text-sm opacity-70 mb-2">Progress</div>
        <div className="h-2 rounded bg-slate-700/60 overflow-hidden">
          <div className="h-2 bg-accent" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-2 text-xs opacity-70">
          {fmt(achieved)} / {fmt(target)} ({pct}%)
        </div>
      </div>

      <div className="mt-3 text-xs opacity-60">
        Targets are managed by Admin. Premium totals are aggregated from your supervised agents’ monthly stats.
      </div>
    </Card>
  )
}
