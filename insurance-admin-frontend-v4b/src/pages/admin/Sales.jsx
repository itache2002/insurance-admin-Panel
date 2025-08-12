// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'

// function monthFirstDay(d=new Date()){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01` }

// export default function Sales() {
//   const [agents, setAgents] = useState([])
//   const [agentId, setAgentId] = useState('')
//   const [month, setMonth] = useState(monthFirstDay())
//   const [achieved_value, setAchieved] = useState('')
//   const [delta, setDelta] = useState('')
//   const [summary, setSummary] = useState(null)

//   async function loadAgents(){ setAgents(await http('/api/admin/agents')) }
//   useEffect(()=>{ loadAgents() }, [])

//   async function loadSummary(){
//     if (!agentId) return setSummary(null)
//     const data = await http(`/api/admin/agents/${agentId}/targets/summary?month=${month}`)
//     setSummary(data)
//   }
//   useEffect(()=>{ loadSummary() }, [agentId, month])

//   async function setSales(e){
//     e.preventDefault()
//     if (!agentId) return alert('Select agent')
//     await http(`/api/admin/agents/${agentId}/sales`, { method:'POST', body:{ month, achieved_value: Number(achieved_value||0) } })
//     setAchieved('')
//     await loadSummary()
//     alert('Sales set')
//   }

//   async function incSales(e){
//     e.preventDefault()
//     if (!agentId) return alert('Select agent')
//     await http(`/api/admin/agents/${agentId}/sales`, { method:'PATCH', body:{ month, delta: Number(delta||0) } })
//     setDelta('')
//     await loadSummary()
//     alert('Sales incremented')
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="card grid md:grid-cols-2 gap-4">
//         <div>
//           <label className="label">Agent</label>
//           <select className="input select" value={agentId} onChange={e=>setAgentId(e.target.value)}>
//             <option value="">Select Agent</option>
//             {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="label">Month</label>
//           <input className="input" type="month" value={month.slice(0,7)} onChange={e=>setMonth(e.target.value+'-01')} />
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-6">
//         <form className="card space-y-3" onSubmit={setSales}>
//           <div className="text-lg font-semibold">Set Sales (Achieved)</div>
//           <input className="input" placeholder="Achieved value" value={achieved_value} onChange={e=>setAchieved(e.target.value)} />
//           <button className="btn">Set Sales</button>
//         </form>

//         <form className="card space-y-3" onSubmit={incSales}>
//           <div className="text-lg font-semibold">Increment Sales</div>
//           <input className="input" placeholder="Increment by (delta)" value={delta} onChange={e=>setDelta(e.target.value)} />
//           <button className="btn">Increment</button>
//         </form>
//       </div>

//       <div className="card">
//         <div className="text-lg font-semibold mb-2">Current Month Summary</div>
//         {summary ? (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <KPI title="Target" value={summary.target_value} />
//             <KPI title="Achieved" value={summary.achieved_value} />
//             <KPI title="Completion" value={summary.completion_pct + '%'} />
//             <KPI title="Month" value={new Date(summary.month).toLocaleString('default',{ month:'long', year:'numeric'})} />
//           </div>
//         ) : 'Select an agent and month'}
//       </div>
//     </div>
//   )
// }

// function KPI({ title, value }){
//   return (<div className="kpi"><div className="text-sm text-muted">{title}</div><div className="text-2xl font-semibold">{value}</div></div>)
// }



import React, { useEffect, useRef, useState } from 'react'
import { http } from '../../lib/api'

