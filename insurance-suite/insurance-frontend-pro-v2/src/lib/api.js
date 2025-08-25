
// import { toast } from '../components/ui/Toast'

// let accessToken = ''
// export function setAccessToken(t){ accessToken = t || '' }
// export const getAccessToken = () => accessToken

// const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// // one in-flight refresh at a time
// let refreshPromise = null
// async function refreshAccessTokenOnce(){
//   if (refreshPromise) return refreshPromise
//   refreshPromise = (async () => {
//     const r = await fetch(API + '/api/auth/refresh', { method:'POST', credentials:'include' })
//     if (!r.ok) throw new Error('refresh_failed')
//     const d = await r.json()
//     setAccessToken(d.access_token || '')
//     return d.access_token
//   })()
//   try { return await refreshPromise } finally { refreshPromise = null }
// }

// async function request(path, { method='GET', body, headers={} } = {}){
//   const url = API + path
//   const isLogin = path.startsWith('/api/auth/login')
//   const isRefresh = path.startsWith('/api/auth/refresh')

//   const res = await fetch(url, {
//     method,
//     headers: {
//       'Content-Type':'application/json',
//       ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//       ...headers
//     },
//     credentials: 'include',
//     body: body ? JSON.stringify(body) : undefined
//   })

//   // If unauthorized:
//   // - Do NOT try refresh for /login (prevents infinite loops on bad creds)
//   // - Do NOT recurse on /refresh itself
//   if (res.status === 401 && !isLogin && !isRefresh) {
//     try {
//       await refreshAccessTokenOnce()
//       // retry the original request exactly once
//       const retry = await fetch(url, {
//         method,
//         headers: {
//           'Content-Type':'application/json',
//           ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
//           ...headers
//         },
//         credentials: 'include',
//         body: body ? JSON.stringify(body) : undefined
//       })
//       if (!retry.ok) {
//         let m = 'Request failed'
//         try { const j = await retry.json(); m = j.error || j.message || m } catch {}
//         toast.error(m); throw new Error(m)
//       }
//       return retry.json()
//     } catch {
//       // refresh failed; fall through to standard error handling
//     }
//   }

//   if (!res.ok){
//     let msg = 'Request failed'
//     try{
//       const j = await res.json()
//       msg = j.error || j.message || msg
//     }catch{}
//     // Avoid double toasts on login page loops
//     toast.error(msg)
//     throw new Error(msg)
//   }
//   return res.json()
// }

// export const api = {
//     refresh: () => fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/auth/refresh', {
//     method: 'POST',
//     credentials: 'include',
//     headers: { 'Content-Type': 'application/json' }
//   }).then(async r => {
//     if (!r.ok) throw new Error('refresh failed')
//     return r.json()
//   }),
//   // ===== auth =====
//   login: (email,password)=>request('/api/auth/login',{method:'POST',body:{email,password}}),
//   logout: ()=>request('/api/auth/logout',{method:'POST'}),
//   changePassword: (current_password, new_password) =>
//     request('/api/auth/change-password', { method:'POST', body:{ current_password, new_password } })
//       .then(d => { if (d?.access_token) setAccessToken(d.access_token); return d }),

//   // ===== admin =====
//   admin: {
//     createUser: (payload)=>request('/api/admin/users',{method:'POST',body:payload}).then(d=>{toast.success('User created'); return d;}),
//     setEmpSalary: (id,base_salary)=>request(`/api/admin/employees/${id}/salary`,{method:'POST',body:{base_salary}}).then(d=>{toast.success('Salary updated'); return d;}),
//     setAgentComp: (id,base_salary,commission_rate)=>request(`/api/admin/agents/${id}/comp`,{method:'POST',body:{base_salary,commission_rate}}).then(d=>{toast.success('Comp updated'); return d;}),
//     setAgentSupervisor: (agentId, employee_user_id)=>request(`/api/admin/agents/${agentId}/supervisor`,{method:'POST',body:{employee_user_id}}).then(d=>{toast.success('Supervisor set'); return d;}),
//     setAgentTarget: (id,month,target_value)=>request(`/api/admin/agents/${id}/targets`,{method:'POST',body:{month,target_value}}).then(d=>{toast.success('Target saved'); return d;}),
//     addTargetProgress: (id,month,delta,note)=>request(`/api/admin/agents/${id}/targets/progress`,{method:'POST',body:{month,delta,note}}).then(d=>{toast.success('Progress added'); return d;}),
//     upsertMonthlyStats: (id,month,sales_count,total_premium,total_commission)=>request(`/api/admin/agents/${id}/monthly-stats`,{method:'POST',body:{month,sales_count,total_premium,total_commission}}).then(d=>{toast.success('Stats saved'); return d;}),

