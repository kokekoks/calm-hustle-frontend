import { useEffect, useState } from "react";
import api from "../api/axios";
import { AuthContext } from "./authContext";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/login", { email, password });
    const { access_token, user: loggedInUser } = response.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setToken(access_token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (values) => {
    const response = await api.post("/register", values);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/logout");
    } catch {
      localStorage.removeItem("token");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}