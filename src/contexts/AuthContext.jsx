import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';

const AuthContext = createContext(null);

const FB_APP_ID = import.meta.env.VITE_FB_APP_ID;
const API_VERSION = 'v18.0';

export function AuthProvider({ children }) {
  const [user, setUser]               = useState(null);
  const [accessToken, setAccessToken] = useState(
    () => sessionStorage.getItem('fb_access_token')
  );
  const [loading, setLoading]         = useState(true);
  const [sdkError, setSdkError]       = useState(null);

  const fetchUserInfo = useCallback(async (token) => {
    try {
      const res  = await fetch(
        `https://graph.facebook.com/${API_VERSION}/me` +
        `?fields=name,picture.width(40).height(40)&access_token=${encodeURIComponent(token)}`
      );
      const data = await res.json();
      if (!data.error) {
        setUser(data);
      } else {
        // Token is invalid – clear it
        sessionStorage.removeItem('fb_access_token');
        setAccessToken(null);
      }
    } catch (_) {
      // Network error – keep the token and let the user retry
    }
  }, []);

  useEffect(() => {
    if (!FB_APP_ID) {
      setSdkError('VITE_FB_APP_ID is not set. Create a .env.local file (see .env.example).');
      setLoading(false);
      return;
    }

    const storedToken = sessionStorage.getItem('fb_access_token');

    // fbAsyncInit must be defined before the SDK script tag loads
    window.fbAsyncInit = function () {
      window.FB.init({
        appId:   FB_APP_ID,
        cookie:  true,
        xfbml:   false,
        version: API_VERSION,
      });

      window.FB.getLoginStatus(function (response) {
        if (response.status === 'connected') {
          const token = response.authResponse.accessToken;
          sessionStorage.setItem('fb_access_token', token);
          setAccessToken(token);
          fetchUserInfo(token);
        } else if (storedToken) {
          // Session may have expired; validate the stored token
          fetchUserInfo(storedToken);
        }
        setLoading(false);
      });
    };

    if (!document.getElementById('facebook-jssdk')) {
      const script    = document.createElement('script');
      script.id       = 'facebook-jssdk';
      script.src      = 'https://connect.facebook.net/en_US/sdk.js';
      script.async    = true;
      script.defer    = true;
      script.onerror  = () => {
        setSdkError('Failed to load the Facebook SDK. Check your network connection.');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else if (window.FB) {
      // SDK already present (e.g., hot-reload)
      window.fbAsyncInit();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async () => {
    return new Promise((resolve, reject) => {
      window.FB.login(
        (response) => {
          if (response.authResponse) {
            const token = response.authResponse.accessToken;
            sessionStorage.setItem('fb_access_token', token);
            setAccessToken(token);
            fetchUserInfo(token);
            resolve(token);
          } else {
            reject(new Error('Login was cancelled or not authorized.'));
          }
        },
        { scope: 'ads_read,business_management' }
      );
    });
  }, [fetchUserInfo]);

  const logout = useCallback(() => {
    sessionStorage.removeItem('fb_access_token');
    setAccessToken(null);
    setUser(null);
    if (window.FB) {
      window.FB.logout(() => {});
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, loading, sdkError, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
