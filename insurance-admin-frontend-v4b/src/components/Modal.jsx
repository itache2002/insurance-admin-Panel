import React from 'react'

export default function Modal({ open, onClose, children, title }){
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative card max-w-2xl w-full">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">{title}</div>
          <button className="btn-outline" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}
