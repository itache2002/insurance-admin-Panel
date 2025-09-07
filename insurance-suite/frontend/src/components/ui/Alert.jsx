import React from 'react'

export default function Alert({ variant='error', children, className='' }) {
  const cls =
    variant === 'success' ? 'border-green-500/40 bg-green-500/10 text-green-200' :
    variant === 'warning' ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-200' :
    variant === 'info'    ? 'border-sky-500/40 bg-sky-500/10 text-sky-200' :
                            'border-red-500/40 bg-red-500/10 text-red-200' // error
  return (
    <div className={`mb-3 rounded-lg border ${cls} text-sm px-3 py-2 ${className}`}>
      {children}
    </div>
  )
}
