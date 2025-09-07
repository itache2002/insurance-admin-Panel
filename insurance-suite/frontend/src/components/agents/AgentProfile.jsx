import React, { useEffect, useState } from 'react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { api } from '../../lib/api'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts'

function mask(val, last = 4) {
  if (!val) return ''
  const s = String(val)
  return s.length <= last ? s : '••••' + s.slice(-last)
}

export default function AgentProfile({ open, onClose, agentId, role = 'admin' }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!open || !agentId) return
    setLoading(true)
    const fn = role === 'employee' ? api.employee.agentSummary : api.admin.agentSummary
    fn(agentId)
      .then(setData)
      .finally(() => setLoading(false))
  }, [open, agentId, role])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[95vw] max-w-5xl max-h-[90vh] overflow-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Agent Profile</h2>
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>

        {loading && <div className="text-sm opacity-70">Loading…</div>}
        {!loading && !data && <div className="text-sm opacity-70">No data.</div>}

        {data && (
          <div className="space-y-6">
            {/* Top summary */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="kpi">
                <div className="text-sm opacity-80">Name</div>
                <div className="text-xl font-bold">{data.agent?.name}</div>
                <div className="tag mt-2">ID: {data.agent?.id}</div>
              </div>
              <div className="kpi">
                <div className="text-sm opacity-80">Email</div>
                <div className="text-xl font-bold truncate">{data.agent?.email}</div>
                <div className="tag mt-2">Phone: {data.agent?.phone_no || '—'}</div>
              </div>
              <div className="kpi">
                <div className="text-sm opacity-80">Customers</div>
                <div className="text-2xl font-bold">{data.customer_count}</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="kpi">
                <div className="text-sm opacity-80">Base Salary</div>
                <div className="text-2xl font-bold">{Number(data.comp?.base_salary || 0).toLocaleString()}</div>
              </div>
              <div className="kpi">
                <div className="text-sm opacity-80">Commission Rate</div>
                <div className="text-2xl font-bold">
                  {data.comp?.commission_rate != null ? `${Number(data.comp.commission_rate)}%` : '—'}
                </div>
              </div>
              <div className="kpi">
                <div className="text-sm opacity-80">Sales (total)</div>
                <div className="text-2xl font-bold">{Number(data.totals?.sales_count || 0).toLocaleString()}</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card title="Totals">
                <div className="grid grid-cols-2 gap-3">
                  <div className="kpi">
                    <div className="text-sm opacity-80">Total Premium</div>
                    <div className="text-xl font-bold">{Number(data.totals?.total_premium || 0).toLocaleString()}</div>
                  </div>
                  <div className="kpi">
                    <div className="text-sm opacity-80">Total Commission</div>
                    <div className="text-xl font-bold">{Number(data.totals?.total_commission || 0).toLocaleString()}</div>
                  </div>
                  <div className="kpi">
                    <div className="text-sm opacity-80">PAN</div>
                    <div className="text-xl font-bold">{mask(data.agent?.pan_no, 3) || '—'}</div>
                  </div>
                  <div className="kpi">
                    <div className="text-sm opacity-80">Aadhaar</div>
                    <div className="text-xl font-bold">{mask(data.agent?.aadhaar_no, 4) || '—'}</div>
                  </div>
                </div>
              </Card>

              <Card title="Monthly Sales">
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.monthly}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                      <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                      <YAxis tick={{ fill: '#9ca3af' }} />
                      <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb' }} />
                      <Bar dataKey="sales_count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card title="Premium vs Commission (last 12)">
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.monthly}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip contentStyle={{ background:'#0f172a', border:'1px solid #1f2937', color:'#e5e7eb' }} />
                    <Line type="monotone" dataKey="total_premium" />
                    <Line type="monotone" dataKey="total_commission" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
