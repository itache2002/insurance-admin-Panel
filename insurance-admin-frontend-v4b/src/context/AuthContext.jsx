// import React, { createContext, useContext, useState } from 'react'
// import { http, getCSRF } from '../lib/api'

// const AuthCtx = createContext(null)
// export const useAuth = () => useContext(AuthCtx)

// export default function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(false)

//   async function login(email, password){
//     setLoading(true)
//     try {
//       await getCSRF()
//       const { user } = await http('/api/auth/login', { method:'POST', body:{ email, password } })
//       setUser(user)
//       return user
//     } finally { setLoading(false) }
//   }

//   async function logout(){
//     await http('/api/auth/logout', { method:'POST' })
//     setUser(null)
//   }

//   return <AuthCtx.Provider value={{ user, setUser, login, logout, loading }}>{children}</AuthCtx.Provider>
// }




import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { http, getCSRF, setUnauthorizedHandler } from '../lib/api'

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

const STORAGE_KEY = 'ia_user_session' // sessionStorage key

export default function AuthProvider({ children }) {
  // hydrate from sessionStorage so refresh keeps you logged in (until server says 401)
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  // persist changes
  useEffect(() => {
    try {
      if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      else sessionStorage.removeItem(STORAGE_KEY)
    } catch {}
  }, [user])

  // global 401 handler -> clear user & hard redirect to /login
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null)
      try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
      // hard replace ensures clean state
      window.location.replace('/login')
    })
  }, [])

  async function login(email, password){
    setLoading(true)
    try {
      await getCSRF()
      const { user } = await http('/api/auth/login', { method:'POST', body:{ email, password } })
      setUser(user)
      return user
    } finally { setLoading(false) }
  }

  async function logout(){
    try { await http('/api/auth/logout', { method:'POST' }) } catch {}
    setUser(null)
    try { sessionStorage.removeItem(STORAGE_KEY) } catch {}
    window.location.replace('/login')
  }

  const value = useMemo(() => ({ user, setUser, login, logout, loading }), [user, loading])

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
