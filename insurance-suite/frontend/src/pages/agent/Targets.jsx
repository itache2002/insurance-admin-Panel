import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import DataTable from '../../components/data/DataTable'
import { api } from '../../lib/api'
export default function AgentTargets(){
  const [rows,setRows]=useState([])
  return <Card title="My Targets" actions={<Button variant="outline" onClick={async()=>setRows(await api.agent.targets())}>Refresh</Button>}>
    <DataTable columns={[{key:'month',label:'Month'},{key:'target_value',label:'Target'},{key:'achieved_value',label:'Achieved'}]} rows={rows}/>
  </Card>
}
