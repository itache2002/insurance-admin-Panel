import React, { createContext, useContext, useState, useCallback } from 'react'
const ToastCtx = createContext(null); let id = 1
export function ToastProvider({children}){
  const [items,setItems]=useState([])
  const push = useCallback((type, message)=>{ const t = { id: id++, type, message }; setItems(s=>[...s, t]); setTimeout(()=> setItems(s=>s.filter(i=>i.id!==t.id)), 2600) },[])
  return <ToastCtx.Provider value={{ success:m=>push('success',m), error:m=>push('error',m), info:m=>push('info',m) }}>
    {children}
    <div className="fixed right-3 top-3 z-50 space-y-2">
      {items.map(t=> <div key={t.id} className={'glass rounded-xl px-4 py-2 shadow-soft ' + (t.type==='error'?'border-red-400/40 text-red-200': t.type==='success'?'border-green-400/40 text-green-200':'border-accent/40 text-slate-100') }>{t.message}</div>)}
    </div>
  </ToastCtx.Provider>
}
export function useToast(){ return useContext(ToastCtx) }
export const toast = { success:()=>{}, error:()=>{}, info:()=>{} }
