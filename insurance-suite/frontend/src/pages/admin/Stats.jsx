import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Field } from '../../components/ui/Field'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'

export default function AdminStats(){
  const [agent,setAgent]=useState(''); const [month,setMonth]=useState('2025-08-01'); const [sales,setSales]=useState('5'); const [prem,setPrem]=useState('50000'); const [comm,setComm]=useState('2500')
  return <div className="grid gap-6 md:grid-cols-2">
    <Card title="Upsert Agent Monthly Stats">
      <div className="flex flex-wrap gap-3">
        <Field label="Agent ID"><Input value={agent} onChange={e=>setAgent(e.target.value)}/></Field>
        <Field label="Month (YYYY-MM-DD)"><Input value={month} onChange={e=>setMonth(e.target.value)}/></Field>
        <Field label="Sales Count"><Input value={sales} onChange={e=>setSales(e.target.value)}/></Field>
        <Field label="Total Premium"><Input value={prem} onChange={e=>setPrem(e.target.value)}/></Field>
        <Field label="Total Commission"><Input value={comm} onChange={e=>setComm(e.target.value)}/></Field>
        <Button onClick={()=>api.admin.upsertMonthlyStats(agent, month, Number(sales), Number(prem), Number(comm))}>Save</Button>
      </div>
    </Card>
  </div>
}
