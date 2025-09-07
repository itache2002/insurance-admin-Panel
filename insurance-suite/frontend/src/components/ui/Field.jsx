import React from 'react'
export function Field({label,children,help}){
  return <label className="flex-1 min-w-[220px]">
    <div className="mb-1 text-sm opacity-80">{label}</div>
    {children}
    {help && <div className="text-xs opacity-60 mt-1">{help}</div>}
  </label>
}
