import { useAccountInsights, toDailySeries } from '../hooks/useInsights.js';
import { KPI_KEYS } from '../utils/metrics.js';
import KPICard from './KPICard.jsx';
import SpendROASChart from './SpendROASChart.jsx';
import PurchasesChart from './PurchasesChart.jsx';
import { KPISkeletons, ChartSkeleton } from './SkeletonLoader.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorMessage from './ErrorMessage.jsx';

export default function Overview({ accessToken, accountId, dateRanges, showComparison }) {
  const { currentAgg, previousAgg, currentRows, loading, error } =
    useAccountInsights(accessToken, accountId, dateRanges);

  if (loading) {
    return (
      <div className="space-y-6">
        <KPISkeletons count={12} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartSkeleton height="h-72" />
          <ChartSkeleton height="h-72" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentAgg || currentAgg.spend === 0 && currentAgg.impressions === 0) {
    return <EmptyState message="No data found for this account in the selected date range." />;
  }

  const { labels, spendSeries, roasSeries, purchasesSeries } = toDailySeries(currentRows);

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {KPI_KEYS.map((key) => (
          <KPICard
            key={key}
            metricKey={key}
            currentValue={currentAgg[key]}
            previousValue={previousAgg?.[key]}
            showComparison={showComparison}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SpendROASChart
          labels={labels}
          spendSeries={spendSeries}
          roasSeries={roasSeries}
        />
        <PurchasesChart
          labels={labels}
          purchasesSeries={purchasesSeries}
        />
      </div>
    </div>
  );
}
