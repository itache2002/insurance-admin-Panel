
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth.jsx'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

import Hire from './pages/admin/Hire'
import AdminUsers from './pages/admin/Users'
import AdminAgents from './pages/admin/Agents'
import AdminEmployees from './pages/admin/Employees'
import AdminCustomers from './pages/admin/Customers'
import AdminTargets from './pages/admin/Targets'
import AdminStats from './pages/admin/Stats'

import EmployeeAgents from './pages/employee/Agents'
import EmployeeCustomers from './pages/employee/Customers'
import AgentCustomers from './pages/agent/Customers'
import AgentTargets from './pages/agent/Targets'
import AgentStats from './pages/agent/Stats'
import Profile from './pages/Profile'

import HireAgent from './pages/employee/HireAgent.jsx'
import EmployeeTargets from './pages/employee/Targets.jsx'

function Guard({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <Guard>
              <Layout><Dashboard /></Layout>
            </Guard>
          }
        />

        {/* Admin-only */}
        <Route path="/admin/hire" element={<Guard roles={['super_admin','admin']}><Layout><Hire/></Layout></Guard>} />
        <Route path="/admin/users" element={<Guard roles={['super_admin','admin']}><Layout><AdminUsers/></Layout></Guard>} />
        <Route path="/admin/agents" element={<Guard roles={['super_admin','admin']}><Layout><AdminAgents/></Layout></Guard>} />
        <Route path="/admin/employees" element={<Guard roles={['super_admin','admin']}><Layout><AdminEmployees/></Layout></Guard>} />
        <Route path="/admin/customers" element={<Guard roles={['super_admin','admin']}><Layout><AdminCustomers/></Layout></Guard>} />
        <Route path="/admin/targets" element={<Guard roles={['super_admin','admin']}><Layout><AdminTargets/></Layout></Guard>} />
        <Route path="/admin/stats" element={<Guard roles={['super_admin','admin']}><Layout><AdminStats/></Layout></Guard>} />

        {/* Employee */}
        <Route path="/employee/agents" element={<Guard roles={['employee']}><Layout><EmployeeAgents/></Layout></Guard>} />
        <Route path="/employee/customers" element={<Guard roles={['employee']}><Layout><EmployeeCustomers/></Layout></Guard>} />
        <Route path="/employee/hire" element={<Guard roles={['employee']}> <Layout><HireAgent /></Layout></Guard>}/>
        <Route path="/employee/targets"element={<Guard roles={['employee']}><Layout><EmployeeTargets/></Layout></Guard>}/>

        {/* Agent */}
        <Route path="/agent/customers" element={<Guard roles={['agent']}><Layout><AgentCustomers/></Layout></Guard>} />
        <Route path="/agent/targets" element={<Guard roles={['agent']}><Layout><AgentTargets/></Layout></Guard>} />
        <Route path="/agent/stats" element={<Guard roles={['agent']}><Layout><AgentStats/></Layout></Guard>} />

        <Route path="/profile" element={<Guard><Layout><Profile/></Layout></Guard>} />
        <Route path="*" element={<Navigate to="/" replace/>} />
      </Routes>
    </AuthProvider>
  )
}
