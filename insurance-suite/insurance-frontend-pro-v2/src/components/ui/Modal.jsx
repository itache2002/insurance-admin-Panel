import React from 'react'

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-x-0 top-10 mx-auto max-w-2xl w-[92%] rounded-2xl border border-border bg-slate-900 shadow-xl">
        <div className="px-4 sm:px-6 py-3 border-b border-border flex items-center justify-between">
          <div className="font-semibold">{title}</div>
          <button className="btn-ghost" onClick={onClose}>Close</button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
        {footer && <div className="px-4 sm:px-6 py-3 border-t border-border">{footer}</div>}
      </div>
    </div>
  )
}
