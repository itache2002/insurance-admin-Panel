// import React from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import App from './App.jsx'
// import './styles.css'
// import { ToastProvider, useToast } from './components/ui/Toast.jsx'
// import { toast as toastObj } from './components/ui/Toast.jsx'

// function Bridge(){ const t = useToast(); React.useEffect(()=>{ toastObj.success=t.success; toastObj.error=t.error; toastObj.info=t.info },[t]); return null }
// createRoot(document.getElementById('root')).render(
//   <ToastProvider>
//     <Bridge/>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </ToastProvider>
// )


import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'

import AuthProvider from './lib/auth.jsx'                 // ✅ wrap app with AuthProvider
import { ToastProvider, useToast } from './components/ui/Toast.jsx'
import { toast as toastObj } from './components/ui/Toast.jsx'

function Bridge(){
  const t = useToast()
  React.useEffect(()=>{
    toastObj.success = t.success
    toastObj.error   = t.error
    toastObj.info    = t.info
  }, [t])
  return null
}

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <ToastProvider>
      <Bridge/>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ToastProvider>
  </AuthProvider>
)
