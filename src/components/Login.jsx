import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { loginWithToken } = useAuth();
  const [token, setToken]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!token.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await loginWithToken(token);
    } catch (err) {
      setError(err.message || 'Invalid access token. Please check and try again.');
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
            Paste your access token
          </h2>
          <p className="text-zinc-400 text-sm text-center mb-8">
            Generate a token with <span className="text-zinc-300">ads_read</span> and{' '}
            <span className="text-zinc-300">business_management</span> permissions, then paste it below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <textarea
                value={token}
                onChange={(e) => { setToken(e.target.value); setError(null); }}
                placeholder="EAABwzLixnjYBO…"
                rows={4}
                autoFocus
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm
                  rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-1
                  focus:ring-blue-500 focus:border-blue-500 placeholder-zinc-600
                  font-mono leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token.trim()}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500
                disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold
                py-3 px-6 rounded-xl transition-colors duration-150"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              )}
              {loading ? 'Verifying…' : 'Connect'}
            </button>
          </form>

          <p className="mt-6 text-xs text-zinc-600 text-center">
            Get a token from the{' '}
            <span className="text-zinc-400">Meta Graph API Explorer</span>{' '}
            or your app's token tools. Read-only — no changes will be made to your account.
          </p>
        </div>
      </div>
    </div>
  );
}
