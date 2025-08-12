// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'

// const init = {
//   name:'', email:'', phone_no:'', password:'',
//   pan_number:'', aadhaar_number:'',
//   bank_name:'', account_no:'', ifsc_code:'',
//   tenth_percent:'', twelfth_percent:'', degree_percent:''
// }

// function monthFirstDay(d=new Date()){
//   const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01`
// }

// export default function Agents() {
//   const [agents, setAgents] = useState([])
//   const [form, setForm] = useState(init)
//   const [saving, setSaving] = useState(false)
//   const [comp, setComp] = useState({ base_salary:'', incentive_rate:'' })
//   const [selected, setSelected] = useState(null)
//   const [targetMap, setTargetMap] = useState({})
//   const [initialPwd, setInitialPwd] = useState(null)

//   async function load(){
//     const data = await http('/api/admin/agents')
//     setAgents(data)
//   }
//   useEffect(()=>{ load() }, [])

//   function onChange(e){ setForm(f => ({...f, [e.target.name]: e.target.value })) }

//   async function createAgent(e){
//     e.preventDefault()
//     setSaving(true)
//     try {
//       const payload = {
//         ...form,
//         tenth_percent: form.tenth_percent ? Number(form.tenth_percent) : undefined,
//         twelfth_percent: form.twelfth_percent ? Number(form.twelfth_percent) : undefined,
//         degree_percent: form.degree_percent ? Number(form.degree_percent) : undefined
//       }
//       const created = await http('/api/admin/agents', { method:'POST', body: payload })
//       setForm(init)
//       await load()
//       alert('Agent created. Initial password: ' + (created.initial_password || '(hidden)'))
//     } finally { setSaving(false) }
//   }

//   async function updateComp(e){
//     e.preventDefault()
//     if (!selected) return
//     await http(`/api/admin/agents/${selected}/compensation`, { method:'PUT', body:{
//       base_salary: Number(comp.base_salary || 0),
//       incentive_rate: Number(comp.incentive_rate || 0)
//     }})
//     setComp({ base_salary:'', incentive_rate:'' })
//     setSelected(null)
//     await load()
//   }

//   function onTargetChange(agentId, key, value){
//     setTargetMap(m => ({ ...m, [agentId]: { ...(m[agentId]||{ month: monthFirstDay(), target_value: '' , description:'' }), [key]: value } }))
//   }

//   async function saveTarget(agentId){
//     const t = targetMap[agentId] || { month: monthFirstDay(), target_value: '', description:'' }
//     if (!t.target_value) return alert('Enter a target value')
//     await http(`/api/admin/agents/${agentId}/targets`, { method:'POST', body:{
//       month: t.month,
//       target_value: Number(t.target_value),
//       description: t.description || undefined
//     }})
//     alert('Target saved')
//   }

//   async function showInitialPassword(agentId){
//     try {
//       const res = await http(`/api/admin/agents/${agentId}/initial-password`)
//       setInitialPwd(res.initial_password + ' (expires: ' + new Date(res.expires_at).toLocaleString() + ')')
//     } catch (e) {
//       setInitialPwd('Not available: ' + e.message)
//     }
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="grid lg:grid-cols-2 gap-6">
//         <form onSubmit={createAgent} className="card space-y-4">
//           <div className="text-lg font-semibold">Add New Agent</div>
//           <div className="grid sm:grid-cols-2 gap-4">
//             <Field name="name" label="Name" value={form.name} onChange={onChange} />
//             <Field name="email" label="Email" value={form.email} onChange={onChange} />
//             <Field name="phone_no" label="Phone" value={form.phone_no} onChange={onChange} />
//             <Field name="password" label="Password (auto if blank)" value={form.password} onChange={onChange} />
//             <Field name="pan_number" label="PAN" value={form.pan_number} onChange={onChange} />
//             <Field name="aadhaar_number" label="Aadhaar" value={form.aadhaar_number} onChange={onChange} />
//             <Field name="bank_name" label="Bank Name" value={form.bank_name} onChange={onChange} />
//             <Field name="account_no" label="Account No" value={form.account_no} onChange={onChange} />
//             <Field name="ifsc_code" label="IFSC" value={form.ifsc_code} onChange={onChange} />
//             <Field name="tenth_percent" label="10th %" value={form.tenth_percent} onChange={onChange} />
//             <Field name="twelfth_percent" label="12th %" value={form.twelfth_percent} onChange={onChange} />
//             <Field name="degree_percent" label="Degree %" value={form.degree_percent} onChange={onChange} />
//           </div>
//           <button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Create Agent'}</button>
//           {initialPwd && <div className="text-sm text-muted">Initial password: <span className="text-white">{initialPwd}</span></div>}
//         </form>

