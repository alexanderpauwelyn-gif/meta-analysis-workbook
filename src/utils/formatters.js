export function fmtCurrency(value) {
  if (value == null || isNaN(value)) return '—';
  const n = Number(value);
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000)     return `$${(n / 1_000).toFixed(2)}K`;
  return `$${n.toFixed(2)}`;
}

export function fmtCurrencyFull(value) {
  if (value == null || isNaN(value)) return '—';
  return `$${Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function fmtNumber(value) {
  if (value == null || isNaN(value)) return '—';
  const n = Number(value);
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString('en-US');
}

export function fmtPercent(value, decimals = 2) {
  if (value == null || isNaN(value)) return '—';
  return `${Number(value).toFixed(decimals)}%`;
}

export function fmtMultiplier(value, decimals = 2) {
  if (value == null || isNaN(value)) return '—';
  return `${Number(value).toFixed(decimals)}x`;
}

export function fmtFixed2(value) {
  if (value == null || isNaN(value)) return '—';
  return Number(value).toFixed(2);
}

/** Format any metric by its key */
export function fmtMetric(key, value) {
  switch (key) {
    case 'spend':
    case 'revenue':
    case 'cpc':
    case 'cpm':
    case 'cpa':
      return fmtCurrency(value);
    case 'roas':
      return fmtMultiplier(value);
    case 'ctr':
      return fmtPercent(value);
    case 'frequency':
      return fmtFixed2(value);
    default:
      return fmtNumber(value);
  }
}

/** Compute % change between current and previous. Returns null if previous is 0. */
export function calcChange(current, previous) {
  if (previous == null || previous === 0) return null;
  return ((current - previous) / Math.abs(previous)) * 100;
}
