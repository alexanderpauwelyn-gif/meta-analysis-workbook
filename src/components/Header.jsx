import { useAuth } from '../contexts/AuthContext.jsx';

export default function Header({
  accounts,
  accountsLoading,
  selectedAccount,
  onSelectAccount,
  dateRanges,
  showComparison,
  onToggleComparison,
}) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0 mr-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.971h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
          </div>
          <span className="font-semibold text-sm text-white hidden sm:block">Ads Dashboard</span>
        </div>

        {/* Account selector */}
        <div className="flex-1 min-w-0 max-w-xs">
          {accountsLoading ? (
            <div className="h-8 bg-zinc-800 rounded-lg animate-pulse w-48" />
          ) : (
            <select
              value={selectedAccount?.id || ''}
              onChange={(e) => {
                const acc = accounts.find((a) => a.id === e.target.value);
                if (acc) onSelectAccount(acc);
              }}
              className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm
                rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500
                focus:border-blue-500 truncate"
            >
              {accounts.length === 0 && (
                <option value="">No ad accounts found</option>
              )}
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Date range label */}
        {dateRanges && (
          <div className="hidden md:flex items-center gap-1.5 shrink-0">
            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
            </svg>
            <span className="text-xs text-zinc-400">{dateRanges.label}</span>
          </div>
        )}

        {/* Comparison toggle */}
        <button
          onClick={onToggleComparison}
          className={`hidden sm:flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg
            border transition-colors shrink-0 ${
            showComparison
              ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
              : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-300'
          }`}
        >
          <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
            showComparison ? 'border-blue-400 bg-blue-400' : 'border-zinc-500'
          }`} />
          vs prev 7d
        </button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User menu */}
        {user && (
          <div className="flex items-center gap-3 shrink-0">
            {user.picture?.data?.url && (
              <img
                src={user.picture.data.url}
                alt={user.name}
                className="w-7 h-7 rounded-full border border-zinc-700"
              />
            )}
            <span className="text-xs text-zinc-400 hidden lg:block truncate max-w-[120px]">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