//         <form onSubmit={updateComp} className="card space-y-4">
//           <div className="text-lg font-semibold">Set Salary & Incentive</div>
//           <div className="grid sm:grid-cols-2 gap-4">
//             <select className="input select" value={selected || ''} onChange={e=>setSelected(e.target.value)}>
//               <option value="">Select Agent</option>
//               {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
//             </select>
//             <div />
//             <Field name="base_salary" label="Base Salary" value={comp.base_salary} onChange={e=>setComp({...comp, base_salary:e.target.value})} />
//             <Field name="incentive_rate" label="Incentive Rate" value={comp.incentive_rate} onChange={e=>setComp({...comp, incentive_rate:e.target.value})} />
//           </div>
//           <button className="btn">Update Compensation</button>
//         </form>
//       </div>

//       <div className="card">
//         <div className="text-lg font-semibold mb-4">All Agents</div>
//         <table className="table">
//           <thead>
//             <tr>
//               <th className="th">Name</th>
//               <th className="th">Email</th>
//               <th className="th">Phone</th>
//               <th className="th">PAN</th>
//               <th className="th">Aadhaar</th>
//               <th className="th">Bank</th>
//               <th className="th">Salary</th>
//               <th className="th">Incentive</th>
//               <th className="th">Target (month / value)</th>
//               <th className="th">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {agents.map(a => (
//               <tr key={a.id}>
//                 <td className="td">{a.name}</td>
//                 <td className="td">{a.email}</td>
//                 <td className="td">{a.phone_no}</td>
//                 <td className="td">{a.pan_number}</td>
//                 <td className="td">{a.aadhaar_number}</td>
//                 <td className="td">{a.bank_name} • {a.account_no}</td>
//                 <td className="td">₹{a.base_salary ?? 0}</td>
//                 <td className="td">{a.incentive_rate ?? 0}</td>
//                 <td className="td">
//                   <div className="grid sm:grid-cols-2 gap-2">
//                     <input className="input" type="month" value={(targetMap[a.id]?.month || monthFirstDay()).slice(0,7)} onChange={e=>onTargetChange(a.id, 'month', e.target.value + '-01')} />
//                     <input className="input" placeholder="Target value" value={targetMap[a.id]?.target_value || ''} onChange={e=>onTargetChange(a.id, 'target_value', e.target.value)} />
//                     <input className="input sm:col-span-2" placeholder="Description (optional)" value={targetMap[a.id]?.description || ''} onChange={e=>onTargetChange(a.id, 'description', e.target.value)} />
//                   </div>
//                 </td>
//                 <td className="td">
//                   <div className="flex gap-2">
//                     <button className="btn" onClick={() => saveTarget(a.id)}>Save Target</button>
//                     <button className="btn-outline" onClick={() => showInitialPassword(a.id)}>Show Initial Password</button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }

// function Field({ label, ...props }){
//   return (
//     <div>
//       <label className="label">{label}</label>
//       <input className="input" {...props} />
//     </div>
//   )
// }



// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'
// import ResponsiveTable from '../../components/ResponsiveTable'

// const init = {
//   name:'', email:'', phone_no:'', password:'',
//   pan_number:'', aadhaar_number:'',
//   bank_name:'', account_no:'', ifsc_code:'',
//   tenth_percent:'', twelfth_percent:'', degree_percent:''
// }

// function monthFirstDay(d=new Date()){
//   const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01`
// }

// export default function Agents() {
//   const [agents, setAgents] = useState([])
//   const [form, setForm] = useState(init)
//   const [saving, setSaving] = useState(false)

//   const [selected, setSelected] = useState(null)
//   const [comp, setComp] = useState({ base_salary:'', incentive_rate:'' })
//   // moved Target (month/value/desc) into the Set Salary & Incentive block
//   const [targetForm, setTargetForm] = useState({ month: monthFirstDay(), target_value:'', description:'' })

//   const [initialPwd, setInitialPwd] = useState(null)

//   async function load(){
//     const data = await http('/api/admin/agents')
//     setAgents(data)
//   }
//   useEffect(()=>{ load() }, [])

//   function onChange(e){ setForm(f => ({...f, [e.target.name]: e.target.value })) }