function monthFirstDay(d=new Date()){ const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01` }

export default function Sales() {
  const [agents, setAgents] = useState([])
  const [agentId, setAgentId] = useState('')
  const [month, setMonth] = useState(monthFirstDay())
  const [achieved_value, setAchieved] = useState('')
  const [delta, setDelta] = useState('')
  const [summary, setSummary] = useState(null)

  const [loadingAgents, setLoadingAgents] = useState(false)
  const [agentsError, setAgentsError] = useState('')
  const focusHandlerBound = useRef(false)

  async function loadAgents(retry = 2){
    setLoadingAgents(true)
    setAgentsError('')
    try {
      const list = await http('/api/admin/agents')
      setAgents(list)

      // If nothing selected, auto-select the first agent
      if (!agentId && list.length) setAgentId(list[0].id)
    } catch (e) {
      if (retry > 0) {
        // try once more shortly after (helps when backend just woke up)
        setTimeout(() => loadAgents(retry - 1), 350)
      } else {
        setAgents([])
        setAgentsError(e.message || 'Failed to load agents')
      }
    } finally {
      setLoadingAgents(false)
    }
  }

  // initial load + refresh on window focus (helps after backend restarts)
  useEffect(() => {
    loadAgents(2)
    if (!focusHandlerBound.current) {
      const onFocus = () => loadAgents(1)
      window.addEventListener('focus', onFocus)
      focusHandlerBound.current = true
      return () => window.removeEventListener('focus', onFocus)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadSummary(){
    if (!agentId) { setSummary(null); return }
    const data = await http(`/api/admin/agents/${agentId}/targets/summary?month=${month}`)
    setSummary(data)
  }
  useEffect(()=>{ loadSummary() }, [agentId, month])

  async function setSales(e){
    e.preventDefault()
    if (!agentId) return alert('Select agent')
    await http(`/api/admin/agents/${agentId}/sales`, { method:'POST', body:{ month, achieved_value: Number(achieved_value||0) } })
    setAchieved('')
    await loadSummary()
    alert('Sales set')
  }

  async function incSales(e){
    e.preventDefault()
    if (!agentId) return alert('Select agent')
    await http(`/api/admin/agents/${agentId}/sales`, { method:'PATCH', body:{ month, delta: Number(delta||0) } })
    setDelta('')
    await loadSummary()
    alert('Sales incremented')
  }

  return (
    <div className="grid gap-6">
      {/* Filters */}
      <div className="card grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Agent</label>
          <select
            className="input select"
            value={agentId}
            onChange={e=>setAgentId(e.target.value)}
          >
            {loadingAgents && <option value="">Loading…</option>}
            {!loadingAgents && agents.length === 0 && <option value="">(No agents found)</option>}
            {!loadingAgents && agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
            ))}
          </select>
          <div className="mt-2 flex gap-2">
            <button className="btn-outline" type="button" onClick={()=>loadAgents(1)}>Reload Agents</button>
            {agentsError && <span className="text-sm text-red-400">{agentsError}</span>}
          </div>
        </div>

        <div>
          <label className="label">Month</label>
          <input className="input" type="month" value={month.slice(0,7)} onChange={e=>setMonth(e.target.value+'-01')} />
        </div>
      </div>

      {/* Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <form className="card space-y-3" onSubmit={setSales}>
          <div className="text-lg font-semibold">Set Sales (Achieved)</div>
          <input className="input" placeholder="Achieved value" value={achieved_value} onChange={e=>setAchieved(e.target.value)} />
          <button className="btn" disabled={!agentId}>Set Sales</button>
        </form>

        <form className="card space-y-3" onSubmit={incSales}>
          <div className="text-lg font-semibold">Increment Sales</div>
          <input className="input" placeholder="Increment by (delta)" value={delta} onChange={e=>setDelta(e.target.value)} />
          <button className="btn" disabled={!agentId}>Increment</button>
        </form>
      </div>

      {/* Summary */}
      <div className="card">
        <div className="text-lg font-semibold mb-2">Current Month Summary</div>
        {agentId ? (
          summary ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPI title="Target" value={summary.target_value} />
              <KPI title="Achieved" value={summary.achieved_value} />
              <KPI title="Completion" value={summary.completion_pct + '%'} />
              <KPI title="Month" value={new Date(summary.month).toLocaleString('default',{ month:'long', year:'numeric'})} />
            </div>
          ) : (
            <div className="text-sm text-muted">Loading summary…</div>
          )
        ) : (
          <div className="text-sm text-muted">Select an agent and month</div>
        )}
      </div>
    </div>
  )
}

function KPI({ title, value }){
  return (<div className="kpi"><div className="text-sm text-muted">{title}</div><div className="text-2xl font-semibold">{value}</div></div>)
}
