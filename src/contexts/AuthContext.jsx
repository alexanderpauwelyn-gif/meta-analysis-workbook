import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

const API_VERSION = 'v18.0';

async function validateToken(token) {
  const res  = await fetch(
    `https://graph.facebook.com/${API_VERSION}/me` +
    `?fields=name,picture.width(40).height(40)&access_token=${encodeURIComponent(token)}`
  );
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading]         = useState(true);

  // On mount, restore and validate any previously stored token
  useEffect(() => {
    const stored = sessionStorage.getItem('fb_access_token');
    if (!stored) {
      setLoading(false);
      return;
    }
    validateToken(stored)
      .then((userInfo) => {
        setAccessToken(stored);
        setUser(userInfo);
      })
      .catch(() => {
        sessionStorage.removeItem('fb_access_token');
      })
      .finally(() => setLoading(false));
  }, []);

  const loginWithToken = useCallback(async (token) => {
    const trimmed  = token.trim();
    const userInfo = await validateToken(trimmed); // throws on invalid token
    sessionStorage.setItem('fb_access_token', trimmed);
    setAccessToken(trimmed);
    setUser(userInfo);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('fb_access_token');
    setAccessToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
