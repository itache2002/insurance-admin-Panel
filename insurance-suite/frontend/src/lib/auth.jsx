// // import React, { createContext, useContext, useState } from 'react'
// // import { api, setAccessToken } from './api'
// // const AuthCtx = createContext(null)
// // export function AuthProvider({children}){
// //   const [user,setUser] = useState(null)
// //   const [mustChangePassword,setMustChangePassword] = useState(false)
// //   const [loading,setLoading] = useState(false)
// //   const [error,setError] = useState(null)
// //   async function login(email,password){
// //     setLoading(true); setError(null)
// //     try{ const res = await api.login(email,password); setAccessToken(res.access_token); setUser(res.user); setMustChangePassword(!!res.must_change_password); return true }
// //     catch(e){ setError(e.message); return false }
// //     finally{ setLoading(false) }
// //   }
// //   async function logout(){ await api.logout(); setAccessToken(''); setUser(null); setMustChangePassword(false) }
// //   return <AuthCtx.Provider value={{ user, login, logout, loading, error, mustChangePassword, setMustChangePassword }}>{children}</AuthCtx.Provider>
// // }
// // export function useAuth(){ return useContext(AuthCtx) }


// import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
// import { api, setAccessToken } from './api'

// const AuthCtx = createContext(null)
// export function useAuth(){ return useContext(AuthCtx) }

// export default function AuthProvider({ children }){
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [mustChangePassword, setMustChangePassword] = useState(false)

//   // silent refresh on mount (uses httpOnly refresh cookie)
//   useEffect(() => {
//     let ignore = false
//     ;(async () => {
//       try {
//         const d = await api.refresh()
//         if (ignore) return
//         setAccessToken(d.access_token)
//         setUser(d.user || null)
//       } catch {
//         if (ignore) return
//         setAccessToken('')
//         setUser(null)
//       } finally {
//         if (!ignore) setLoading(false)
//       }
//     })()
//     return () => { ignore = true }
//   }, [])

//   const login = async (email, password) => {
//     const d = await api.login(email, password)
//     setAccessToken(d.access_token)
//     setUser(d.user || null)
//     if (d.must_change_password !== undefined) {
//       setMustChangePassword(!!d.must_change_password)
//     }
//     return d
//   }

//   const logout = async () => {
//     try { await api.logout() } catch {}
//     setAccessToken('')
//     setUser(null)
//   }

//   const value = useMemo(() => ({
//     user, setUser,
//     loading,
//     login, logout,
//     mustChangePassword, setMustChangePassword,
//   }), [user, loading, mustChangePassword])

//   return (
//     <AuthCtx.Provider value={value}>
//       {children}
//     </AuthCtx.Provider>
//   )
// }


import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, setAccessToken } from './api'

const AuthCtx = createContext(null)
export function useAuth(){ return useContext(AuthCtx) }

function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mustChangePassword, setMustChangePassword] = useState(false)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const d = await api.refresh()
        if (ignore) return
        setAccessToken(d.access_token)
        setUser(d.user || null)
      } catch {
        if (ignore) return
        setAccessToken('')
        setUser(null)
      } finally {
        if (!ignore) setLoading(false)
      }
    })()
    return () => { ignore = true }
  }, [])

  const login = async (email, password) => {
    const d = await api.login(email, password)
    setAccessToken(d.access_token)
    setUser(d.user || null)
    if (d.must_change_password !== undefined) {
      setMustChangePassword(!!d.must_change_password)
    }
    return d
  }

  const logout = async () => {
    try { await api.logout() } catch {}
    setAccessToken('')
    setUser(null)
  }

  const value = useMemo(() => ({
    user, setUser,
    loading,
    login, logout,
    mustChangePassword, setMustChangePassword,
  }), [user, loading, mustChangePassword])

  return (
    <AuthCtx.Provider value={value}>
      {children}
    </AuthCtx.Provider>
  )
}

export default AuthProvider         // default export
export { AuthProvider }             // named export too
