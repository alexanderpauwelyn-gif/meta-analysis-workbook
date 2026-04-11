import { useState, useMemo } from 'react';
import { useAdData } from '../hooks/useInsights.js';
import AdCard from './AdCard.jsx';
import { AdCardSkeletons } from './SkeletonLoader.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import { METRIC_DEFS } from '../utils/metrics.js';

const SORT_OPTIONS = [
  { value: 'spend',     label: 'Spend' },
  { value: 'roas',      label: 'ROAS' },
  { value: 'purchases', label: 'Purchases' },
  { value: 'ctr',       label: 'CTR' },
  { value: 'cpc',       label: 'CPC' },
  { value: 'revenue',   label: 'Revenue' },
];

export default function AdsGrid({
  accessToken,
  accountId,
  dateRanges,
  adsetId,
  adsetName,
  onClearFilter,
}) {
  const { data, loading, error } = useAdData(
    accessToken,
    accountId,
    adsetId,
    dateRanges.current
  );

  const [sortBy, setSortBy]   = useState('spend');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => {
      const av = a.metrics?.[sortBy] ?? 0;
      const bv = b.metrics?.[sortBy] ?? 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    });
  }, [data, sortBy, sortDir]);

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      {adsetId && (
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={onClearFilter}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            All ad sets
          </button>
          <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-zinc-300 font-medium truncate max-w-xs">{adsetName}</span>
          <button
            onClick={onClearFilter}
            className="ml-auto text-xs text-zinc-600 hover:text-zinc-400 flex items-center gap-1 transition-colors"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear filter
          </button>
        </div>
      )}

      {/* Sort controls */}
      {!loading && !error && data && data.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">Sort by</span>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  if (sortBy === opt.value) {
                    setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
                  } else {
                    setSortBy(opt.value);
                    setSortDir('desc');
                  }
                }}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                  sortBy === opt.value
                    ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-zinc-300'
                }`}
              >
                {opt.label}
                {sortBy === opt.value && (
                  <span className="ml-1">{sortDir === 'desc' ? '↓' : '↑'}</span>
                )}
              </button>
            ))}
          </div>
          <span className="text-xs text-zinc-600 ml-auto">
            {sorted.length} {sorted.length === 1 ? 'ad' : 'ads'}
          </span>
        </div>
      )}

      {loading && <AdCardSkeletons count={8} />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && sorted.length === 0 && (
        <EmptyState message={adsetId ? 'No ads in this ad set.' : 'No ads found.'} />
      )}
      {!loading && !error && sorted.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {sorted.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
          ))}
        </div>
      )}
    </div>
  );
}
