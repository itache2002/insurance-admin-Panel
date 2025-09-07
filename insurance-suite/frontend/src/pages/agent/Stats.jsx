import React, { useState } from 'react'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import DataTable from '../../components/data/DataTable'
import { api } from '../../lib/api'
export default function AgentStats(){
  const [rows,setRows]=useState([])
  return <Card title="My Monthly Stats" actions={<Button variant="outline" onClick={async()=>setRows(await api.agent.stats())}>Refresh</Button>}>
    <DataTable columns={[{key:'month',label:'Month'},{key:'sales_count',label:'Sales'},{key:'total_premium',label:'Premium'},{key:'total_commission',label:'Commission'}]} rows={rows}/>
  </Card>
}
