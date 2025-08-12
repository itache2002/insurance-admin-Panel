// import React from 'react'
// import { NavLink } from 'react-router-dom'
// import { useAuth } from '../context/AuthContext'

// export default function Layout({ children }) {
//   const { user, logout } = useAuth()
//   return (
//     <div className="min-h-screen grid md:grid-cols-[260px_1fr]">
//       <aside className="hidden md:flex flex-col gap-4 p-5 border-r border-white/10 bg-[#0E1430]">
//         <div className="flex items-center gap-2 text-xl font-semibold">
//           <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">IA</div>
//           Insurance Admin
//         </div>
//         <nav className="mt-4 flex flex-col gap-2">
//           {user?.role === 'admin' ? (
//             <>
//               <SideLink to="/admin/dashboard" label="Dashboard" />
//               <SideLink to="/admin/agents" label="Agents" />
//               <SideLink to="/admin/customers" label="Customers" />
//               <SideLink to="/admin/sales" label="Sales" />
//               <SideLink to="/admin/admins" label="Admins" />
//               <SideLink to="/admin/activity" label="Activity Logs" />
//             </>
//           ) : (
//             <>
//               <SideLink to="/agent/dashboard" label="My Dashboard" />
//               <SideLink to="/agent/customers" label="My Customers" />
//               <SideLink to="/agent/profile" label="My Profile" />
//               <SideLink to="/agent/change-password" label="Change Password" />
//             </>
//           )}
//         </nav>
//         <div className="mt-auto">
//           <button className="btn-outline w-full" onClick={logout}>Logout</button>
//         </div>
//       </aside>
//       <main className="p-5 md:p-8">
//         <Topbar />
//         <div className="mt-6">{children}</div>
//       </main>
//     </div>
//   )
// }
// function SideLink({ to, label }) {
//   return <NavLink to={to} className={({isActive}) => `tab ${isActive ? 'tab-active' : ''}` }>{label}</NavLink>
// }
// function Topbar() {
//   const { user } = useAuth()
//   return (
//     <div className="flex items-center justify-between">
//       <div className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ''}</div>
//       <div className="hidden md:flex items-center gap-3">
//         <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-muted">
//           Role: <span className="text-white">{user?.role || 'guest'}</span>
//         </div>
//       </div>
//     </div>
//   )
// }


// src/components/Layout.jsx
import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen md:grid md:grid-cols-[260px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col gap-4 p-5 border-r border-white/10 bg-[#0E1430]">
        <Brand />
        <NavLinks role={user?.role} />
        <div className="mt-auto">
          <button className="btn-outline w-full" onClick={logout}>Logout</button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <header className="md:hidden sticky top-0 z-40 bg-bg/90 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button className="btn-outline px-3 py-1.5" onClick={()=>setOpen(true)}>Menu</button>
          <Brand />
          <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-muted">
            {user?.role || 'guest'}
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className={`md:hidden fixed inset-0 z-50 ${open ? '' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={()=>setOpen(false)}
        />
        <div className={`absolute left-0 top-0 h-full w-72 bg-[#0E1430] border-r border-white/10 p-5 transition-transform ${open ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between mb-4">
            <Brand />
            <button className="btn-outline px-3 py-1.5" onClick={()=>setOpen(false)}>Close</button>
          </div>
          <NavLinks role={user?.role} onClickLink={()=>setOpen(false)} />
          <button className="btn-outline w-full mt-6" onClick={logout}>Logout</button>
        </div>
      </div>

      <main className="p-4 md:p-8">
        <Topbar />
        <div className="mt-6">{children}</div>
      </main>
    </div>
  )
}

function Brand(){
  return (
    <div className="flex items-center gap-2 text-xl font-semibold">
      <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center">IA</div>
      Insurance Admin
    </div>
  )
}

function NavLinks({ role, onClickLink }){
  const Link = ({ to, label }) =>
    <NavLink to={to} onClick={onClickLink} className={({isActive}) => `tab block ${isActive ? 'tab-active' : ''}` }>{label}</NavLink>

  return (
    <nav className="mt-4 flex flex-col gap-2">
      {role === 'admin' ? (
        <>
          <Link to="/admin/dashboard" label="Dashboard" />
          <Link to="/admin/agents" label="Agents" />
          <Link to="/admin/customers" label="Customers" />
          <Link to="/admin/sales" label="Sales" />
          <Link to="/admin/admins" label="Admins" />
          <Link to="/admin/activity" label="Activity Logs" />
        </>
      ) : (
        <>
          <Link to="/agent/dashboard" label="My Dashboard" />
          <Link to="/agent/customers" label="My Customers" />
          <Link to="/agent/profile" label="My Profile" />
          <Link to="/agent/change-password" label="Change Password" />
        </>
      )}
    </nav>
  )
}

function Topbar() {
  const { user } = useAuth()
  return (
    <div className="hidden md:flex items-center justify-between">
      <div className="text-2xl font-semibold">Welcome{user ? `, ${user.name}` : ''}</div>
      <div className="hidden md:flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-sm text-muted">
          Role: <span className="text-white">{user?.role || 'guest'}</span>
        </div>
      </div>
    </div>
  )
}
