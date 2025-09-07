// // import React, { useEffect, useState } from 'react'
// // import Card from '../../components/ui/Card'
// // import Button from '../../components/ui/Button'
// // import { Field } from '../../components/ui/Field'
// // import { Input } from '../../components/ui/Input'
// // import DataTable from '../../components/data/DataTable'
// // import { api } from '../../lib/api'

// // export default function AdminEmployees(){
// //   const [rows,setRows]=useState([]); const [id,setId]=useState(''); const [salary,setSalary]=useState('')
// //   async function load(){ setRows(await api.admin.employees()) }
// //   useEffect(()=>{ load() }, [])
// //   return <div className="grid gap-6 md:grid-cols-2">
// //     <Card title="Employees" actions={<Button variant="outline" onClick={load}>Refresh</Button>}>
// //       <DataTable columns={[{key:'id',label:'ID'},{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'base_salary',label:'Salary'}]} rows={rows}/>
// //     </Card>
// //     <Card title="Set Employee Salary">
// //       <div className="flex flex-wrap gap-3">
// //         <Field label="Employee ID"><Input value={id} onChange={e=>setId(e.target.value)}/></Field>
// //         <Field label="Base Salary"><Input value={salary} onChange={e=>setSalary(e.target.value)}/></Field>
// //         <Button onClick={()=>api.admin.setEmpSalary(id, Number(salary))}>Save</Button>
// //       </div>
// //     </Card>
// //   </div>
// // }



// import React, { useEffect, useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import DataTable from '../../components/data/DataTable'
// import { api } from '../../lib/api'

// export default function AdminEmployees(){
//   const [rows, setRows] = useState([])
//   const [loading, setLoading] = useState(false)

//   async function load(){
//     setLoading(true)
//     try { setRows(await api.admin.employees()) }
//     finally { setLoading(false) }
//   }
//   useEffect(()=>{ load() }, [])

//   return (
//     <Card
//       title="Employees"
//       subtitle="All employees (with base salary)"
//       actions={<Button variant="outline" onClick={load} disabled={loading}>{loading?'Loading…':'Refresh'}</Button>}
//     >
//       <DataTable
//         loading={loading}
//         columns={[
//           { key:'name', label:'Name' },
//           { key:'email', label:'Email' },
//           { key:'base_salary', label:'Base Salary' },
//           {
//             key:'actions',
//             label:'Actions',
//             render:(_,row)=>(
//               <button
//                 className="btn danger"
//                 onClick={async ()=>{
//                   if(!confirm(`Delete employee ${row.name}? This cannot be undone.`)) return
//                   await api.admin.deleteEmployee(row.id)
//                   await load()
//                 }}
//               >
//                 Delete
//               </button>
//             )
//           }
//         ]}
//         rows={rows}
//       />
//     </Card>
//   )
// }


import React, { useEffect, useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import DataTable from '../../components/data/DataTable'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'

export default function AdminEmployees(){
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)

  // inline salary editing state
  const [editingId, setEditingId] = useState(null)
  const [salaryEdit, setSalaryEdit] = useState('')

  async function load(){
    setLoading(true)
    try{
      const list = await api.admin.employees()
      setRows(Array.isArray(list) ? list : [])
    } finally { setLoading(false) }
  }
  useEffect(()=>{ load() }, [])

  function startEdit(row){
    setEditingId(row.id)
    setSalaryEdit(row.base_salary ?? '')
  }
  function cancelEdit(){
    setEditingId(null)
    setSalaryEdit('')
  }
  async function saveSalary(row){
    const id = row.id
    const v = salaryEdit === '' ? null : Number(salaryEdit)
    if (v !== null && (Number.isNaN(v) || v < 0)) { alert('Enter a valid non-negative number'); return }
    await api.admin.setEmpSalary(id, v)
    cancelEdit()
    await load()
  }

  async function onDeleteEmployee(e, row){
    e.stopPropagation()
    if(!confirm(`Delete employee "${row.name || row.email}"? This cannot be undone.`)) return
    await api.admin.deleteEmployee(row.id)
    await load()
  }

  return (
    <Card
      title="Employees"
      subtitle="Edit base salary or delete employees"
      actions={
        <Button variant="outline" onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Refresh'}
        </Button>
      }
    >
      <DataTable
        loading={loading}
        rows={rows}
        columns={[
          { key:'id', label:'ID', hideBelow:'md' },
          { key:'name', label:'Name' },
          { key:'email', label:'Email', hideBelow:'md' },
          {
            key:'base_salary',
            label:'Base Salary',
            render: (v, r) => (
              editingId === r.id
                ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={salaryEdit}
                        onChange={(e)=>setSalaryEdit(e.target.value)}
                        placeholder="0"
                        className="max-w-[8rem]"
                      />
                      <span className="text-xs opacity-60">₹ / month</span>
                    </div>
                  )
                : (v ?? '—')
            )
          },
          {
            key:'_actions',
            label:'Actions',
            render: (_v, r) => (
              <div className="flex items-center gap-2">
                {editingId === r.id ? (
                  <>
                    <Button className="!px-3 !py-1" onClick={()=>saveSalary(r)}>Save</Button>
                    <Button variant="outline" className="!px-3 !py-1" onClick={cancelEdit}>Cancel</Button>
                  </>
                ) : (
                  <Button className="!px-3 !py-1" onClick={()=>startEdit(r)}>Edit Salary</Button>
                )}
                <Button
                  className="!px-3 !py-1 bg-rose-600 hover:bg-rose-500 text-white"
                  onClick={(e)=>onDeleteEmployee(e, r)}
                >
                  Delete
                </Button>
              </div>
            )
          }
        ]}
      />
    </Card>
    
  )
}
