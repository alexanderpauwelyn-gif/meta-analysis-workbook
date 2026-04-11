import { useCampaignData } from '../hooks/useInsights.js';
import DataTable from './DataTable.jsx';
import { TableSkeleton } from './SkeletonLoader.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorMessage from './ErrorMessage.jsx';

export default function Campaigns({ accessToken, accountId, dateRanges, onDrillDown }) {
  const { data, loading, error } = useCampaignData(
    accessToken,
    accountId,
    dateRanges.current
  );

  if (loading) return <TableSkeleton rows={8} cols={10} />;
  if (error)   return <ErrorMessage message={error} />;
  if (!data || data.length === 0) return <EmptyState message="No campaigns found for this account." />;

  return (
    <DataTable
      rows={data}
      onRowClick={(row) => onDrillDown({ campaignId: row.id, campaignName: row.name })}
      actionLabel="View Ad Sets"
    />
  );
}
