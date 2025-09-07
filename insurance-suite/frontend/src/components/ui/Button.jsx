import React from 'react'
export default function Button({children,onClick,type='button',variant='solid',className='',icon:Icon}){
  const base = variant==='ghost' ? 'btn-ghost' : (variant==='outline' ? 'btn-outline' : 'btn')
  return <button type={type} onClick={onClick} className={base + ' ' + className}>{Icon && <Icon size={16}/>} {children}</button>
}
