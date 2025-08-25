

// // // import React, { useEffect, useMemo, useState } from 'react'
// // // import Card from '../components/ui/Card'
// // // import Button from '../components/ui/Button'
// // // import { useAuth } from '../lib/auth'
// // // import { api } from '../lib/api'
// // // import DataTable from '../components/data/DataTable'
// // // import {
// // //   BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
// // //   LineChart, Line, YAxis, CartesianGrid
// // // } from 'recharts'

// // // export default function Dashboard(){
// // //   const { user } = useAuth()

// // //   // Agent stats
// // //   const [aStats, setAStats] = useState([])

// // //   // Admin aggregates (employees -> #agents, #customers)
// // //   const [empAgg, setEmpAgg] = useState([])
// // //   const [empAggLoading, setEmpAggLoading] = useState(false)

// // //   // Employee overview (agents under me -> email, #customers)
// // //   const [myAgents, setMyAgents] = useState([])
// // //   const [myAgentsLoading, setMyAgentsLoading] = useState(false)

// // //   async function load() {
// // //     if (!user) return
// // //     if (user.role === 'agent') {
// // //       setAStats(await api.agent.stats())
// // //     } else if (user.role === 'employee') {
// // //       setMyAgentsLoading(true)
// // //       try { setMyAgents(await api.employee.agentsOverview()) }
// // //       finally { setMyAgentsLoading(false) }
// // //     } else if (user.role === 'admin' || user.role === 'super_admin') {
// // //       setEmpAggLoading(true)
// // //       try { setEmpAgg(await api.admin.employeeAggregates()) }
// // //       finally { setEmpAggLoading(false) }
// // //     }
// // //   }

// // //   useEffect(()=>{ load() /* eslint-disable-next-line */ }, [user])

// // //   const totals = useMemo(() => {
// // //     if (!empAgg?.length) return { employees: 0, agents: 0, customers: 0 }
// // //     return {
// // //       employees: empAgg.length,
// // //       agents: empAgg.reduce((s,r)=> s + (r.agent_count || 0), 0),
// // //       customers: empAgg.reduce((s,r)=> s + (r.customer_count || 0), 0)
// // //     }
// // //   }, [empAgg])

// // //   return (
// // //     <div className="space-y-6">
// // //       {/* Common header KPIs */}
// // //       <div className="grid gap-4 md:grid-cols-3">
// // //         <div className="kpi">
// // //           <div className="text-sm opacity-80">Welcome</div>
// // //           <div className="text-xl font-bold">{user?.name || 'User'}</div>
// // //           <div className="tag mt-2">Role: {user?.role}</div>
// // //         </div>
// // //         <div className="kpi">
// // //           <div className="text-sm opacity-80">Email</div>
// // //           <div className="text-xl font-bold truncate">{user?.email}</div>
// // //         </div>
// // //         <div className="kpi">
// // //           <div className="text-sm opacity-80">ID</div>
// // //           <div className="text-xl font-bold truncate">{user?.id}</div>
// // //         </div>
// // //       </div>

// // //       {/* ===================== ADMIN VIEW ===================== */}
// // //       {(user?.role === 'admin' || user?.role === 'super_admin') && (
// // //         <>
// // //           <div className="grid gap-4 md:grid-cols-3">
// // //             <div className="kpi"><div className="text-sm opacity-80">Employees</div><div className="text-2xl font-bold">{totals.employees}</div></div>
// // //             <div className="kpi"><div className="text-sm opacity-80">Agents (total)</div><div className="text-2xl font-bold">{totals.agents}</div></div>
// // //             <div className="kpi"><div className="text-sm opacity-80">Customers (total)</div><div className="text-2xl font-bold">{totals.customers}</div></div>
// // //           </div>

// // //           <Card
// // //             title="Employees Overview"
// // //             subtitle="Employees with number of agents under them and total customers"
// // //             actions={<Button variant="outline" onClick={load} disabled={empAggLoading}>{empAggLoading ? 'Loading…' : 'Refresh'}</Button>}
// // //           >
// // //             <DataTable
// // //               columns={[
// // //                 { key: 'name', label: 'Employee Name' },
// // //                 { key: 'email', label: 'Email' },
// // //                 { key: 'agent_count', label: '# Agents' },
// // //                 { key: 'customer_count', label: '# Customers' },
// // //               ]}
// // //               rows={empAgg}
// // //             />
// // //           </Card>
// // //         </>
// // //       )}