//     setCustomerStatus: (cid,status)=>request(`/api/admin/customers/${cid}/status`,{method:'POST',body:{status}}).then(d=>{toast.success('Customer status updated'); return d;}),
//     setCustomerPremiumNumber: (cid, premium_number)=>request(`/api/admin/customers/${cid}/premium-number`, { method:'POST', body:{ premium_number } }).then(d=>{toast.success('Premium number updated'); return d;}),

//     customers: (opts = {}) => {
//       const q = new URLSearchParams()
//       if (opts.status)   q.set('status', opts.status)
//       if (opts.agent_id) q.set('agent_id', opts.agent_id)
//       const qs = q.toString()
//       return request(`/api/admin/customers${qs ? `?${qs}` : ''}`)
//     },

//     users: ()=>request('/api/admin/overview/users'),
//     agents: ()=>request('/api/admin/overview/agents'),
//     agentCustomers: (id)=>request(`/api/admin/overview/agents/${id}/customers`),
//     employees: ()=>request('/api/admin/overview/employees'),
//     employeeAggregates: ()=>request('/api/admin/overview/employees-aggregate'),

//     upsertAgentProfile: (user_id, payload)=>request(`/api/admin/agents/${user_id}/profile`, { method:'POST', body: payload }).then(d=>{toast.success('Agent profile saved'); return d;}),
//     upsertAgentBank: (user_id, payload)=>request(`/api/admin/agents/${user_id}/bank`, { method:'POST', body: payload }).then(d=>{toast.success('Agent bank saved'); return d;}),
//     upsertAgentEducation: (user_id, payload)=>request(`/api/admin/agents/${user_id}/education`, { method:'POST', body: payload }).then(d=>{toast.success('Agent education saved'); return d;}),

//     upsertEmployeeProfile: (user_id, payload)=>request(`/api/admin/employees/${user_id}/profile`, { method:'POST', body: payload }).then(d=>{toast.success('Employee profile saved'); return d;}),
//     upsertEmployeeBank: (user_id, payload)=>request(`/api/admin/employees/${user_id}/bank`, { method:'POST', body: payload }).then(d=>{toast.success('Employee bank saved'); return d;}),
//     upsertEmployeeEducation: (user_id, payload)=>request(`/api/admin/employees/${user_id}/education`, { method:'POST', body: payload }).then(d=>{toast.success('Employee education saved'); return d;}),

//     findUserIdByEmail: async (email)=>{
//       const list = await request('/api/admin/overview/users')
//       return (list.find(u => (u.email||'').toLowerCase() === (email||'').toLowerCase()) || {}).id
//     }
//   },

//   // ===== employee =====
//   employee: {
//     me: ()=>request('/api/employee/me'),
//     agents: ()=>request('/api/employee/agents'),
//     customers: ()=>request('/api/employee/customers'),
//     setCustomerStatus: (id,status)=>request(`/api/employee/customers/${id}/status`,{method:'POST',body:{status}}),
//     agentsOverview: ()=>request('/api/employee/agents/overview'),
//       addAgent: (payload)=>request('/api/employee/agents',{method:'POST',body:payload})
//     .then(d=>{ toast.success('Agent created'); return d }),
//      summary: ()=>request('/api/employee/summary'),
//   },

//   // ===== agent =====
//   agent: {
//     me: ()=>request('/api/agent/me'),
//     addCustomer: (payload)=>request('/api/agent/customers',{method:'POST',body:payload}).then(d=>{toast.success('Customer added'); return d;}),
//     customers: (status)=>request('/api/agent/customers'+(status?`?status=${encodeURIComponent(status)}`:'')),
//     targets: ()=>request('/api/agent/targets'),
//     compensation: () => request('/api/agent/compensation'),
//     stats: ()=>request('/api/agent/stats'),
//   },

//   // ===== public/customers (non-admin) =====
//   customers: {
//     list: (status)=>request('/api/customers?status='+(status?encodeURIComponent(status):'')),
//   }
// }


// src/lib/api.js
import { toast } from '../components/ui/Toast'

let accessToken = ''
export function setAccessToken(t){ accessToken = t || '' }
export const getAccessToken = () => accessToken

const API = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// one in-flight refresh at a time
let refreshPromise = null
async function refreshAccessTokenOnce(){
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    const r = await fetch(API + '/api/auth/refresh', { method:'POST', credentials:'include' })
    if (!r.ok) throw new Error('refresh_failed')
    const d = await r.json()
    setAccessToken(d.access_token || '')
    return d.access_token
  })()
  try { return await refreshPromise } finally { refreshPromise = null }
}

