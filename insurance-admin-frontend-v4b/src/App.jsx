import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import Layout from './components/Layout'
import { RequireAuth, RequireRole } from './components/Guarded'

import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import AdminAgents from './pages/admin/Agents'
import AdminAdmins from './pages/admin/Admins'
import AdminActivity from './pages/admin/Activity'
import AdminCustomers from './pages/admin/Customers'
import AdminSales from './pages/admin/Sales'

import AgentDashboard from './pages/agent/Dashboard'
import AgentCustomers from './pages/agent/Customers'
import AgentProfile from './pages/agent/Profile'
import ChangePassword from './pages/agent/ChangePassword'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<RequireAuth><Layout><Home /></Layout></RequireAuth>} />
        <Route path="/admin/dashboard" element={<RequireAuth><RequireRole role="admin"><Layout><AdminDashboard /></Layout></RequireRole></RequireAuth>} />
        <Route path="/admin/agents" element={<RequireAuth><RequireRole role="admin"><Layout><AdminAgents /></Layout></RequireRole></RequireAuth>} />
        <Route path="/admin/customers" element={<RequireAuth><RequireRole role="admin"><Layout><AdminCustomers /></Layout></RequireRole></RequireAuth>} />
        <Route path="/admin/sales" element={<RequireAuth><RequireRole role="admin"><Layout><AdminSales /></Layout></RequireRole></RequireAuth>} />
        <Route path="/admin/admins" element={<RequireAuth><RequireRole role="admin"><Layout><AdminAdmins /></Layout></RequireRole></RequireAuth>} />
        <Route path="/admin/activity" element={<RequireAuth><RequireRole role="admin"><Layout><AdminActivity /></Layout></RequireRole></RequireAuth>} />

        <Route path="/agent/dashboard" element={<RequireAuth><RequireRole role="agent"><Layout><AgentDashboard /></Layout></RequireRole></RequireAuth>} />
        <Route path="/agent/customers" element={<RequireAuth><RequireRole role="agent"><Layout><AgentCustomers /></Layout></RequireRole></RequireAuth>} />
        <Route path="/agent/profile" element={<RequireAuth><RequireRole role="agent"><Layout><AgentProfile /></Layout></RequireRole></RequireAuth>} />
        <Route path="/agent/change-password" element={<RequireAuth><RequireRole role="agent"><Layout><ChangePassword /></Layout></RequireRole></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </AuthProvider>
  )
}

function Home(){ return <div className="card">Choose a section from the sidebar.</div> }
