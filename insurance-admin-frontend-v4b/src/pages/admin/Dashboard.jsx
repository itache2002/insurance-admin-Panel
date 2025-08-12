// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'

// export default function AdminDashboard() {
//   const [counts, setCounts] = useState({ agents: 0, customers: 0 })
//   const [topAgents, setTopAgents] = useState([])

//   useEffect(() => {
//     (async () => {
//       try {
//         const list = await http('/api/admin/agents-with-customer-counts')
//         setTopAgents(list)
//         setCounts({ agents: list.length, customers: list.reduce((a,b)=>a+Number(b.customer_count||0),0) })
//       } catch {}
//     })()
//   }, [])

//   return (
//     <div className="grid gap-6">
//       <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <KPI title="Total Agents" value={counts.agents} />
//         <KPI title="Total Customers" value={counts.customers} />
//         <KPI title="Avg Customers / Agent" value={counts.agents? (counts.customers/counts.agents).toFixed(1):0} />
//         <KPI title="Active Month" value={new Date().toLocaleString('default',{ month:'long', year:'numeric'})} />
//       </div>

//       <div className="card">
//         <div className="flex items-center justify-between mb-4">
//           <div className="text-lg font-semibold">Top Agents by Customers</div>
//         </div>
//         <table className="table">
//           <thead>
//             <tr>
//               <th className="th">Agent</th>
//               <th className="th">Email</th>
//               <th className="th">Phone</th>
//               <th className="th">Customers</th>
//             </tr>
//           </thead>
//           <tbody>
//             {topAgents.map(a => (
//               <tr key={a.agent_id}>
//                 <td className="td">{a.name}</td>
//                 <td className="td">{a.email}</td>
//                 <td className="td">{a.phone_no}</td>
//                 <td className="td">{a.customer_count}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// function KPI({ title, value }){
//   return (
//     <div className="kpi">
//       <div className="text-sm text-muted">{title}</div>
//       <div className="text-2xl font-semibold">{value}</div>
//     </div>
//   )
// }



import React, { useEffect, useState } from 'react'
import { http } from '../../lib/api'

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ agents: 0, customers: 0 })
  const [topAgents, setTopAgents] = useState([])
  const [loading, setLoading] = useState(true)

  async function load(retry = 1) {
    setLoading(true)
    try {
      const list = await http('/api/admin/agents-with-customer-counts')
      setTopAgents(list)
      setCounts({
        agents: list.length,
        customers: list.reduce((a,b)=> a + Number(b.customer_count || 0), 0)
      })
    } catch (e) {
      if (retry > 0) {
        setTimeout(() => load(retry - 1), 300)
      } else {
        setTopAgents([])
        setCounts({ agents: 0, customers: 0 })
        console.warn('Dashboard load failed:', e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(2) }, [])

  return (
    <div className="grid gap-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI title="Total Agents" value={counts.agents} />
        <KPI title="Total Customers" value={counts.customers} />
        <KPI title="Avg Customers / Agent" value={counts.agents? (counts.customers/counts.agents).toFixed(1):0} />
        <KPI title="Active Month" value={new Date().toLocaleString('default',{ month:'long', year:'numeric'})} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Top Agents by Customers</div>
          <button className="btn-outline" onClick={()=>load(1)}>Reload</button>
        </div>
        {loading ? 'Loading…' : (
          <div className="overflow-x-auto">
            <table className="table min-w-[720px]">
              <thead>
                <tr>
                  <th className="th">Agent</th>
                  <th className="th">Email</th>
                  <th className="th">Phone</th>
                  <th className="th">Customers</th>
                </tr>
              </thead>
              <tbody>
                {topAgents.map(a => (
                  <tr key={a.agent_id}>
                    <td className="td">{a.name}</td>
                    <td className="td">{a.email}</td>
                    <td className="td">{a.phone_no}</td>
                    <td className="td">{a.customer_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function KPI({ title, value }){
  return (
    <div className="kpi">
      <div className="text-sm text-muted">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