//   async function createAgent(e){
//     e.preventDefault()
//     setSaving(true)
//     try {
//       const payload = {
//         ...form,
//         tenth_percent: form.tenth_percent ? Number(form.tenth_percent) : undefined,
//         twelfth_percent: form.twelfth_percent ? Number(form.twelfth_percent) : undefined,
//         degree_percent: form.degree_percent ? Number(form.degree_percent) : undefined
//       }
//       const created = await http('/api/admin/agents', { method:'POST', body: payload })
//       setForm(init)
//       await load()
//       alert('Agent created. Initial password: ' + (created.initial_password || '(hidden)'))
//     } finally { setSaving(false) }
//   }

//   async function updateComp(e){
//     e.preventDefault()
//     if (!selected) return alert('Select agent')
//     await http(`/api/admin/agents/${selected}/compensation`, { method:'PUT', body:{
//       base_salary: Number(comp.base_salary || 0),
//       incentive_rate: Number(comp.incentive_rate || 0)
//     }})
//     setComp({ base_salary:'', incentive_rate:'' })
//     await load()
//   }

//   async function saveTargetForSelected(){
//     if (!selected) return alert('Select agent')
//     if (!targetForm.target_value) return alert('Enter a target value')
//     await http(`/api/admin/agents/${selected}/targets`, {
//       method:'POST',
//       body:{
//         month: targetForm.month,
//         target_value: Number(targetForm.target_value),
//         description: targetForm.description || undefined
//       }
//     })
//     alert('Target saved')
//   }

//   async function showInitialPassword(agentId){
//     try {
//       const res = await http(`/api/admin/agents/${agentId}/initial-password`)
//       setInitialPwd(res.initial_password + ' (expires: ' + new Date(res.expires_at).toLocaleString() + ')')
//     } catch (e) {
//       setInitialPwd('Not available: ' + e.message)
//     }
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Create Agent */}
//         <form onSubmit={createAgent} className="card space-y-4">
//           <div className="text-lg font-semibold">Add New Agent</div>
//           <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
//             <Field name="name" label="Name" value={form.name} onChange={onChange} />
//             <Field name="email" label="Email" value={form.email} onChange={onChange} />
//             <Field name="phone_no" label="Phone" value={form.phone_no} onChange={onChange} />
//             <Field name="password" label="Password (auto if blank)" value={form.password} onChange={onChange} />
//             <Field name="pan_number" label="PAN" value={form.pan_number} onChange={onChange} />
//             <Field name="aadhaar_number" label="Aadhaar" value={form.aadhaar_number} onChange={onChange} />
//             <Field name="bank_name" label="Bank Name" value={form.bank_name} onChange={onChange} />
//             <Field name="account_no" label="Account No" value={form.account_no} onChange={onChange} />
//             <Field name="ifsc_code" label="IFSC" value={form.ifsc_code} onChange={onChange} />
//             <Field name="tenth_percent" label="10th %" value={form.tenth_percent} onChange={onChange} />
//             <Field name="twelfth_percent" label="12th %" value={form.twelfth_percent} onChange={onChange} />
//             <Field name="degree_percent" label="Degree %" value={form.degree_percent} onChange={onChange} />
//           </div>
//           <button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Create Agent'}</button>
//           {initialPwd && <div className="text-sm text-muted">Initial password: <span className="text-white">{initialPwd}</span></div>}
//         </form>

//         {/* Compensation + Target in same block */}
//         <form onSubmit={updateComp} className="card space-y-4" onKeyDown={(e)=>{ if(e.key==='Enter') e.preventDefault() }}>
//           <div className="text-lg font-semibold">Set Salary & Incentive</div>
//           <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
//             <div>
//               <label className="label">Agent</label>
//               <select className="input select" value={selected || ''} onChange={e=>setSelected(e.target.value)}>
//                 <option value="">Select Agent</option>
//                 {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
//               </select>
//             </div>
//             <div />
//             <Field name="base_salary" label="Base Salary" value={comp.base_salary} onChange={e=>setComp({...comp, base_salary:e.target.value})} />
//             <Field name="incentive_rate" label="Incentive Rate" value={comp.incentive_rate} onChange={e=>setComp({...comp, incentive_rate:e.target.value})} />

//             <div className="sm:col-span-2 border-t border-white/10 pt-2"></div>