// // //       {/* ===================== EMPLOYEE VIEW ===================== */}
// // //       {user?.role === 'employee' && (
// // //         <Card
// // //           title="My Agents"
// // //           subtitle="Agents under you with their customer counts"
// // //           actions={<Button variant="outline" onClick={load} disabled={myAgentsLoading}>{myAgentsLoading ? 'Loading…' : 'Refresh'}</Button>}
// // //         >
// // //           <DataTable
// // //             columns={[
// // //               { key: 'agent_name', label: 'Agent Name' },
// // //               { key: 'agent_email', label: 'Email' },
// // //               { key: 'customer_count', label: '# Customers' },
// // //             ]}
// // //             rows={myAgents}
// // //           />
// // //         </Card>
// // //       )}

// // //       {/* ===================== AGENT VIEW ===================== */}
// // //       {user?.role === 'agent' && (
// // //         <>
// // //           <Card title="My Monthly Sales" subtitle="Last months">
// // //             <div className="h-64">
// // //               <ResponsiveContainer width="100%" height="100%">
// // //                 <BarChart data={aStats}>
// // //                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
// // //                   <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
// // //                   <YAxis tick={{fill:'#9ca3af'}} />
// // //                   <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb'}} />
// // //                   <Bar dataKey="sales_count" />
// // //                 </BarChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //           </Card>

// // //           <Card title="Premium vs Commission">
// // //             <div className="h-64">
// // //               <ResponsiveContainer width="100%" height="100%">
// // //                 <LineChart data={aStats}>
// // //                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
// // //                   <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
// // //                   <YAxis tick={{fill:'#9ca3af'}} />
// // //                   <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb'}} />
// // //                   <Line type="monotone" dataKey="total_premium" />
// // //                   <Line type="monotone" dataKey="total_commission" />
// // //                 </LineChart>
// // //               </ResponsiveContainer>
// // //             </div>
// // //           </Card>
// // //         </>
// // //       )}
// // //     </div>
// // //   )
// // // }


// // import React, { useEffect, useMemo, useState } from 'react'
// // import Card from '../components/ui/Card'
// // import Button from '../components/ui/Button'
// // import { useAuth } from '../lib/auth'
// // import { api } from '../lib/api'
// // import DataTable from '../components/data/DataTable'
// // import {
// //   BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
// //   LineChart, Line, YAxis, CartesianGrid
// // } from 'recharts'

// // export default function Dashboard(){
// //   const { user } = useAuth()

// //   // Agent
// //   const [aStats, setAStats] = useState([])
// //   const [comp, setComp] = useState(null)

// //   // Admin
// //   const [empAgg, setEmpAgg] = useState([])
// //   const [empAggLoading, setEmpAggLoading] = useState(false)

// //   // Employee
// //   const [myAgents, setMyAgents] = useState([])
// //   const [myAgentsLoading, setMyAgentsLoading] = useState(false)

// //   async function load() {
// //     if (!user) return
// //     if (user.role === 'agent') {
// //       const [stats, c] = await Promise.all([
// //         api.agent.stats(),
// //         api.agent.compensation()
// //       ])
// //       setAStats(stats || [])
// //       setComp(c || { base_salary: 0, commission_rate: 0 })
// //     } else if (user.role === 'employee') {
// //       setMyAgentsLoading(true)
// //       try { setMyAgents(await api.employee.agentsOverview()) }
// //       finally { setMyAgentsLoading(false) }
// //     } else if (user.role === 'admin' || user.role === 'super_admin') {
// //       setEmpAggLoading(true)
// //       try { setEmpAgg(await api.admin.employeeAggregates()) }
// //       finally { setEmpAggLoading(false) }
// //     }
// //   }
// //   useEffect(()=>{ load() /* eslint-disable-next-line */ }, [user])

// //   const totals = useMemo(() => {
// //     if (!empAgg?.length) return { employees: 0, agents: 0, customers: 0 }
// //     return {
// //       employees: empAgg.length,
// //       agents: empAgg.reduce((s,r)=> s + (r.agent_count || 0), 0),
// //       customers: empAgg.reduce((s,r)=> s + (r.customer_count || 0), 0)
// //     }
// //   }, [empAgg])

// //   const fmtMoney = n => new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(n||0))
// //   const fmtPct = n => `${(Number(n||0) * 100).toFixed(2)}%`

