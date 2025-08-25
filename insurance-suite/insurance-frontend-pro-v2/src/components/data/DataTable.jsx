// // import React, { useMemo, useState } from 'react'
// // import { ChevronDown, ChevronUp, Search } from 'lucide-react'
// // export default function DataTable({columns,rows=[]}){
// //   const [q,setQ]=useState(''); const [sort,setSort]=useState({key:null,dir:'asc'}); const [page,setPage]=useState(1); const pageSize=10
// //   const filtered=useMemo(()=>{
// //     const f = q? rows.filter(r=>JSON.stringify(r).toLowerCase().includes(q.toLowerCase())) : rows
// //     if(!sort.key) return f; const dir = sort.dir==='asc'?1:-1
// //     return [...f].sort((a,b)=> (a[sort.key] > b[sort.key] ? dir : -dir))
// //   },[q,rows,sort])
// //   const totalPages = Math.max(1, Math.ceil(filtered.length/pageSize)); const pageRows = filtered.slice((page-1)*pageSize, page*pageSize)
// //   function toggleSort(key){ setSort(s => s.key===key ? {key,dir:s.dir==='asc'?'desc':'asc'} : {key,dir:'asc'}) }
// //   return <div className="space-y-3">
// //     <div className="flex items-center justify-between gap-3">
// //       <div className="relative"><input className="input pl-9" placeholder="Search..." value={q} onChange={e=>{setQ(e.target.value); setPage(1)}}/><Search size={16} className="absolute left-3 top-2.5 opacity-60"/></div>
// //       <div className="text-xs opacity-70">{filtered.length} results</div>
// //     </div>
// //     <div className="overflow-auto rounded-xl border border-border">
// //       <table className="table">
// //         <thead className="bg-slate-900/50">
// //           <tr>{columns.map(c=>(<th key={c.key||c} className="th cursor-pointer select-none" onClick={()=>toggleSort(c.key||c)}>
// //             <div className="flex items-center gap-2"><span>{c.label||c}</span>{sort.key===(c.key||c) && (sort.dir==='asc' ? <ChevronUp size={14}/> : <ChevronDown size={14}/>)}</div>
// //           </th>))}</tr>
// //         </thead>
// //         <tbody>
// //           {pageRows.map((r,i)=>(<tr key={i} className="hover:bg-slate-800/40">
// //             {columns.map(c=>{ const k = c.key||c; const render = c.render; return <td key={k} className="td">{render? render(r[k], r) : r[k]}</td> })}
// //           </tr>))}
// //           {pageRows.length===0 && <tr><td className="td" colSpan={columns.length}>No results</td></tr>}
// //         </tbody>
// //       </table>
// //     </div>
// //     <div className="flex items-center justify-end gap-2">
// //       <button className="btn-ghost" onClick={()=>setPage(p=>Math.max(1,p-1))}>Prev</button>
// //       <div className="tag">Page {page} / {totalPages}</div>
// //       <button className="btn-ghost" onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>Next</button>
// //     </div>
// //   </div>
// // }



// import React, { useMemo, useState } from 'react'
// import { ChevronDown, ChevronUp, Search } from 'lucide-react'

// export default function DataTable({
//   columns = [],
//   rows = [],
//   loading = false,
//   emptyText = 'No results',
//   pageSize = 10,
//   rowKey,
//   onRowClick
// }) {
//   const [q, setQ] = useState('')
//   const [sort, setSort] = useState({ key: null, dir: 'asc' })
//   const [page, setPage] = useState(1)

//   // compute responsive class for each column
//   const cols = useMemo(() => {
//     const hideMap = {
//       md: 'md:table-cell hidden',
//       lg: 'lg:table-cell hidden',
//       xl: 'xl:table-cell hidden',
//     }
//     return columns.map(c => ({
//       ...c,
//       _responsiveClass: c.hideBelow ? hideMap[c.hideBelow] || '' : ''
//     }))
//   }, [columns])

//   const filtered = useMemo(() => {
//     const term = q.trim().toLowerCase()
//     const f = term
//       ? rows.filter(r => JSON.stringify(r).toLowerCase().includes(term))
//       : rows

//     if (!sort.key) return f

//     const dir = sort.dir === 'asc' ? 1 : -1
//     const col = cols.find(c => (c.key || c) === sort.key)

//     const getVal = col?.sortAccessor
//       ? (row) => col.sortAccessor(row)
//       : (row) => row[sort.key]

//     return [...f].sort((a, b) => {
//       const av = getVal(a)
//       const bv = getVal(b)
//       if (av == null && bv == null) return 0
//       if (av == null) return -1 * dir
//       if (bv == null) return  1 * dir
//       // numeric compare if both numbers
//       if (typeof av === 'number' && typeof bv === 'number') {
//         return (av - bv) * dir
//       }
//       // date compare if both Date-like
//       const ad = new Date(av)
//       const bd = new Date(bv)
//       if (!isNaN(ad) && !isNaN(bd)) {
//         return (ad.getTime() - bd.getTime()) * dir
//       }
//       // string compare
//       return String(av).localeCompare(String(bv)) * dir
//     })
//   }, [q, rows, sort, cols])

//   const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
//   const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

//   function toggleSort(key) {
//     setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' })
//   }

//   const getRowKey = (r, i) => {
//     if (typeof rowKey === 'function') return rowKey(r, i)
//     if (typeof rowKey === 'string' && r && r[rowKey]) return r[rowKey]
//     return r?.id || String(i)
//   }

//   return (
//     <div className="space-y-3">
//       <div className="flex items-center justify-between gap-3">
//         <div className="relative w-full max-w-xs">
//           <input
//             className="input pl-9 w-full"
//             placeholder="Search..."
//             value={q}
//             onChange={e => { setQ(e.target.value); setPage(1) }}
//           />
//           <Search size={16} className="absolute left-3 top-2.5 opacity-60" />
//         </div>
//         <div className="text-xs opacity-70 tabular-nums">{filtered.length} results</div>
//       </div>

