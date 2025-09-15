// Auth Context React File
// Centralizes current user state for the SPA.
// On initial load, it calls /auth/me to hydrate the session if a valid JWT cokkie exists.
// Exposes 'user', 'setUser', 'ready', and 'logout()'.

import { createContext, useContext, useEffect, useState } from 'react';
import { api } from './lib/api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, name, email, role, tokenBalance }
  const [ready, setReady] = useState(false); // app can render gated routes once true

  // On first load, try to get the current user from the server (JWT cookie)
  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  // Logout clears the server cookie and resets local state
  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthCtx.Provider value={{ user, setUser, ready, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);