// //   return (
// //     <div className="space-y-6">
// //       {/* Common header KPIs */}
// //       <div className="grid gap-4 md:grid-cols-3">
// //         <div className="kpi"><div className="text-sm opacity-80">Welcome</div><div className="text-xl font-bold">{user?.name || 'User'}</div><div className="tag mt-2">Role: {user?.role}</div></div>
// //         <div className="kpi"><div className="text-sm opacity-80">Email</div><div className="text-xl font-bold truncate">{user?.email}</div></div>
// //         <div className="kpi"><div className="text-sm opacity-80">ID</div><div className="text-xl font-bold truncate">{user?.id}</div></div>
// //       </div>

// //       {/* ===================== ADMIN VIEW ===================== */}
// //       {(user?.role === 'admin' || user?.role === 'super_admin') && (
// //         <>
// //           <div className="grid gap-4 md:grid-cols-3">
// //             <div className="kpi"><div className="text-sm opacity-80">Employees</div><div className="text-2xl font-bold">{totals.employees}</div></div>
// //             <div className="kpi"><div className="text-sm opacity-80">Agents (total)</div><div className="text-2xl font-bold">{totals.agents}</div></div>
// //             <div className="kpi"><div className="text-sm opacity-80">Customers (total)</div><div className="text-2xl font-bold">{totals.customers}</div></div>
// //           </div>

// //           <Card
// //             title="Employees Overview"
// //             subtitle="Employees with number of agents under them and total customers"
// //             actions={<Button variant="outline" onClick={load} disabled={empAggLoading}>{empAggLoading ? 'Loading…' : 'Refresh'}</Button>}
// //           >
// //             <DataTable
// //               columns={[
// //                 { key: 'name', label: 'Employee Name' },
// //                 { key: 'email', label: 'Email' },
// //                 { key: 'agent_count', label: '# Agents' },
// //                 { key: 'customer_count', label: '# Customers' },
// //               ]}
// //               rows={empAgg}
// //             />
// //           </Card>
// //         </>
// //       )}

// //       {/* ===================== EMPLOYEE VIEW ===================== */}
// //       {user?.role === 'employee' && (
// //         <Card
// //           title="My Agents"
// //           subtitle="Agents under you with their customer counts"
// //           actions={<Button variant="outline" onClick={load} disabled={myAgentsLoading}>{myAgentsLoading ? 'Loading…' : 'Refresh'}</Button>}
// //         >
// //           <DataTable
// //             columns={[
// //               { key: 'agent_name', label: 'Agent Name' },
// //               { key: 'agent_email', label: 'Email' },
// //               { key: 'customer_count', label: '# Customers' },
// //             ]}
// //             rows={myAgents}
// //           />
// //         </Card>
// //       )}

// //       {/* ===================== AGENT VIEW ===================== */}
// //       {user?.role === 'agent' && (
// //         <>
// //           <div className="grid gap-4 md:grid-cols-2">
// //             <Card title="Compensation" subtitle="Your current base salary & commission">
// //               <div className="grid grid-cols-2 gap-4 text-sm">
// //                 <div className="kpi">
// //                   <div className="text-sm opacity-80">Base Salary</div>
// //                   <div className="text-2xl font-bold">{fmtMoney(comp?.base_salary)}</div>
// //                 </div>
// //                 <div className="kpi">
// //                   <div className="text-sm opacity-80">Commission Rate</div>
// //                   <div className="text-2xl font-bold">{fmtPct(comp?.commission_rate)}</div>
// //                 </div>
// //               </div>
// //             </Card>
// //             <div className="hidden md:block" />
// //           </div>

// //           <Card title="My Monthly Sales" subtitle="Last months">
// //             <div className="h-64">
// //               {aStats.length === 0 ? (
// //                 <div className="h-full flex items-center justify-center text-sm opacity-70">
// //                   No sales data yet.
// //                 </div>
// //               ) : (
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <BarChart data={aStats}>
// //                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
// //                     <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
// //                     <YAxis tick={{fill:'#9ca3af'}} />
// //                     <Tooltip contentStyle={{background:'#365cb4ff', border:'1px solid #a8b0bbff', color:'#e5e7eb'}} />
// //                     <Bar dataKey="sales_count" />
// //                   </BarChart>
// //                 </ResponsiveContainer>
// //               )}
// //             </div>
// //           </Card>