//             <div>
//               <label className="label">Target Month</label>
//               <input
//                 className="input"
//                 type="month"
//                 value={(targetForm.month || monthFirstDay()).slice(0,7)}
//                 onChange={e=>setTargetForm(f=>({...f, month: e.target.value + '-01'}))}
//               />
//             </div>
//             <div>
//               <label className="label">Target Value</label>
//               <input
//                 className="input"
//                 placeholder="Target value"
//                 value={targetForm.target_value}
//                 onChange={e=>setTargetForm(f=>({...f, target_value: e.target.value}))}
//               />
//             </div>
//             <div className="sm:col-span-2">
//               <label className="label">Description</label>
//               <input
//                 className="input"
//                 placeholder="Optional"
//                 value={targetForm.description}
//                 onChange={e=>setTargetForm(f=>({...f, description: e.target.value}))}
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <button className="btn" onClick={updateComp}>Update Compensation</button>
//             <button type="button" className="btn-outline" onClick={saveTargetForSelected}>Save Target</button>
//           </div>
//         </form>
//       </div>

//       {/* Agents table — target column removed */}
//       <div className="card">
//         <div className="text-lg font-semibold mb-4">All Agents</div>
//         <ResponsiveTable
//           columns={[
//             { key:'name', label:'Name' },
//             { key:'email', label:'Email' },
//             { key:'phone_no', label:'Phone' },
//             { key:'pan_number', label:'PAN' },
//             { key:'aadhaar_number', label:'Aadhaar' },
//             { key:'bank', label:'Bank', render:(r)=> `${r.bank_name || ''} • ${r.account_no || ''}` },
//             { key:'salary', label:'Salary', render:(r)=> `₹${Number(r.base_salary ?? 0).toLocaleString('en-IN', {minimumFractionDigits:2})}` },
//             { key:'incentive_rate', label:'Incentive' },
//             { key:'actions', label:'Actions', render:(r)=> (
//               <div className="flex gap-2">
//                 <button className="btn-outline" onClick={() => showInitialPassword(r.id)}>Show Initial Password</button>
//               </div>
//             ) }
//           ]}
//           rows={agents}
//           rowKey="id"
//           renderCard={(a)=>(
//             <div className="grid gap-2">
//               <div className="text-base font-semibold">{a.name}</div>
//               <div className="text-sm text-muted">{a.email} • {a.phone_no}</div>
//               <div className="text-sm">PAN: {a.pan_number || '—'} | Aadhaar: {a.aadhaar_number || '—'}</div>
//               <div className="text-sm">Bank: {a.bank_name || '—'} • {a.account_no || '—'}</div>
//               <div className="text-sm">Salary: ₹{Number(a.base_salary ?? 0).toLocaleString('en-IN', {minimumFractionDigits:2})} | Incentive: {a.incentive_rate ?? 0}</div>
//               <div className="text-sm text-muted">Use the form above to set targets.</div>
//               <div className="flex gap-2">
//                 <button className="btn-outline flex-1" onClick={() => showInitialPassword(a.id)}>Initial Password</button>
//               </div>
//             </div>
//           )}
//         />
//       </div>

//       {initialPwd && <div className="text-sm text-muted">Initial password: <span className="text-white">{initialPwd}</span></div>}
//     </div>
//   )
// }

// function Field({ label, ...props }){
//   return (
//     <div>
//       <label className="label">{label}</label>
//       <input className="input" {...props} />
//     </div>
//   )
// }



// import React, { useEffect, useState } from 'react'
// import { http } from '../../lib/api'
// import ResponsiveTable from '../../components/ResponsiveTable'

// const init = {
//   name:'', email:'', phone_no:'', password:'',
//   pan_number:'', aadhaar_number:'',
//   bank_name:'', account_no:'', ifsc_code:'',
//   tenth_percent:'', twelfth_percent:'', degree_percent:''
// }

// function monthFirstDay(d=new Date()){
//   const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01`
// }

// export default function Agents() {
//   const [agents, setAgents] = useState([])
//   const [form, setForm] = useState(init)
//   const [saving, setSaving] = useState(false)

//   const [selected, setSelected] = useState('')
//   const [comp, setComp] = useState({ base_salary:'', incentive_rate:'' })
//   // Target moved into Salary & Incentive block
//   const [targetForm, setTargetForm] = useState({ month: monthFirstDay(), target_value:'', description:'' })

//   const [initialPwd, setInitialPwd] = useState(null)

//   async function load(retry = 1){
//     try {
//       const data = await http('/api/admin/agents')
//       setAgents(data)
//       // if nothing selected, preselect first agent for convenience
//       if (!selected && data.length) setSelected(data[0].id)
//     } catch (e) {
//       if (retry > 0) {
//         // small retry after 300ms in case backend just woke up
//         setTimeout(() => load(retry - 1), 300)
//       } else {
//         setAgents([])
//         console.warn('Failed to load agents:', e.message)
//       }
//     }
//   }
//   useEffect(()=>{ load(2) }, []) // try twice on first mount

//   function onChange(e){ setForm(f => ({...f, [e.target.name]: e.target.value })) }