async function request(path, { method='GET', body, headers={} } = {}){
  const url = API + path
  const isLogin = path.startsWith('/api/auth/login')
  const isRefresh = path.startsWith('/api/auth/refresh')

  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type':'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  })

  // 401 → try one refresh (but not for /login or /refresh)
  if (res.status === 401 && !isLogin && !isRefresh) {
    try {
      await refreshAccessTokenOnce()
      const retry = await fetch(url, {
        method,
        headers: {
          'Content-Type':'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          ...headers
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined
      })
      if (!retry.ok) {
        let m = 'Request failed'
        try { const j = await retry.json(); m = j.error || j.message || m } catch {}
        toast.error(m)
        const err = new Error(m)
        err.status = retry.status          // preserve HTTP status on retry failure
        throw err
      }
      return retry.json()
    } catch {
      // refresh failed; fall through to standard error handling below
    }
  }

  if (!res.ok){
    let msg = 'Request failed'
    try{
      const j = await res.json()
      msg = j.error || j.message || msg
    }catch{}
    toast.error(msg)
    const err = new Error(msg)
    err.status = res.status                // preserve original HTTP status
    throw err
  }

  return res.json()
}

export const api = {
  // raw refresh helper (optional)
  refresh: () => fetch((import.meta.env.VITE_API_BASE || 'http://localhost:5000') + '/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' }
  }).then(async r => {
    if (!r.ok) throw new Error('refresh failed')
    return r.json()
  }),


  login: (email,password)=>request('/api/auth/login',{method:'POST',body:{email,password}}),
  logout: ()=>request('/api/auth/logout',{method:'POST'}),
  changePassword: (current_password, new_password) =>
    request('/api/auth/change-password', { method:'POST', body:{ current_password, new_password } })
      .then(d => { if (d?.access_token) setAccessToken(d.access_token); return d }),


  admin: {
     initialCreds: (userId)=>request(`/api/admin/users/${encodeURIComponent(userId)}/initial-creds`)
      .then(d=>{ if (d?.temp_password) toast.info('Initial credentials loaded'); return d; }),
    createUser: (payload)=>request('/api/admin/users',{method:'POST',body:payload}).then(d=>{toast.success('User created'); return d;}),
    setEmpSalary: (id,base_salary)=>request(`/api/admin/employees/${id}/salary`,{method:'POST',body:{base_salary}}).then(d=>{toast.success('Salary updated'); return d;}),
    setAgentComp: (id,base_salary,commission_rate)=>request(`/api/admin/agents/${id}/comp`,{method:'POST',body:{base_salary,commission_rate}}).then(d=>{toast.success('Comp updated'); return d;}),
    setAgentSupervisor: (agentId, employee_user_id)=>request(`/api/admin/agents/${agentId}/supervisor`,{method:'POST',body:{employee_user_id}}).then(d=>{toast.success('Supervisor set'); return d;}),
    setAgentTarget: (id,month,target_value)=>request(`/api/admin/agents/${id}/targets`,{method:'POST',body:{month,target_value}}).then(d=>{toast.success('Target saved'); return d;}),
    addTargetProgress: (id,month,delta,note)=>request(`/api/admin/agents/${id}/targets/progress`,{method:'POST',body:{month,delta,note}}).then(d=>{toast.success('Progress added'); return d;}),
    upsertMonthlyStats: (id,month,sales_count,total_premium,total_commission)=>request(`/api/admin/agents/${id}/monthly-stats`,{method:'POST',body:{month,sales_count,total_premium,total_commission}}).then(d=>{toast.success('Stats saved'); return d;}),

    setCustomerStatus: (cid,status)=>request(`/api/admin/customers/${cid}/status`,{method:'POST',body:{status}}).then(d=>{toast.success('Customer status updated'); return d;}),
    setCustomerPremiumNumber: (cid, premium_number)=>request(`/api/admin/customers/${cid}/premium-number`, { method:'POST', body:{ premium_number } }).then(d=>{toast.success('Premium number updated'); return d;}),

    customers: (opts = {}) => {
      const q = new URLSearchParams()
      if (opts.status)   q.set('status', opts.status)
      if (opts.agent_id) q.set('agent_id', opts.agent_id)
      const qs = q.toString()
      return request(`/api/admin/customers${qs ? `?${qs}` : ''}`)
    },

    users: ()=>request('/api/admin/overview/users'),
    agents: ()=>request('/api/admin/overview/agents'),
    agentCustomers: (id)=>request(`/api/admin/overview/agents/${id}/customers`),
    employees: ()=>request('/api/admin/overview/employees'),
    employeeAggregates: ()=>request('/api/admin/overview/employees-aggregate'),

    upsertAgentProfile: (user_id, payload)=>request(`/api/admin/agents/${user_id}/profile`, { method:'POST', body: payload }).then(d=>{toast.success('Agent profile saved'); return d;}),
    upsertAgentBank: (user_id, payload)=>request(`/api/admin/agents/${user_id}/bank`, { method:'POST', body: payload }).then(d=>{toast.success('Agent bank saved'); return d;}),
    upsertAgentEducation: (user_id, payload)=>request(`/api/admin/agents/${user_id}/education`, { method:'POST', body: payload }).then(d=>{toast.success('Agent education saved'); return d;}),

    upsertEmployeeProfile: (user_id, payload)=>request(`/api/admin/employees/${user_id}/profile`, { method:'POST', body: payload }).then(d=>{toast.success('Employee profile saved'); return d;}),
    upsertEmployeeBank: (user_id, payload)=>request(`/api/admin/employees/${user_id}/bank`, { method:'POST', body: payload }).then(d=>{toast.success('Employee bank saved'); return d;}),
    upsertEmployeeEducation: (user_id, payload)=>request(`/api/admin/employees/${user_id}/education`, { method:'POST', body: payload }).then(d=>{toast.success('Employee education saved'); return d;}),

    findUserIdByEmail: async (email)=>{
      const list = await request('/api/admin/overview/users')
      return (list.find(u => (u.email||'').toLowerCase() === (email||'').toLowerCase()) || {}).id
    },
    deleteEmployee: (id) =>
    request(`/api/admin/employees/${id}`, { method: 'DELETE' })
    .then(d => { toast.success('Employee deleted'); return d }),

    deleteAgent: (id) =>
    request(`/api/admin/agents/${id}`, { method: 'DELETE' })
    .then(d => { toast.success('Agent deleted'); return d }),
    customerById: (id) => request(`/api/admin/customers/${encodeURIComponent(id)}`),
    agentSummary: (id) => request(`/api/admin/agents/${encodeURIComponent(id)}/summary`),

  setEmployeeTarget: (id, month, target_sales, target_premium) =>
  request(`/api/admin/employees/${encodeURIComponent(id)}/targets`, {
    method: 'POST',
    body: {
      month,                                 // "YYYY-MM" or "YYYY-MM-01"
      target_sales: Number(target_sales) || 0,
      target_premium: Number(target_premium) || 0
    }
  }).then(d => { toast.success('Employee target saved'); return d; }),

  addEmployeeTargetProgress: (id, month, delta_sales, delta_premium, note) =>
  request(`/api/admin/employees/${encodeURIComponent(id)}/targets/progress`, {
    method: 'POST',
    body: {
      month,                                 // "YYYY-MM" or "YYYY-MM-01"
      delta_sales: Number(delta_sales) || 0,
      delta_premium: Number(delta_premium) || 0,
      note: note || null
    }
  }).then(d => { toast.success('Employee progress added'); return d; }),

    },

   
  
  employee: {
    me: ()=>request('/api/employee/me'),
    agents: ()=>request('/api/employee/agents'),
    customers: ()=>request('/api/employee/customers'),
    setCustomerStatus: (id,status)=>request(`/api/employee/customers/${id}/status`,{method:'POST',body:{status}}),
    agentsOverview: ()=>request('/api/employee/agents/overview'),
    addAgent: (payload)=>request('/api/employee/agents',{method:'POST',body:payload})
      .then(d=>{ toast.success('Agent created'); return d }),
      
    summary: ()=>request('/api/employee/summary'),

    initialCreds: (agentId)=>request(`/api/employee/agents/${encodeURIComponent(agentId)}/initial-creds`)
      .then(d=>{ if (d?.temp_password)  return d }),
    customerById: (id) => request(`/api/employee/customers/${encodeURIComponent(id)}`),
    agentSummary: (id) => request(`/api/employee/agents/${encodeURIComponent(id)}/summary`),
     targetSummary: (month) =>request(`/api/employee/targets/summary?month=${encodeURIComponent(month)}`),
    
    },
  

  
  agent: {
    me: ()=>request('/api/agent/me'),
    addCustomer: (payload)=>request('/api/agent/customers',{method:'POST',body:payload}).then(d=>{toast.success('Customer added'); return d;}),
    customers: (status)=>request('/api/agent/customers'+(status?`?status=${encodeURIComponent(status)}`:'')),
    targets: ()=>request('/api/agent/targets'),
    compensation: () => request('/api/agent/compensation'),
    stats: ()=>request('/api/agent/stats'),
  },

  customers: {
    list: (status)=>request('/api/customers?status='+(status?encodeURIComponent(status):'')),
  }
}