// //           <Card title="Premium And Commission">
// //             <div className="h-64">
// //               {aStats.length === 0 ? (
// //                 <div className="h-full flex items-center justify-center text-sm opacity-70">
// //                   No premium/commission data yet.
// //                 </div>
// //               ) : (
// //                 <ResponsiveContainer width="100%" height="100%">
// //                   <LineChart data={aStats}>
// //                     <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
// //                     <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
// //                     <YAxis tick={{fill:'#9ca3af'}} />
// //                     <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb'}} />
// //                     <Line type="monotone" dataKey="total_premium" />
// //                     <Line type="monotone" dataKey="total_commission" />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               )}
// //             </div>
// //           </Card>
// //         </>
// //       )}
// //     </div>
// //   )
// // }



// import React, { useEffect, useMemo, useState } from 'react'
// import Card from '../components/ui/Card'
// import Button from '../components/ui/Button'
// import { useAuth } from '../lib/auth.jsx'
// import { api } from '../lib/api'
// import DataTable from '../components/data/DataTable'
// import {
//   BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
//   LineChart, Line, YAxis, CartesianGrid
// } from 'recharts'

// function fmtMoney(n){
//   if (n == null) return '₹0'
//   try { return new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits: 0 }).format(n) }
//   catch{ return `₹${n}` }
// }

// export default function Dashboard(){
//   const { user } = useAuth()

//   // Agent stats
//   const [aStats, setAStats] = useState([])

//   // Admin aggregates (employees -> #agents, #customers)
//   const [empAgg, setEmpAgg] = useState([])
//   const [empAggLoading, setEmpAggLoading] = useState(false)

//   // Employee overview (agents under me) + summary
//   const [myAgents, setMyAgents] = useState([])
//   const [myAgentsLoading, setMyAgentsLoading] = useState(false)
//   const [empSummary, setEmpSummary] = useState({ agent_count: 0, customer_count: 0, base_salary: 0 })

//   async function load() {
//     if (!user) return
//     if (user.role === 'agent') {
//       setAStats(await api.agent.stats())
//     } else if (user.role === 'employee') {
//       setMyAgentsLoading(true)
//       try {
//         const [agents, sum] = await Promise.all([
//           api.employee.agentsOverview(),
//           api.employee.summary()
//         ])
//         setMyAgents(agents || [])
//         setEmpSummary(sum || { agent_count: 0, customer_count: 0, base_salary: 0 })
//       } finally {
//         setMyAgentsLoading(false)
//       }
//     } else if (user.role === 'admin' || user.role === 'super_admin') {
//       setEmpAggLoading(true)
//       try { setEmpAgg(await api.admin.employeeAggregates()) }
//       finally { setEmpAggLoading(false) }
//     }
//   }

//   useEffect(()=>{ load() /* eslint-disable-next-line */ }, [user])

//   const totals = useMemo(() => {
//     if (!empAgg?.length) return { employees: 0, agents: 0, customers: 0 }
//     return {
//       employees: empAgg.length,
//       agents: empAgg.reduce((s,r)=> s + (r.agent_count || 0), 0),
//       customers: empAgg.reduce((s,r)=> s + (r.customer_count || 0), 0)
//     }
//   }, [empAgg])

//   return (
//     <div className="space-y-6">
//       {/* Common header KPIs */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <div className="kpi">
//           <div className="text-sm opacity-80">Welcome</div>
//           <div className="text-xl font-bold">{user?.name || 'User'}</div>
//           <div className="tag mt-2">Role: {user?.role}</div>
//         </div>
//         <div className="kpi">
//           <div className="text-sm opacity-80">Email</div>
//           <div className="text-xl font-bold truncate">{user?.email}</div>
//         </div>
//         <div className="kpi">
//           <div className="text-sm opacity-80">ID</div>
//           <div className="text-xl font-bold truncate">{user?.id}</div>
//         </div>
//       </div>

//       {/* ===================== ADMIN VIEW ===================== */}
//       {(user?.role === 'admin' || user?.role === 'super_admin') && (
//         <>
//           <div className="grid gap-4 md:grid-cols-3">
//             <div className="kpi"><div className="text-sm opacity-80">Employees</div><div className="text-2xl font-bold">{totals.employees}</div></div>
//             <div className="kpi"><div className="text-sm opacity-80">Agents (total)</div><div className="text-2xl font-bold">{totals.agents}</div></div>
//             <div className="kpi"><div className="text-sm opacity-80">Customers (total)</div><div className="text-2xl font-bold">{totals.customers}</div></div>
//           </div>

