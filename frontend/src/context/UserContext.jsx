import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.clear();
        setUser(null);
        setToken(null);
        navigate("/login");
      })
      .finally(() => setLoading(false));
  }, [token, navigate, API_BASE_URL]);

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
