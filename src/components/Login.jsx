import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login, sdkError } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      await login();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / brand */}
        <div className="flex items-center justify-center mb-10 gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white leading-none">Meta Ads</h1>
            <p className="text-xs text-zinc-400 mt-0.5">Performance Dashboard</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            Sign in to continue
          </h2>
          <p className="text-zinc-400 text-sm text-center mb-8">
            Connect your Meta account to view ad performance across all your ad accounts.
          </p>

          {/* SDK error (misconfiguration) */}
          {sdkError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm font-medium">Configuration error</p>
              <p className="text-red-400/80 text-xs mt-1">{sdkError}</p>
            </div>
          )}

          {/* Runtime login error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !!sdkError}
            className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500
              disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold
              py-3 px-6 rounded-xl transition-colors duration-150"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white shrink-0">
                <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
            )}
            {loading ? 'Connecting…' : 'Continue with Facebook'}
          </button>

          <p className="mt-6 text-xs text-zinc-500 text-center">
            Requires <span className="text-zinc-400">ads_read</span> and{' '}
            <span className="text-zinc-400">business_management</span> permissions.
            Read-only access — no changes will be made to your account.
          </p>
        </div>
      </div>
    </div>
  );
}
