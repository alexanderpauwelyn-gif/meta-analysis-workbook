import { useState } from 'react';
import { fmtCurrency, fmtMultiplier, fmtNumber, fmtPercent } from '../utils/formatters.js';
import { statusStyle } from '../utils/metrics.js';

const PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="%2318181b" width="400" height="300"/><text fill="%2352525b" font-family="sans-serif" font-size="14" x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle">No preview</text></svg>';

function MetricPair({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-zinc-200">{value}</p>
    </div>
  );
}

function AdModal({ ad, onClose }) {
  const m   = ad.metrics || {};
  const img = ad.creative?.thumbnail_url;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative">
          <img
            src={img || PLACEHOLDER}
            alt={ad.name}
            className="w-full h-52 object-cover rounded-t-2xl"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center
              bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors"
          >
            ×
          </button>
          <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-0.5 rounded-full ${statusStyle(ad.effective_status)}`}>
            {ad.effective_status?.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Details */}
        <div className="p-5">
          <h3 className="font-semibold text-white text-base mb-1 leading-snug">{ad.name}</h3>
          <p className="text-xs text-zinc-500 mb-5">ID: {ad.id}</p>

          <div className="grid grid-cols-3 gap-4">
            <MetricPair label="Spend"     value={fmtCurrency(m.spend)} />
            <MetricPair label="Revenue"   value={fmtCurrency(m.revenue)} />
            <MetricPair label="ROAS"      value={fmtMultiplier(m.roas)} />
            <MetricPair label="Purchases" value={fmtNumber(m.purchases)} />
            <MetricPair label="CPA"       value={fmtCurrency(m.cpa)} />
            <MetricPair label="Add to Cart" value={fmtNumber(m.addToCart)} />
            <MetricPair label="CTR"       value={fmtPercent(m.ctr)} />
            <MetricPair label="CPC"       value={fmtCurrency(m.cpc)} />
            <MetricPair label="CPM"       value={fmtCurrency(m.cpm)} />
            <MetricPair label="Impressions" value={fmtNumber(m.impressions)} />
            <MetricPair label="Reach"     value={fmtNumber(m.reach)} />
            <MetricPair label="Clicks"    value={fmtNumber(m.clicks)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdCard({ ad }) {
  const [expanded, setExpanded] = useState(false);
  const m   = ad.metrics || {};
  const img = ad.creative?.thumbnail_url;

  return (
    <>
      <div
        className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer
          hover:border-zinc-600 transition-colors group"
        onClick={() => setExpanded(true)}
      >
        {/* Thumbnail */}
        <div className="relative overflow-hidden">
          <img
            src={img || PLACEHOLDER}
            alt={ad.name}
            className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform duration-200"
            onError={(e) => { e.currentTarget.src = PLACEHOLDER; }}
          />
          <span className={`absolute top-2 left-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full ${statusStyle(ad.effective_status)}`}>
            {ad.effective_status?.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="font-medium text-zinc-200 text-sm leading-snug line-clamp-2 mb-3" title={ad.name}>
            {ad.name}
          </p>

          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            <MetricPair label="Spend"     value={fmtCurrency(m.spend)} />
            <MetricPair label="ROAS"      value={fmtMultiplier(m.roas)} />
            <MetricPair label="Purchases" value={fmtNumber(m.purchases)} />
            <MetricPair label="CTR"       value={fmtPercent(m.ctr)} />
          </div>
        </div>
      </div>

      {expanded && <AdModal ad={ad} onClose={() => setExpanded(false)} />}
    </>
  );
}