//           <Card
//             title="Employees Overview"
//             subtitle="Employees with number of agents under them and total customers"
//             actions={<Button variant="outline" onClick={load} disabled={empAggLoading}>{empAggLoading ? 'Loading…' : 'Refresh'}</Button>}
//           >
//             <DataTable
//               columns={[
//                 { key: 'name', label: 'Employee Name' },
//                 { key: 'email', label: 'Email' },
//                 { key: 'agent_count', label: '# Agents' },
//                 { key: 'customer_count', label: '# Customers' },
//               ]}
//               rows={empAgg}
//             />
//           </Card>
//         </>
//       )}

//       {/* ===================== EMPLOYEE VIEW ===================== */}
//       {user?.role === 'employee' && (
//         <>
//           <div className="grid gap-4 md:grid-cols-3">
//             <div className="kpi">
//               <div className="text-sm opacity-80">My Agents</div>
//               <div className="text-2xl font-bold">{empSummary.agent_count}</div>
//             </div>
//             <div className="kpi">
//               <div className="text-sm opacity-80">Customers Under Me</div>
//               <div className="text-2xl font-bold">{empSummary.customer_count}</div>
//             </div>
//             <div className="kpi">
//               <div className="text-sm opacity-80">My Salary</div>
//               <div className="text-2xl font-bold">{fmtMoney(empSummary.base_salary)}</div>
//             </div>
//           </div>

//           <Card
//             title="My Agents"
//             subtitle="Agents under you with their customer counts"
//             actions={<Button variant="outline" onClick={load} disabled={myAgentsLoading}>{myAgentsLoading ? 'Loading…' : 'Refresh'}</Button>}
//           >
//             <DataTable
//               columns={[
//                 { key: 'agent_name', label: 'Agent Name' },
//                 { key: 'agent_email', label: 'Email' },
//                 { key: 'customer_count', label: '# Customers' },
//               ]}
//               rows={myAgents}
//             />
//           </Card>
//         </>
//       )}

//       {/* ===================== AGENT VIEW ===================== */}
//       {user?.role === 'agent' && (
//         <>
//           <Card title="My Monthly Sales" subtitle="Last months">
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart data={aStats}>
//                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
//                   <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
//                   <YAxis tick={{fill:'#9ca3af'}} />
//                   <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb'}} />
//                   <Bar dataKey="sales_count" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>

//           <Card title="Premium vs Commission">
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={aStats}>
//                   <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
//                   <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
//                   <YAxis tick={{fill:'#9ca3af'}} />
//                   <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb'}} />
//                   <Line type="monotone" dataKey="total_premium" />
//                   <Line type="monotone" dataKey="total_commission" />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </Card>
//         </>
//       )}
//     </div>
//   )
// }


import React, { useEffect, useMemo, useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useAuth } from '../lib/auth'
import { api } from '../lib/api'
import DataTable from '../components/data/DataTable'
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, YAxis, CartesianGrid
} from 'recharts'

function Tag({ children, color='slate' }) {
  const colors = {
    green: 'bg-green-500/15 text-green-300 border-green-500/30',
    red: 'bg-red-500/15 text-red-300 border-red-500/30',
    yellow: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    slate: 'bg-slate-500/15 text-slate-200 border-slate-500/30'
  }
  return <span className={`px-2 py-0.5 rounded-full border text-xs ${colors[color] || colors.slate}`}>{children}</span>
}

