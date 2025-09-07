// import React, { useState } from 'react'
// import Card from '../../components/ui/Card'
// import Button from '../../components/ui/Button'
// import { Field } from '../../components/ui/Field'
// import { Input } from '../../components/ui/Input'
// import { api } from '../../lib/api'

// export default function AdminTargets(){
//   const [agent,setAgent]=useState(''); const [month,setMonth]=useState('2025-08-01'); const [target,setTarget]=useState('100000'); const [delta,setDelta]=useState('5000'); const [note,setNote]=useState('')
//   return <div className="grid gap-6 md:grid-cols-2">
//     <Card title="Set Agent Monthly Target">
//       <div className="flex flex-wrap gap-3">
//         <Field label="Agent ID"><Input value={agent} onChange={e=>setAgent(e.target.value)}/></Field>
//         <Field label="Month (YYYY-MM-DD)"><Input value={month} onChange={e=>setMonth(e.target.value)}/></Field>
//         <Field label="Target Value"><Input value={target} onChange={e=>setTarget(e.target.value)}/></Field>
//         <Button onClick={()=>api.admin.setAgentTarget(agent, month, Number(target))}>Save Target</Button>
//       </div>
//     </Card>
//     <Card title="Add Progress">
//       <div className="flex flex-wrap gap-3">
//         <Field label="Agent ID"><Input value={agent} onChange={e=>setAgent(e.target.value)}/></Field>
//         <Field label="Month (YYYY-MM-DD)"><Input value={month} onChange={e=>setMonth(e.target.value)}/></Field>
//         <Field label="Delta"><Input value={delta} onChange={e=>setDelta(e.target.value)}/></Field>
//         <Field label="Note"><Input value={note} onChange={e=>setNote(e.target.value)}/></Field>
//         <Button onClick={()=>api.admin.addTargetProgress(agent, month, Number(delta), note)}>Add Progress</Button>
//       </div>
//     </Card>
//   </div>
// }



import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { toast } from '../../components/ui/Toast'

// Convert <input type="month" value="YYYY-MM"> to "YYYY-MM-01"
const toMonthStart = (v) => {
  if (!v) return ''
  return /^\d{4}-\d{2}$/.test(v) ? `${v}-01` : v
}

export default function AdminTargets(){
  // ------- Agents -------
  const [agent,setAgent] = useState('')
  const [aMonth,setAMonth] = useState(new Date().toISOString().slice(0,7)) // YYYY-MM
  const [aTarget,setATarget] = useState('100000')
  const [aDelta,setADelta] = useState('5000')
  const [aNote,setANote] = useState('')

  // ------- Employees -------
  const [emp,setEmp] = useState('')
  const [eMonth,setEMonth] = useState(new Date().toISOString().slice(0,7)) // YYYY-MM
  const [eTargetSales,setETargetSales] = useState('10')
  const [eTargetPremium,setETargetPremium] = useState('200000')
  const [eDeltaSales,setEDeltaSales] = useState('1')
  const [eDeltaPremium,setEDeltaPremium] = useState('10000')
  const [eNote,setENote] = useState('')

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ==================== AGENTS ==================== */}
      <Card title="Set Agent Monthly Target" subtitle="Target is typically Total Premium for the month">
        <div className="flex flex-wrap gap-3">
          <Field label="Agent ID">
            <Input value={agent} onChange={e=>setAgent(e.target.value)} />
          </Field>
          <Field label="Month">
            <Input type="month" value={aMonth} onChange={e=>setAMonth(e.target.value)} />
          </Field>
          <Field label="Target Value (Premium)">
            <Input value={aTarget} onChange={e=>setATarget(e.target.value.replace(/[^\d.]/g,''))}/>
          </Field>
          <Button
            onClick={async ()=>{
              if(!agent) return toast.error('Agent ID is required')
              await api.admin.setAgentTarget(agent, toMonthStart(aMonth), Number(aTarget || 0))
              toast.success('Agent target saved')
            }}
          >
            Save Target
          </Button>
        </div>
      </Card>

      <Card title="Add Agent Progress" subtitle="Increment this month’s progress">
        <div className="flex flex-wrap gap-3">
          <Field label="Agent ID">
            <Input value={agent} onChange={e=>setAgent(e.target.value)} />
          </Field>
          <Field label="Month">
            <Input type="month" value={aMonth} onChange={e=>setAMonth(e.target.value)} />
          </Field>
          <Field label="Delta (Premium)">
            <Input value={aDelta} onChange={e=>setADelta(e.target.value.replace(/[^\d.]/g,''))}/>
          </Field>
          <Field label="Note">
            <Input value={aNote} onChange={e=>setANote(e.target.value)} />
          </Field>
          <Button
            onClick={async ()=>{
              if(!agent) return toast.error('Agent ID is required')
              await api.admin.addTargetProgress(agent, toMonthStart(aMonth), Number(aDelta || 0), aNote)
              toast.success('Agent progress added')
            }}
          >
            Add Progress
          </Button>
        </div>
      </Card>

      {/* ==================== EMPLOYEES ==================== */}
      <Card title="Set Employee Monthly Target" subtitle="Targets contain both Sales and Total Premium">
        <div className="flex flex-wrap gap-3">
          <Field label="Employee ID">
            <Input value={emp} onChange={e=>setEmp(e.target.value)} />
          </Field>
          <Field label="Month">
            <Input type="month" value={eMonth} onChange={e=>setEMonth(e.target.value)} />
          </Field>
          <Field label="Target Sales">
            <Input value={eTargetSales} onChange={e=>setETargetSales(e.target.value.replace(/[^\d]/g,''))} />
          </Field>
          <Field label="Target Premium">
            <Input value={eTargetPremium} onChange={e=>setETargetPremium(e.target.value.replace(/[^\d.]/g,''))} />
          </Field>
          <Button
            onClick={async ()=>{
              if(!emp) return toast.error('Employee ID is required')
              await api.admin.setEmployeeTarget(emp, toMonthStart(eMonth), Number(eTargetSales || 0), Number(eTargetPremium || 0))
              toast.success('Employee target saved')
            }}
          >
            Save Target
          </Button>
        </div>
      </Card>
      {/* <Card title="Add Employee Progress" subtitle="Increment both Sales and Total Premium for the month">
        <div className="flex flex-wrap gap-3">
          <Field label="Employee ID">
            <Input value={emp} onChange={e=>setEmp(e.target.value)} />
          </Field>
          <Field label="Month">
            <Input type="month" value={eMonth} onChange={e=>setEMonth(e.target.value)} />
          </Field>
          <Field label="Delta Sales">
            <Input value={eDeltaSales} onChange={e=>setEDeltaSales(e.target.value.replace(/[^\d]/g,''))} />
          </Field>
          <Field label="Delta Premium">
            <Input value={eDeltaPremium} onChange={e=>setEDeltaPremium(e.target.value.replace(/[^\d.]/g,''))} />
          </Field>
          <Field label="Note">
            <Input value={eNote} onChange={e=>setENote(e.target.value)} />
          </Field>
          <Button
          onClick={async ()=>{
            if(!emp) return toast.error('Employee ID is required')
            try {
              await api.admin.addEmployeeTargetProgress(
                emp,
                toMonthStart(eMonth),
                Number(eDeltaSales || 0),
                Number(eDeltaPremium || 0),
                eNote
              )
              toast.success('Employee progress added')
            } catch (e) {
              // request() already shows an error toast; this is optional:
              // toast.error(e?.message || 'Failed to add employee progress')
            }
          }}
        >
          Add Progress
        </Button>
        </div>
      </Card> */}
    </div>
  )
}
