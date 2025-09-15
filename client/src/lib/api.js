// API Helper - wraps fetch for the front-end
// 'BASE' comes from Vite env and points at the Express API.
// 'credentials: include' allows httpOnly cookies (JWT) to flow automatically.
// Throws on non-2xx with the JSON error message so UI can show a message.
const BASE = import.meta.env.VITE_API_URL;

async function req(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',        // send/receive JWT cookie
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// Auth-specific calls used by the AuthContext and pages.
export const api = {
  register: (p) => req('/auth/register', { method: 'POST', body: p }),
  login:    (p) => req('/auth/login',    { method: 'POST', body: p }),
  me:       ()  => req('/auth/me'),
  logout:   ()  => req('/auth/logout',   { method: 'POST' }),
  listMeals:()  => req('/meals'),
  createMeal:(p)=> req('/meals', { method: 'POST', body: p }),
  listOrders:(role)=> req(`/orders?role=${role}`),
  placeOrder:(p)=> req('/orders', { method: 'POST', body: p }),
  acceptOrder:(id)=> req(`/orders/${id}/accept`, { method: 'POST' }),
};