import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// In a real app these would be validated server-side.
// For this demo, credentials are checked client-side only.
const DEMO_CREDENTIALS = [
  { username: 'admin', password: 'Admin@2024!', role: 'admin', displayName: 'Admin User' },
  { username: 'analyst', password: 'Analyst@2024!', role: 'analyst', displayName: 'Security Analyst' },
];

const SESSION_KEY = 'ids_session';
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => loadSession());
  const [loginError, setLoginError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  const MAX_ATTEMPTS = 5;
  const LOCKOUT_MS = 5 * 60 * 1000; // 5 minutes

  const login = useCallback((username, password) => {
    // Check lockout
    if (lockedUntil && Date.now() < lockedUntil) {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      setLoginError(`Too many failed attempts. Try again in ${remaining}s.`);
      return false;
    }

    // Sanitize inputs
    const cleanUser = String(username).trim().slice(0, 64);
    const cleanPass = String(password).slice(0, 128);

    const match = DEMO_CREDENTIALS.find(
      (c) => c.username === cleanUser && c.password === cleanPass
    );

    if (!match) {
      const attempts = loginAttempts + 1;
      setLoginAttempts(attempts);
      if (attempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS);
        setLoginError(`Account locked for 5 minutes after ${MAX_ATTEMPTS} failed attempts.`);
      } else {
        setLoginError(`Invalid credentials. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.`);
      }
      return false;
    }

    const newSession = {
      username: match.username,
      displayName: match.displayName,
      role: match.role,
      expiresAt: Date.now() + SESSION_TIMEOUT_MS,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    setLoginError('');
    setLoginAttempts(0);
    setLockedUntil(null);
    return true;
  }, [loginAttempts, lockedUntil]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setSession(null);
  }, []);

  // Extend session on activity
  const refreshSession = useCallback(() => {
    if (!session) return;
    const updated = { ...session, expiresAt: Date.now() + SESSION_TIMEOUT_MS };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
    setSession(updated);
  }, [session]);

  return (
    <AuthContext.Provider value={{ session, login, logout, loginError, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
