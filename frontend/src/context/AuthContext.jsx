import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { clearGuestData } from '../utils/guestData';

const AuthContext = createContext();

// Synthetic user object for guest sessions — no real account
const GUEST_USER = {
  name: 'Guest',
  email: 'guest@synora.demo',
  isGuest: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      // ── Restore guest session from localStorage (no API needed) ──
      if (localStorage.getItem('guest_mode') === 'true') {
        setUser(GUEST_USER);
        setLoading(false);
        return;
      }

      // ── Restore real JWT session ──
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/api/auth/me');
          setUser(res.data.data);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signup = async (name, email, password) => {
    try {
      setError(null);
      const res = await api.post('/api/auth/signup', { name, email, password });
      localStorage.setItem('token', res.data.data.token);
      setUser(res.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
      return false;
    }
  };

  /** Instant guest session — no API call, no credentials needed */
  const enterGuestMode = () => {
    localStorage.setItem('guest_mode', 'true');
    setUser(GUEST_USER);
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearGuestData(); // wipes guest_mode + all synora_guest_* keys
    setUser(null);
  };

  const isGuest = Boolean(user?.isGuest);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, signup, logout, enterGuestMode, isGuest, setError }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
