/** Format a Date as YYYY-MM-DD */
function fmt(d) {
  return d.toISOString().split('T')[0];
}

/** Format a Date for display, e.g. "Apr 1" */
function fmtDisplay(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Returns the current and previous 7-day date ranges.
 *
 * Current:  yesterday − 6  →  yesterday   (7 days)
 * Previous: yesterday − 13 →  yesterday − 7  (7 days)
 */
export function getDateRanges() {
  const today = new Date();

  const sub = (d, days) => {
    const r = new Date(d);
    r.setDate(r.getDate() - days);
    return r;
  };

  const curEnd   = sub(today, 1);        // yesterday
  const curStart = sub(curEnd, 6);       // 7 days ending yesterday

  const prevEnd   = sub(curStart, 1);
  const prevStart = sub(prevEnd, 6);

  return {
    current: { since: fmt(curStart), until: fmt(curEnd) },
    previous: { since: fmt(prevStart), until: fmt(prevEnd) },
    label:     `${fmtDisplay(curStart)} – ${fmtDisplay(curEnd)}, ${curEnd.getFullYear()}`,
    prevLabel: `${fmtDisplay(prevStart)} – ${fmtDisplay(prevEnd)}`,
  };
}

/** Format a YYYY-MM-DD string as a short display label, e.g. "Apr 1" */
export function formatDateLabel(isoStr) {
  if (!isoStr) return '';
  const [year, month, day] = isoStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
