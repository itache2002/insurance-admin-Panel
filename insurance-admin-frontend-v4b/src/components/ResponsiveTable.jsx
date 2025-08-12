import React from 'react'

export default function ResponsiveTable({ columns = [], rows = [], rowKey = 'id', renderCard }) {
  return (
    <>
      {/* Desktop / tablet */}
      <div className="hidden md:block">
        <table className="table">
          <thead>
            <tr>
              {columns.map(c => <th key={c.key} className="th">{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r[rowKey]}>
                {columns.map(c => <td key={c.key} className="td">{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden grid gap-3">
        {rows.map(r => (
          <div key={r[rowKey]} className="card">
            {renderCard ? renderCard(r) : (
              <div className="text-sm text-muted">No card renderer provided.</div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
