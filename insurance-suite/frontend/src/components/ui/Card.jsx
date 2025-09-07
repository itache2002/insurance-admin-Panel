import React from 'react'
export default function Card({title,subtitle,actions,children,className=''}){
  return <div className={'card p-5 shadow-soft ' + className}>
    {(title || actions) && <div className="flex items-center justify-between gap-4 mb-4">
      <div>{title && <h2 className="text-lg font-semibold">{title}</h2>}{subtitle && <div className="text-sm opacity-75">{subtitle}</div>}</div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>}
    {children}
  </div>
}
