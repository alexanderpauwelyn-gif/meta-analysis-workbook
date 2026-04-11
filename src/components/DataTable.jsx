import { useState, useMemo } from 'react';
import { TABLE_COLUMNS, statusStyle } from '../utils/metrics.js';
import { fmtMetric } from '../utils/formatters.js';

const METRIC_KEYS = new Set([
  'spend','revenue','roas','purchases','cpa','addToCart','ctr','cpc','cpm','impressions','reach','frequency',
]);

function SortIcon({ dir }) {
  if (!dir) {
    return (
      <svg className="w-3 h-3 text-zinc-600" viewBox="0 0 12 12" fill="currentColor">
        <path d="M6 2l3 4H3l3-4zm0 8L3 6h6l-3 4z" />
      </svg>
    );
  }
  return dir === 'asc' ? (
    <svg className="w-3 h-3 text-blue-400" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 2l4 5H2l4-5z" />
    </svg>
  ) : (
    <svg className="w-3 h-3 text-blue-400" viewBox="0 0 12 12" fill="currentColor">
      <path d="M6 10L2 5h8l-4 5z" />
    </svg>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle(status)}`}>
      {status ? status.replace(/_/g, ' ') : '—'}
    </span>
  );
}

function CellValue({ col, row }) {
  const key = col.key;
  if (key === 'name') {
    return <span className="font-medium text-zinc-200 truncate max-w-[200px] block" title={row.name}>{row.name}</span>;
  }
  if (key === 'effective_status') {
    return <StatusBadge status={row.effective_status} />;
  }
  // Metrics live on row.metrics
  const val = row.metrics?.[key];
  return <span className="text-zinc-300 tabular-nums">{fmtMetric(key, val)}</span>;
}

export default function DataTable({ rows, onRowClick, actionLabel = 'Drill down' }) {
  const [sortKey, setSortKey]       = useState('spend');
  const [sortDir, setSortDir]       = useState('desc');
  const [filter, setFilter]         = useState('');

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = filter.toLowerCase();
    return q ? rows.filter((r) => (r.name || '').toLowerCase().includes(q)) : rows;
  }, [rows, filter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let av, bv;
      if (sortKey === 'name') {
        av = (a.name || '').toLowerCase();
        bv = (b.name || '').toLowerCase();
      } else if (sortKey === 'effective_status') {
        av = a.effective_status || '';
        bv = b.effective_status || '';
      } else {
        av = a.metrics?.[sortKey] ?? 0;
        bv = b.metrics?.[sortKey] ?? 0;
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir]);

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name…"
            className="w-full bg-zinc-800 border border-zinc-700 text-zinc-200 text-sm
              rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500
              focus:border-blue-500 placeholder-zinc-600"
          />
        </div>
        <span className="text-xs text-zinc-500 ml-auto">
          {sorted.length} {sorted.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-zinc-800">
                {TABLE_COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`text-left px-4 py-3 font-medium text-zinc-500 whitespace-nowrap
                      ${col.sortable ? 'cursor-pointer select-none hover:text-zinc-300' : ''}
                      ${col.key === 'name' ? 'sticky left-0 bg-zinc-900 z-10' : ''}
                    `}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {col.label}
                      {col.sortable && (
                        <SortIcon dir={sortKey === col.key ? sortDir : null} />
                      )}
                    </span>
                  </th>
                ))}
                {onRowClick && <th className="px-4 py-3" />}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_COLUMNS.length + 1} className="text-center py-16 text-zinc-500 text-sm">
                    No results found.
                  </td>
                </tr>
              ) : (
                sorted.map((row) => (
                  <tr
                    key={row.id}
                    className={`border-b border-zinc-800/50 transition-colors
                      ${onRowClick ? 'cursor-pointer hover:bg-zinc-800/60' : 'hover:bg-zinc-800/30'}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {TABLE_COLUMNS.map((col) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 whitespace-nowrap
                          ${col.key === 'name' ? 'sticky left-0 bg-zinc-900 group-hover:bg-zinc-800/60 z-10' : ''}
                        `}
                      >
                        <CellValue col={col} row={row} />
                      </td>
                    ))}
                    {onRowClick && (
                      <td className="px-4 py-3">
                        <span className="text-xs text-zinc-600 hover:text-zinc-400">
                          →
                        </span>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
