import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // load persisted session once
  useEffect(() => {
    const savedToken = window.localStorage.getItem("token");
    const savedUser = window.localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // login = set + persist
  function login(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    window.localStorage.setItem("token", nextToken);
    window.localStorage.setItem("user", JSON.stringify(nextUser));
  }

  // logout = clear + forget
  function logout() {
    setToken(null);
    setUser(null);
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
  }

  const isAuth = Boolean(token && user);

  const value = useMemo(
    () => ({ token, user, isAuth, login, logout }),
    [token, user, isAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
