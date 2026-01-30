import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useApi() {
  const { access, refresh } = useContext(AuthContext);

  async function apiFetch(url, options = {}) {
    const r = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
      },
      credentials: "include",
    });
    if (r.status !== 401) return r;
    const ok = await refresh();
    if (!ok) return r;
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${access}`,
      },
      credentials: "include",
    });
  }

  return { apiFetch };
}
