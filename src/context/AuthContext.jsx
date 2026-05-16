import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, getProfile } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile()
        .then(res => {
          // Profile returns { message, user } where user.role is populated { _id, role }
          const u = res.data.user;
          // Normalize role to a plain string for easy comparison everywhere
          const roleStr = u.role?.role || u.role || '';
          const roleId = u.role?._id || '';
          setUser({ ...u, role: roleStr, roleId });
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (gmail, password) => {
    const res = await loginApi({ gmail, password });
    // Login returns: { success, token, role (string), roleId, user: { id, name, gmail, phoneNo, dept, programme } }
    const { token, role, roleId, user: userData } = res.data;
    localStorage.setItem('token', token);
    // Merge role string and roleId into user object for consistent access
    const fullUser = { ...userData, role, roleId };
    setUser(fullUser);
    return fullUser;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
