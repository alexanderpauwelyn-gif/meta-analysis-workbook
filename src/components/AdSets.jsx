import { useAdSetData } from '../hooks/useInsights.js';
import DataTable from './DataTable.jsx';
import { TableSkeleton } from './SkeletonLoader.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorMessage from './ErrorMessage.jsx';

export default function AdSets({
  accessToken,
  accountId,
  dateRanges,
  campaignId,
  campaignName,
  onClearFilter,
  onDrillDown,
}) {
  const { data, loading, error } = useAdSetData(
    accessToken,
    accountId,
    campaignId,
    dateRanges.current
  );

  return (
    <div className="space-y-4">
      {/* Breadcrumb / active filter */}
      {campaignId && (
        <div className="flex items-center gap-2 text-sm">
          <button
            onClick={onClearFilter}
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            All campaigns
          </button>
          <svg className="w-3 h-3 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-zinc-300 font-medium truncate max-w-xs">{campaignName}</span>
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

      {loading && <TableSkeleton rows={8} cols={10} />}
      {!loading && error && <ErrorMessage message={error} />}
      {!loading && !error && (!data || data.length === 0) && (
        <EmptyState message={campaignId ? 'No ad sets in this campaign.' : 'No ad sets found.'} />
      )}
      {!loading && !error && data && data.length > 0 && (
        <DataTable
          rows={data}
          onRowClick={(row) => onDrillDown({ adsetId: row.id, adsetName: row.name })}
          actionLabel="View Ads"
        />
      )}
    </div>
  );
}