//       <div className="table-wrap rounded-xl border border-border overflow-auto">
//         <table className="table responsive">
//           <thead className="bg-slate-900/50">
//             <tr>
//               {cols.map(c => {
//                 const key = c.key || c
//                 return (
//                   <th
//                     key={key}
//                     className={`th cursor-pointer select-none ${c.headerClassName || ''} ${c._responsiveClass}`}
//                     onClick={() => toggleSort(key)}
//                   >
//                     <div className="flex items-center gap-2">
//                       <span>{c.label || c}</span>
//                       {sort.key === key && (sort.dir === 'asc'
//                         ? <ChevronUp size={14} />
//                         : <ChevronDown size={14} />)}
//                     </div>
//                   </th>
//                 )
//               })}
//             </tr>
//           </thead>

//           <tbody>
//             {loading && (
//               <tr>
//                 <td colSpan={cols.length} className="td text-center py-6 opacity-80">Loading…</td>
//               </tr>
//             )}

//             {!loading && pageRows.length === 0 && (
//               <tr>
//                 <td colSpan={cols.length} className="td text-center py-6 opacity-60">{emptyText}</td>
//               </tr>
//             )}

//             {!loading && pageRows.map((r, i) => (
//               <tr
//                 key={getRowKey(r, i)}
//                 className={`hover:bg-slate-800/40 ${onRowClick ? 'cursor-pointer' : ''}`}
//                 onClick={onRowClick ? () => onRowClick(r) : undefined}
//               >
//                 {cols.map(c => {
//                   const k = c.key || c
//                   const render = c.render
//                   const value = r[k]
//                   return (
//                     <td
//                       key={k}
//                       className={`td ${c.className || ''} ${c._responsiveClass}`}
//                       data-label={c.label || k}
//                     >
//                       {render ? render(value, r, i) : (value ?? '')}
//                     </td>
//                   )
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex items-center justify-end gap-2">
//         <button
//           className="btn-ghost"
//           onClick={() => setPage(p => Math.max(1, p - 1))}
//           disabled={page <= 1}
//         >
//           Prev
//         </button>
//         <div className="tag">Page {page} / {totalPages}</div>
//         <button
//           className="btn-ghost"
//           onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//           disabled={page >= totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   )
// }


import React, { useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

export default function DataTable({ columns, rows = [], onRowClick, loading = false }) {
  const [q, setQ] = useState('')
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const [page, setPage] = useState(1)
  const pageSize = 10

  const filtered = useMemo(() => {
    const f = q ? rows.filter(r => JSON.stringify(r).toLowerCase().includes(q.toLowerCase())) : rows
    if (!sort.key) return f
    const dir = sort.dir === 'asc' ? 1 : -1
    return [...f].sort((a, b) => (a[sort.key] > b[sort.key] ? dir : -dir))
  }, [q, rows, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize)

  function toggleSort(key) {
    setSort(s => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' }))
  }

  return (
    <div className="space-y-3 relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/30">
          <div className="px-3 py-1 rounded bg-slate-800 border border-border text-sm">Loading…</div>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <div className="relative">
          <input
            className="input pl-9"
            placeholder="Search..."
            value={q}
            onChange={e => {
              setQ(e.target.value)
              setPage(1)
            }}
          />
          <Search size={16} className="absolute left-3 top-2.5 opacity-60" />
        </div>
        <div className="text-xs opacity-70">{filtered.length} results</div>
      </div>

      <div className="overflow-auto rounded-xl border border-border">
        <table className="table">
          <thead className="bg-slate-900/50">
            <tr>
              {columns.map(c => {
                const key = c.key || c
                const label = c.label || c
                const hide = c.hideBelow
                  ? (c.hideBelow === 'sm' && 'hidden sm:table-cell') ||
                    (c.hideBelow === 'md' && 'hidden md:table-cell') ||
                    (c.hideBelow === 'lg' && 'hidden lg:table-cell') ||
                    (c.hideBelow === 'xl' && 'hidden xl:table-cell')
                  : ''
                return (
                  <th
                    key={key}
                    className={`th cursor-pointer select-none ${hide}`}
                    onClick={() => toggleSort(key)}
                    title="Sort"
                  >
                    <div className="flex items-center gap-2">
                      <span>{label}</span>
                      {sort.key === key && (sort.dir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((r, i) => (
              <tr
                key={r.id || i}
                className={`hover:bg-slate-800/40 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(r)}
              >
                {columns.map(c => {
                  const k = c.key || c
                  const hide = c.hideBelow
                    ? (c.hideBelow === 'sm' && 'hidden sm:table-cell') ||
                      (c.hideBelow === 'md' && 'hidden md:table-cell') ||
                      (c.hideBelow === 'lg' && 'hidden lg:table-cell') ||
                      (c.hideBelow === 'xl' && 'hidden xl:table-cell')
                    : ''
                  return (
                    <td key={k} className={`td ${hide}`} onClick={c.onCellClick ? (e)=>{ e.stopPropagation(); c.onCellClick(r) } : undefined}>
                      {c.render ? c.render(r[k], r) : r[k]}
                    </td>
                  )
                })}
              </tr>
            ))}
            {pageRows.length === 0 && (
              <tr>
                <td className="td" colSpan={columns.length}>
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button className="btn-ghost" onClick={() => setPage(p => Math.max(1, p - 1))}>
          Prev
        </button>
        <div className="tag">
          Page {page} / {totalPages}
        </div>
        <button className="btn-ghost" onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
          Next
        </button>
      </div>
    </div>
  )
}
