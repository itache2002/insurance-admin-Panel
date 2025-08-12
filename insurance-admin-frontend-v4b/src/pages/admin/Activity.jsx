import React, { useEffect, useState } from 'react'
import { http } from '../../lib/api'

export default function Activity() {
  const [rows, setRows] = useState([])

  useEffect(()=>{ (async()=> setRows(await http('/api/admin/activity')))() }, [])

  return (
    <div className="card">
      <div className="text-lg font-semibold mb-4">Activity Logs</div>
      <table className="table">
        <thead>
          <tr>
            <th className="th">Time</th>
            <th className="th">Actor</th>
            <th className="th">Action</th>
            <th className="th">Resource</th>
            <th className="th">Meta</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td className="td">{new Date(r.created_at).toLocaleString()}</td>
              <td className="td">{r.actor_name || '—'} ({r.actor_role || 'n/a'})</td>
              <td className="td">{r.action}</td>
              <td className="td">{r.resource}</td>
              <td className="td text-xs text-muted">{JSON.stringify(r.meta)}</td>
            </tr>
          ))}
          </tbody>
      </table>
    </div>
  )
}