//   async function createAgent(e){
//     e.preventDefault()
//     setSaving(true)
//     try {
//       const payload = {
//         ...form,
//         tenth_percent: form.tenth_percent ? Number(form.tenth_percent) : undefined,
//         twelfth_percent: form.twelfth_percent ? Number(form.twelfth_percent) : undefined,
//         degree_percent: form.degree_percent ? Number(form.degree_percent) : undefined
//       }
//       const created = await http('/api/admin/agents', { method:'POST', body: payload })
//       setForm(init)
//       await load(1)
//       // make sure the dropdown immediately shows the new agent selected
//       if (created?.id) setSelected(created.id)
//       alert('Agent created. Initial password: ' + (created.initial_password || '(hidden)'))
//     } finally { setSaving(false) }
//   }

//   async function updateComp(e){
//     e.preventDefault()
//     if (!selected) return alert('Select agent')
//     await http(`/api/admin/agents/${selected}/compensation`, { method:'PUT', body:{
//       base_salary: Number(comp.base_salary || 0),
//       incentive_rate: Number(comp.incentive_rate || 0)
//     }})
//     setComp({ base_salary:'', incentive_rate:'' })
//     await load(0)
//   }

//   async function saveTargetForSelected(){
//     if (!selected) return alert('Select agent')
//     if (!targetForm.target_value) return alert('Enter a target value')
//     await http(`/api/admin/agents/${selected}/targets`, {
//       method:'POST',
//       body:{
//         month: targetForm.month,
//         target_value: Number(targetForm.target_value),
//         description: targetForm.description || undefined
//       }
//     })
//     alert('Target saved')
//   }

//   async function showInitialPassword(agentId){
//     try {
//       const res = await http(`/api/admin/agents/${agentId}/initial-password`)
//       setInitialPwd(res.initial_password + ' (expires: ' + new Date(res.expires_at).toLocaleString() + ')')
//     } catch (e) {
//       setInitialPwd('Not available: ' + e.message)
//     }
//   }

//   return (
//     <div className="grid gap-6">
//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Create Agent */}
//         <form onSubmit={createAgent} className="card space-y-4">
//           <div className="text-lg font-semibold">Add New Agent</div>
//           <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
//             <Field name="name" label="Name" value={form.name} onChange={onChange} />
//             <Field name="email" label="Email" value={form.email} onChange={onChange} />
//             <Field name="phone_no" label="Phone" value={form.phone_no} onChange={onChange} />
//             <Field name="password" label="Password (auto if blank)" value={form.password} onChange={onChange} />
//             <Field name="pan_number" label="PAN" value={form.pan_number} onChange={onChange} />
//             <Field name="aadhaar_number" label="Aadhaar" value={form.aadhaar_number} onChange={onChange} />
//             <Field name="bank_name" label="Bank Name" value={form.bank_name} onChange={onChange} />
//             <Field name="account_no" label="Account No" value={form.account_no} onChange={onChange} />
//             <Field name="ifsc_code" label="IFSC" value={form.ifsc_code} onChange={onChange} />
//             <Field name="tenth_percent" label="10th %" value={form.tenth_percent} onChange={onChange} />
//             <Field name="twelfth_percent" label="12th %" value={form.twelfth_percent} onChange={onChange} />
//             <Field name="degree_percent" label="Degree %" value={form.degree_percent} onChange={onChange} />
//           </div>
//           <button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Create Agent'}</button>
//           {initialPwd && <div className="text-sm text-muted">Initial password: <span className="text-white">{initialPwd}</span></div>}
//         </form>

//         {/* Compensation + Target in same block */}
//         <form onSubmit={updateComp} className="card space-y-4" onKeyDown={(e)=>{ if(e.key==='Enter') e.preventDefault() }}>
//           <div className="text-lg font-semibold">Set Salary & Incentive</div>
//           <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
//             <div>
//               <label className="label">Agent</label>
//               <select className="input select" value={selected} onChange={e=>setSelected(e.target.value)}>
//                 <option value="">Select Agent</option>
//                 {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
//               </select>
//             </div>
//             <div />
//             <Field name="base_salary" label="Base Salary" value={comp.base_salary} onChange={e=>setComp({...comp, base_salary:e.target.value})} />
//             <Field name="incentive_rate" label="Incentive Rate" value={comp.incentive_rate} onChange={e=>setComp({...comp, incentive_rate:e.target.value})} />

//             <div className="sm:col-span-2 border-t border-white/10 pt-2"></div>

