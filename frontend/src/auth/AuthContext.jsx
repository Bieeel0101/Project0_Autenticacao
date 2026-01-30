import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);

  async function login(email, password) {
    const r = await fetch("http://localhost:4000/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await r.json();
    if (r.ok) setAccess(data.access);
    return { ok: r.ok, data };
  }

  async function refresh() {
    const r = await fetch("http://localhost:4000/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    if (!r.ok) {
      setAccess(null);
      return false;
    }
    const data = await r.json();
    setAccess(data.access);
    return true;
  }

  async function logout() {
    await fetch("http://localhost:4000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAccess(null);
  }

  return (
    <AuthContext.Provider value={{ access, setAccess, login, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
