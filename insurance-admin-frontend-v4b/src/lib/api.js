// const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// let csrfToken = null;
// export async function getCSRF() {
//   try {
//     const res = await fetch(base + '/api/auth/csrf', { credentials: 'include' });
//     if (res.ok) {
//       const data = await res.json();
//       csrfToken = data.csrfToken;
//     }
//   } catch {}
//   return csrfToken;
// }

// export async function http(path, { method='GET', body, headers={} } = {}) {
//   const h = { 'Content-Type': 'application/json', ...headers };
//   if (!csrfToken && method !== 'GET') await getCSRF();
//   if (csrfToken && method !== 'GET') h['x-csrf-token'] = csrfToken;

//   const res = await fetch(base + path, {
//     method,
//     headers: h,
//     credentials: 'include',
//     body: body ? JSON.stringify(body) : undefined
//   });
//   if (!res.ok) {
//     let t = {};
//     try { t = await res.json(); } catch {}
//     throw new Error(t.error || res.statusText);
//   }
//   return res.json();
// }


// Centralized HTTP with CSRF, no-cache, and global 401 handling

const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

let csrfToken = null;
let onUnauthorized = null; // set by AuthContext

export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

export async function getCSRF() {
  try {
    const res = await fetch(base + '/api/auth/csrf', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      csrfToken = data.csrfToken;
    }
  } catch {}
  return csrfToken;
}

export async function http(path, { method = 'GET', body, headers = {} } = {}) {
  const h = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    ...headers,
  };

  if (!csrfToken && method !== 'GET') await getCSRF();
  if (csrfToken && method !== 'GET') h['x-csrf-token'] = csrfToken;

  // add cache-buster for GET
  const sep = path.includes('?') ? '&' : '?';
  const url =
    base + path + (method === 'GET' ? `${sep}_=${Date.now()}` : '');

  const res = await fetch(url, {
    method,
    headers: h,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  // handle 401 globally -> clear user, redirect to /login
  if (res.status === 401) {
    if (onUnauthorized) onUnauthorized();
    let msg = 'Unauthorized';
    try {
      const t = await res.json();
      msg = t.error || msg;
    } catch {}
    const err = new Error(msg);
    err.code = 'UNAUTHORIZED';
    throw err;
  }

  if (!res.ok) {
    let t = {};
    try {
      t = await res.json();
    } catch {}
    throw new Error(t.error || res.statusText);
  }

  // 204?
  if (res.status === 204) return null;
  return res.json();
}