//             <div>
//               <label className="label">Target Month</label>
//               <input
//                 className="input"
//                 type="month"
//                 value={(targetForm.month || monthFirstDay()).slice(0,7)}
//                 onChange={e=>setTargetForm(f=>({...f, month: e.target.value + '-01'}))}
//               />
//             </div>
//             <div>
//               <label className="label">Target Value</label>
//               <input
//                 className="input"
//                 placeholder="Target value"
//                 value={targetForm.target_value}
//                 onChange={e=>setTargetForm(f=>({...f, target_value: e.target.value}))}
//               />
//             </div>
//             <div className="sm:col-span-2">
//               <label className="label">Description</label>
//               <input
//                 className="input"
//                 placeholder="Optional"
//                 value={targetForm.description}
//                 onChange={e=>setTargetForm(f=>({...f, description: e.target.value}))}
//               />
//             </div>
//           </div>

//           <div className="flex flex-wrap gap-3">
//             <button className="btn" onClick={updateComp}>Update Compensation</button>
//             <button type="button" className="btn-outline" onClick={saveTargetForSelected}>Save Target</button>
//           </div>
//         </form>
//       </div>

//       {/* Agents table — target column removed */}
//       <div className="card">
//         <div className="text-lg font-semibold mb-4">All Agents</div>
//         <ResponsiveTable
//           columns={[
//             { key:'name', label:'Name' },
//             { key:'email', label:'Email' },
//             { key:'phone_no', label:'Phone' },
//             { key:'pan_number', label:'PAN' },
//             { key:'aadhaar_number', label:'Aadhaar' },
//             { key:'bank', label:'Bank', render:(r)=> `${r.bank_name || ''} • ${r.account_no || ''}` },
//             { key:'salary', label:'Salary', render:(r)=> `₹${Number(r.base_salary ?? 0).toLocaleString('en-IN', {minimumFractionDigits:2})}` },
//             { key:'incentive_rate', label:'Incentive' },
//             { key:'actions', label:'Actions', render:(r)=> (
//               <div className="flex gap-2">
//                 <button className="btn-outline" onClick={() => showInitialPassword(r.id)}>Show Initial Password</button>
//               </div>
//             ) }
//           ]}
//           rows={agents}
//           rowKey="id"
//           renderCard={(a)=>(
//             <div className="grid gap-2">
//               <div className="text-base font-semibold">{a.name}</div>
//               <div className="text-sm text-muted">{a.email} • {a.phone_no}</div>
//               <div className="text-sm">PAN: {a.pan_number || '—'} | Aadhaar: {a.aadhaar_number || '—'}</div>
//               <div className="text-sm">Bank: {a.bank_name || '—'} • {a.account_no || '—'}</div>
//               <div className="text-sm">Salary: ₹{Number(a.base_salary ?? 0).toLocaleString('en-IN', {minimumFractionDigits:2})} | Incentive: {a.incentive_rate ?? 0}</div>
//               <div className="text-sm text-muted">Use the form above to set targets.</div>
//               <div className="flex gap-2">
//                 <button className="btn-outline flex-1" onClick={() => showInitialPassword(a.id)}>Initial Password</button>
//               </div>
//             </div>
//           )}
//         />
//       </div>

//       {initialPwd && <div className="text-sm text-muted">Initial password: <span className="text-white">{initialPwd}</span></div>}
//     </div>
//   )
// }

// function Field({ label, ...props }){
//   return (
//     <div>
//       <label className="label">{label}</label>
//       <input className="input" {...props} />
//     </div>
//   )
// }


import React, { useEffect, useState } from 'react'
import { http } from '../../lib/api'
import ResponsiveTable from '../../components/ResponsiveTable'

const init = {
  name:'', email:'', phone_no:'', password:'',
  pan_number:'', aadhaar_number:'',
  bank_name:'', account_no:'', ifsc_code:'',
  tenth_percent:'', twelfth_percent:'', degree_percent:''
}

function monthFirstDay(d=new Date()){
  const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01`
}

/** Tiny toast helper */
function Toast({ open, type='success', message, onClose }) {
  if (!open) return null
  const colors = type === 'success'
    ? 'bg-emerald-600/90 border-emerald-300/60'
    : 'bg-red-600/90 border-red-300/60'
  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-xl ${colors} text-white px-4 py-3 border shadow-soft`}>
      <div className="flex items-center gap-3">
        <span className="font-medium">{type === 'success' ? 'Success' : 'Error'}</span>
        <span className="opacity-90">{message}</span>
        <button className="ml-3 text-white/80 hover:text-white underline" onClick={onClose}>Dismiss</button>
      </div>
    </div>
  )
}