export default function Dashboard(){
  const { user } = useAuth()

  // Agent stats
  const [aStats, setAStats] = useState([])

  // Admin aggregates (employees -> #agents, #customers)
  const [empAgg, setEmpAgg] = useState([])
  const [empAggLoading, setEmpAggLoading] = useState(false)

  // Employee overview (agents under me -> email, #customers)
  const [myAgents, setMyAgents] = useState([])
  const [myAgentsLoading, setMyAgentsLoading] = useState(false)

  // Modal state for initial creds (employee viewing an agent)
  const [showCreds, setShowCreds] = useState(false)
  const [creds, setCreds] = useState({ agent: null, temp_password: null, is_changed: null })
  const inr = (n) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

  async function load() {
    if (!user) return
    if (user.role === 'agent') {
      setAStats(await api.agent.stats())
    } else if (user.role === 'employee') {
      setMyAgentsLoading(true)
      try { setMyAgents(await api.employee.agentsOverview()) }
      finally { setMyAgentsLoading(false) }
    } else if (user.role === 'admin' || user.role === 'super_admin') {
      setEmpAggLoading(true)
      try { setEmpAgg(await api.admin.employeeAggregates()) }
      finally { setEmpAggLoading(false) }
    }
  }

  useEffect(()=>{ load() /* eslint-disable-next-line */ }, [user])

  const totals = useMemo(() => {
    if (!empAgg?.length) return { employees: 0, agents: 0, customers: 0 }
    return {
      employees: empAgg.length,
      agents: empAgg.reduce((s,r)=> s + (r.agent_count || 0), 0),
      customers: empAgg.reduce((s,r)=> s + (r.customer_count || 0), 0)
    }
  }, [empAgg])

  function copy(text){
    if (!text) return
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      {/* Common header KPIs */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="kpi">
          <div className="text-sm opacity-80">Welcome</div>
          <div className="text-xl font-bold">{user?.name || 'User'}</div>
          <div className="tag mt-2">Role: {user?.role}</div>
        </div>
        <div className="kpi">
          <div className="text-sm opacity-80">Email</div>
          <div className="text-xl font-bold truncate">{user?.email}</div>
        </div>
        <div className="kpi">
          <div className="text-sm opacity-80">ID</div>
          <div className="text-xl font-bold truncate">{user?.id}</div>
        </div>
      </div>

      {/* ===================== ADMIN VIEW ===================== */}
      {(user?.role === 'admin' || user?.role === 'super_admin') && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="kpi"><div className="text-sm opacity-80">Employees</div><div className="text-2xl font-bold">{totals.employees}</div></div>
            <div className="kpi"><div className="text-sm opacity-80">Agents (total)</div><div className="text-2xl font-bold">{totals.agents}</div></div>
            <div className="kpi"><div className="text-sm opacity-80">Customers (total)</div><div className="text-2xl font-bold">{totals.customers}</div></div>
          </div>

          <Card
            title="Employees Overview"
            subtitle="Employees with number of agents under them and total customers"
            actions={<Button variant="outline" onClick={load} disabled={empAggLoading}>{empAggLoading ? 'Loading…' : 'Refresh'}</Button>}
          >
            <DataTable
              columns={[
                { key: 'name', label: 'Employee Name' },
                { key: 'email', label: 'Email' },
                { key: 'agent_count', label: '# Agents' },
                { key: 'customer_count', label: '# Customers' },
                { key: 'total_premium_month', label: 'Total Premium', render: (v) => inr(v) },
              ]}
              rows={empAgg}
            />
          </Card>
        </>
      )}

      {/* ===================== EMPLOYEE VIEW ===================== */}
      {user?.role === 'employee' && (
        <Card
          title="My Agents"
          subtitle="Agents under you with their customer counts"
          actions={<Button variant="outline" onClick={load} disabled={myAgentsLoading}>{myAgentsLoading ? 'Loading…' : 'Refresh'}</Button>}
        >
          <DataTable
            columns={[
              { key: 'agent_name', label: 'Agent Name' },
              { key: 'agent_email', label: 'Email' },
              { key: 'customer_count', label: '# Customers' },
              { key: 'actions', label: 'Actions', render: (_v, row) => (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={async ()=>{
                      try{
                        const d = await api.employee.initialCreds(row.agent_id)
                        setCreds({ agent: row, temp_password: d?.temp_password || null, is_changed: !!d?.is_changed })
                        setShowCreds(true)
                      }catch{ /* toast handled in api */ }
                    }}
                  >
                    View Init Creds
                  </Button>
                </div>
              ) }
            ]}
            rows={myAgents}
          />

          {/* simple modal for initial creds */}
          {showCreds && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-[560px] max-w-[92vw] rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-lg font-semibold">Initial Credentials</div>
                    <div className="text-sm text-slate-400">
                      {creds.agent?.agent_name} • {creds.agent?.agent_email}
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
                    Share the temp password only once. The agent should change it on first login.
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button onClick={()=>setShowCreds(false)}>Close</Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ===================== AGENT VIEW ===================== */}
      {user?.role === 'agent' && (
        <>
          <Card title="My Monthly Sales" subtitle="Last months">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={aStats}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
                  <YAxis tick={{fill:'#9ca3af'}} />
                  <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb'}} />
                  <Bar dataKey="sales_count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Premium vs Commission">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aStats}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis dataKey="month" tick={{fill:'#9ca3af'}} />
                  <YAxis tick={{fill:'#9ca3af'}} />
                  <Tooltip contentStyle={{background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb'}} />
                  <Line type="monotone" dataKey="total_premium" />
                  <Line type="monotone" dataKey="total_commission" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
