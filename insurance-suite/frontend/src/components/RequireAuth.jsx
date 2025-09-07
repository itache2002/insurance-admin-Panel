import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function RequireAuth({ children }){
  const { user, loading } = useAuth()

  // While we’re doing the silent refresh, keep the app mounted (no redirect)
  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-slate-300">
        Checking session…
      </div>
    )
  }

  // After refresh attempt: if no user, go to login
  if (!user) return <Navigate to="/login" replace />

  return children
}
