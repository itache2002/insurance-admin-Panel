// import React from 'react'
// import { Link, useLocation } from 'react-router-dom'
// import { useAuth } from '../lib/auth'
// import { LogOut, Users, BadgeDollarSign, Target, BarChart3, UserCircle2, UsersRound, Home, Contact } from 'lucide-react'

// function NavItem({to,icon:Icon,label}){
//   const loc = useLocation(); const active = loc.pathname === to
//   return <Link to={to} className={'flex items-center gap-2 px-3 py-2 rounded-xl border transition ' + (active? 'bg-grad-1 border-accent text-accent' : 'bg-slate-900 border-border hover:border-accent/40')}>
//     <Icon size={18}/> <span className="text-sm">{label}</span>
//   </Link>
// }
// export default function Layout({children}){
//   const { user, logout, mustChangePassword } = useAuth(); const role = user?.role
//   return <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] bg-grid bg-[length:18px_18px]">
//     <aside className="p-4 md:p-6 border-r border-border bg-slate-950/60">
//       <div className="flex items-center gap-3 mb-6">
//         <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 shadow-glow"></div>
//         <div><div className="font-bold">Insurance Suite</div><div className="text-xs opacity-70">{role}</div></div>
//       </div>
//       <nav className="flex flex-col gap-2">
//         <NavItem to="/" icon={Home} label="Dashboard"/>
//         {['super_admin','admin'].includes(role) && <>
//           <NavItem to="/admin/users" icon={Users} label="Users"/>
//           <NavItem to="/admin/agents" icon={UsersRound} label="Agents"/>
//           <NavItem to="/admin/employees" icon={BadgeDollarSign} label="Employees"/>
//           <NavItem to="/admin/customers" icon={Contact} label="Customers"/>
//           <NavItem to="/admin/targets" icon={Target} label="Targets"/>
//           <NavItem to="/admin/stats" icon={BarChart3} label="Stats"/>
//         </>}
//         {role==='employee' && <>
//           <NavItem to="/employee/agents" icon={Users} label="My Agents"/>
//           <NavItem to="/employee/customers" icon={Contact} label="My Customers"/>
//         </>}
//         {role==='agent' && <>
//           <NavItem to="/agent/customers" icon={Contact} label="Customers"/>
//           <NavItem to="/agent/targets" icon={Target} label="Targets"/>
//           <NavItem to="/agent/stats" icon={BarChart3} label="Monthly Stats"/>
//         </>}
//         <NavItem to="/profile" icon={UserCircle2} label="Profile"/>
//       </nav>
//       <button onClick={logout} className="mt-6 btn-ghost w-full flex items-center justify-center gap-2"><LogOut size={16}/> Logout</button>
//       {mustChangePassword && <div className="mt-4 text-xs text-yellow-400">⚠️ Please change your temporary password (Profile).</div>}
//     </aside>
//     <main className="p-4 md:p-8 space-y-6">{children}</main>
//   </div>
// }


import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth.jsx'
import { LogOut, Users, BadgeDollarSign, Target, BarChart3, UserCircle2, UsersRound, Home, Contact, UserPlus } from 'lucide-react'
import logo from '../Assets/logo.png' 

function NavItem({to,icon:Icon,label}){
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link to={to} className={'flex items-center gap-2 px-3 py-2 rounded-xl border transition ' + (active? 'bg-grad-1 border-accent text-accent' : 'bg-slate-900 border-border hover:border-accent/40')}>
      <Icon size={18}/> <span className="text-sm">{label}</span>
    </Link>
  )
}

export default function Layout({children}){
  const { user, logout, mustChangePassword } = useAuth()
  const role = user?.role

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] bg-grid bg-[length:18px_18px]">
      <aside className="p-4 md:p-6 border-r border-border bg-slate-950/60">
        <div className="flex items-center gap-3 mb-6">
          {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-accent2 shadow-glow"></div> */}
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-glow">
                <img
                  src={logo} // <-- replace with your image path
                  alt="Wodeyar Insurance Logo"
                  className="w-full h-full object-cover"
                />
            </div>
          <div>
            <div className="font-bold">Wodeyar Insurance</div>
            <div className="text-xs opacity-70">{role}</div>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <NavItem to="/" icon={Home} label="Dashboard"/>
          {['super_admin','admin'].includes(role) && <>
            <NavItem to="/admin/hire" icon={UserPlus} label="Hire"/>
            <NavItem to="/admin/users" icon={Users} label="Users"/>
            <NavItem to="/admin/agents" icon={UsersRound} label="Agents"/>
            <NavItem to="/admin/employees" icon={BadgeDollarSign} label="Employees"/>
            <NavItem to="/admin/customers" icon={Contact} label="Customers"/>
            <NavItem to="/admin/targets" icon={Target} label="Targets"/>
            {/* <NavItem to="/admin/stats" icon={BarChart3} label="Stats"/> */}
          </>}
          {role==='employee' && <>
            <NavItem to="/employee/agents" icon={Users} label="My Agents"/>
            <NavItem to="/employee/hire" icon={UserPlus} label="Hire Agent" />
            <NavItem to="/employee/customers" icon={Contact} label="My Customers"/>
            <NavItem to="/employee/targets" icon={Target} label="Targets"/> {/* <-- add this */}
          </>}
          {role==='agent' && <>
            <NavItem to="/agent/customers" icon={Contact} label="Customers"/>
            <NavItem to="/agent/targets" icon={Target} label="Targets"/>
            <NavItem to="/agent/stats" icon={BarChart3} label="Monthly Stats"/>
          </>}
          <NavItem to="/profile" icon={UserCircle2} label="Profile"/>
        </nav>
        <button onClick={logout} className="mt-6 btn-ghost w-full flex items-center justify-center gap-2">
          <LogOut size={16}/> Logout
        </button>
        {mustChangePassword && <div className="mt-4 text-xs text-yellow-400">⚠️ Please change your temporary password (Profile).</div>}
      </aside>
      <main className="p-4 md:p-8 space-y-6">
        {children}
      </main>
    </div>
  )
}
