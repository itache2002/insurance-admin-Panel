import React from 'react'
export default function StatusPill({ value }) {
  const v = String(value || '').toLowerCase()
  let cls = 'bg-gray-500/20 text-gray-200 border-gray-600/40'
  if (v === 'closed')  cls = 'bg-green-500/20 text-green-300 border-green-600/40'
  if (v === 'pending') cls = 'bg-yellow-500/20 text-yellow-200 border-yellow-600/40'
  if (v === 'denied')  cls = 'bg-red-500/20 text-red-300 border-red-600/40'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${cls}`}>
      {value || '-'}
    </span>
  )
}
