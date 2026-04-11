import { fmtMetric, calcChange } from '../utils/formatters.js';
import { METRIC_DEFS } from '../utils/metrics.js';

function ChangeIndicator({ current, previous, invertChange }) {
  const pct = calcChange(current, previous);
  if (pct === null) return null;

  const isPositive = invertChange ? pct <= 0 : pct >= 0;
  const absVal     = Math.abs(pct).toFixed(1);

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        isPositive ? 'text-emerald-400' : 'text-red-400'
      }`}
    >
      {isPositive ? (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 2l4 5H2l4-5z" />
        </svg>
      ) : (
        <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
          <path d="M6 10L2 5h8l-4 5z" />
        </svg>
      )}
      {absVal}%
    </span>
  );
}

export default function KPICard({ metricKey, currentValue, previousValue, showComparison }) {
  const def    = METRIC_DEFS[metricKey];
  if (!def) return null;

  const formatted = fmtMetric(metricKey, currentValue);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 hover:border-zinc-700 transition-colors">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
        {def.label}
      </p>
      <p className="text-2xl font-bold text-white leading-none mb-2 truncate" title={formatted}>
        {formatted}
      </p>
      {showComparison && previousValue != null && (
        <div className="flex items-center gap-2">
          <ChangeIndicator
            current={currentValue}
            previous={previousValue}
            invertChange={def.invertChange}
          />
          <span className="text-xs text-zinc-600">vs prev 7d</span>
        </div>
      )}
    </div>
  );
}