export default function Agents() {
  const [agents, setAgents] = useState([])
  const [form, setForm] = useState(init)
  const [saving, setSaving] = useState(false)

  const [selected, setSelected] = useState('')
  const [comp, setComp] = useState({ base_salary:'', incentive_rate:'' })
  // Target moved into Salary & Incentive block
  const [targetForm, setTargetForm] = useState({ month: monthFirstDay(), target_value:'', description:'' })

  const [initialPwd, setInitialPwd] = useState(null)

  // toast
  const [toast, setToast] = useState({ open:false, type:'success', message:'' })
  const showToast = (message, type='success') => {
    setToast({ open:true, type, message })
    window.clearTimeout(showToast.tid)
    showToast.tid = window.setTimeout(()=> setToast(t=>({...t, open:false})), 2500)
  }

  async function load(retry = 1){
    try {
      const data = await http('/api/admin/agents')
      setAgents(data)
      if (!selected && data.length) setSelected(data[0].id)
    } catch (e) {
      if (retry > 0) {
        setTimeout(() => load(retry - 1), 300)
      } else {
        setAgents([])
        console.warn('Failed to load agents:', e.message)
      }
    }
  }
  useEffect(()=>{ load(2) }, [])

  function onChange(e){ setForm(f => ({...f, [e.target.name]: e.target.value })) }

  async function createAgent(e){
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        tenth_percent: form.tenth_percent ? Number(form.tenth_percent) : undefined,
        twelfth_percent: form.twelfth_percent ? Number(form.twelfth_percent) : undefined,
        degree_percent: form.degree_percent ? Number(form.degree_percent) : undefined
      }
      const created = await http('/api/admin/agents', { method:'POST', body: payload })
      setForm(init)
      await load(1)
      if (created?.id) setSelected(created.id)
      showToast('Agent created successfully')
      // keep initial password hint as before (optional)
      if (created?.initial_password) {
        setInitialPwd(`Initial password: ${created.initial_password}`)
      }
    } catch (e) {
      showToast(e.message || 'Failed to create agent', 'error')
    } finally { setSaving(false) }
  }

  async function updateComp(e){
    e.preventDefault()
    if (!selected) return showToast('Select an agent first','error')
    try {
      await http(`/api/admin/agents/${selected}/compensation`, { method:'PUT', body:{
        base_salary: Number(comp.base_salary || 0),
        incentive_rate: Number(comp.incentive_rate || 0)
      }})
      setComp({ base_salary:'', incentive_rate:'' })
      await load(0)
      showToast('Compensation updated successfully')
    } catch (e) {
      showToast(e.message || 'Failed to update compensation', 'error')
    }
  }

  async function saveTargetForSelected(){
    if (!selected) return showToast('Select an agent first','error')
    if (!targetForm.target_value) return showToast('Enter a target value','error')
    try {
      await http(`/api/admin/agents/${selected}/targets`, {
        method:'POST',
        body:{
          month: targetForm.month,
          target_value: Number(targetForm.target_value),
          description: targetForm.description || undefined
        }
      })
      showToast('Monthly target saved successfully')
    } catch (e) {
      showToast(e.message || 'Failed to save target', 'error')
    }
  }

  async function showInitialPassword(agentId){
    try {
      const res = await http(`/api/admin/agents/${agentId}/initial-password`)
      setInitialPwd(res.initial_password + ' (expires: ' + new Date(res.expires_at).toLocaleString() + ')')
      showToast('Initial password fetched')
    } catch (e) {
      setInitialPwd('Not available: ' + e.message)
      showToast(e.message || 'Failed to fetch initial password', 'error')
    }
  }

  return (
    <div className="grid gap-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create Agent */}
        <form onSubmit={createAgent} className="card space-y-4">
          <div className="text-lg font-semibold">Add New Agent</div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <Field name="name" label="Name" value={form.name} onChange={onChange} />
            <Field name="email" label="Email" value={form.email} onChange={onChange} />
            <Field name="phone_no" label="Phone" value={form.phone_no} onChange={onChange} />
            <Field name="password" label="Password (auto if blank)" value={form.password} onChange={onChange} />
            <Field name="pan_number" label="PAN" value={form.pan_number} onChange={onChange} />
            <Field name="aadhaar_number" label="Aadhaar" value={form.aadhaar_number} onChange={onChange} />
            <Field name="bank_name" label="Bank Name" value={form.bank_name} onChange={onChange} />
            <Field name="account_no" label="Account No" value={form.account_no} onChange={onChange} />
            <Field name="ifsc_code" label="IFSC" value={form.ifsc_code} onChange={onChange} />
            <Field name="tenth_percent" label="10th %" value={form.tenth_percent} onChange={onChange} />
            <Field name="twelfth_percent" label="12th %" value={form.twelfth_percent} onChange={onChange} />
            <Field name="degree_percent" label="Degree %" value={form.degree_percent} onChange={onChange} />
          </div>
          <button className="btn" disabled={saving}>{saving ? 'Saving…' : 'Create Agent'}</button>
          {initialPwd && <div className="text-sm text-muted">{initialPwd}</div>}
        </form>

        {/* Compensation + Target in same block */}
        <form onSubmit={updateComp} className="card space-y-4" onKeyDown={(e)=>{ if(e.key==='Enter') e.preventDefault() }}>
          <div className="text-lg font-semibold">Set Salary & Incentive</div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <div>
              <label className="label">Agent</label>
              <select className="input select" value={selected} onChange={e=>setSelected(e.target.value)}>
                <option value="">Select Agent</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
              </select>
            </div>
            <div />
            <Field name="base_salary" label="Base Salary" value={comp.base_salary} onChange={e=>setComp({...comp, base_salary:e.target.value})} />
            <Field name="incentive_rate" label="Incentive Rate" value={comp.incentive_rate} onChange={e=>setComp({...comp, incentive_rate:e.target.value})} />

            <div className="sm:col-span-2 border-t border-white/10 pt-2"></div>

            <div>
              <label className="label">Target Month</label>
              <input
                className="input"
                type="month"
                value={(targetForm.month || monthFirstDay()).slice(0,7)}
                onChange={e=>setTargetForm(f=>({...f, month: e.target.value + '-01'}))}
              />
            </div>
            <div>
              <label className="label">Target Value</label>
              <input
                className="input"
                placeholder="Target value"
                value={targetForm.target_value}
                onChange={e=>setTargetForm(f=>({...f, target_value: e.target.value}))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Description</label>
              <input
                className="input"
                placeholder="Optional"
                value={targetForm.description}
                onChange={e=>setTargetForm(f=>({...f, description: e.target.value}))}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="btn" onClick={updateComp}>Update Compensation</button>
            <button type="button" className="btn-outline" onClick={saveTargetForSelected}>Save Target</button>
          </div>
        </form>
      </div>

      {/* Agents table — target column removed */}
      <div className="card">
        <div className="text-lg font-semibold mb-4">All Agents</div>
        <ResponsiveTable
          columns={[
            { key:'name', label:'Name' },
            { key:'email', label:'Email' },
            { key:'phone_no', label:'Phone' },
            { key:'pan_number', label:'PAN' },
            { key:'aadhaar_number', label:'Aadhaar' },
            { key:'bank', label:'Bank', render:(r)=> `${r.bank_name || ''} • ${r.account_no || ''}` },
            { key:'salary', label:'Salary', render:(r)=> `₹${Number(r.base_salary ?? 0).toLocaleString('en-IN', {minimumFractionDigits:2})}` },
            { key:'incentive_rate', label:'Incentive' },
            { key:'actions', label:'Actions', render:(r)=> (
              <div className="flex gap-2">
                <button className="btn-outline" onClick={() => showInitialPassword(r.id)}>Show Initial Password</button>
              </div>
            ) }
          ]}
          rows={agents}
          rowKey="id"
          renderCard={(a)=>(
            <div className="grid gap-2">
              <div className="text-base font-semibold">{a.name}</div>
              <div className="text-sm text-muted">{a.email} • {a.phone_no}</div>
              <div className="text-sm">PAN: {a.pan_number || '—'} | Aadhaar: {a.aadhaar_number || '—'}</div>
              <div className="text-sm">Bank: {a.bank_name || '—'} • {a.account_no || '—'}</div>
              <div className="text-sm">Salary: ₹{Number(a.base_salary ?? 0).toLocaleString('en-IN', {minimumFractionDigits:2})} | Incentive: {a.incentive_rate ?? 0}</div>
              <div className="text-sm text-muted">Use the form above to set targets.</div>
              <div className="flex gap-2">
                <button className="btn-outline flex-1" onClick={() => showInitialPassword(a.id)}>Initial Password</button>
              </div>
            </div>
          )}
        />
      </div>

      {initialPwd && <div className="text-sm text-muted">{initialPwd}</div>}

      {/* Toast */}
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={()=>setToast(t=>({...t, open:false}))}
      />
    </div>
  )
}

function Field({ label, ...props }){
  return (
    <div>
      <label className="label">{label}</label>
      <input className="input" {...props} />
    </div>
  )
}
