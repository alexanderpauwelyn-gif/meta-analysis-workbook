/**
 * Central definition of all displayable metrics.
 * invertChange: true means a lower value is better (e.g. CPA, CPC, CPM)
 * so a negative % change should be coloured green.
 */
export const METRIC_DEFS = {
  spend:      { label: 'Spend',        format: 'currency',    invertChange: false },
  revenue:    { label: 'Revenue',      format: 'currency',    invertChange: false },
  roas:       { label: 'ROAS',         format: 'multiplier',  invertChange: false },
  purchases:  { label: 'Purchases',    format: 'number',      invertChange: false },
  cpa:        { label: 'CPA',          format: 'currency',    invertChange: true  },
  ctr:        { label: 'CTR',          format: 'percent',     invertChange: false },
  cpc:        { label: 'CPC',          format: 'currency',    invertChange: true  },
  cpm:        { label: 'CPM',          format: 'currency',    invertChange: true  },
  impressions:{ label: 'Impressions',  format: 'number',      invertChange: false },
  reach:      { label: 'Reach',        format: 'number',      invertChange: false },
  frequency:  { label: 'Frequency',    format: 'fixed2',      invertChange: true  },
  addToCart:  { label: 'Add to Carts', format: 'number',      invertChange: false },
  clicks:     { label: 'Clicks',       format: 'number',      invertChange: false },
};

/** Ordered list of KPIs to show on the Overview tab */
export const KPI_KEYS = [
  'spend', 'revenue', 'roas', 'purchases', 'cpa', 'ctr',
  'cpc', 'cpm', 'impressions', 'reach', 'frequency', 'addToCart',
];

/** Column definitions for the campaign/adset/ad sortable tables */
export const TABLE_COLUMNS = [
  { key: 'name',             label: 'Name',         type: 'text',       sortable: true },
  { key: 'effective_status', label: 'Status',        type: 'status',     sortable: true },
  { key: 'spend',            label: 'Spend',         type: 'currency',   sortable: true },
  { key: 'revenue',          label: 'Revenue',       type: 'currency',   sortable: true },
  { key: 'roas',             label: 'ROAS',          type: 'multiplier', sortable: true },
  { key: 'purchases',        label: 'Purchases',     type: 'number',     sortable: true },
  { key: 'cpa',              label: 'CPA',           type: 'currency',   sortable: true },
  { key: 'addToCart',        label: 'Add to Carts',  type: 'number',     sortable: true },
  { key: 'ctr',              label: 'CTR',           type: 'percent',    sortable: true },
  { key: 'cpc',              label: 'CPC',           type: 'currency',   sortable: true },
  { key: 'cpm',              label: 'CPM',           type: 'currency',   sortable: true },
  { key: 'impressions',      label: 'Impressions',   type: 'number',     sortable: true },
  { key: 'reach',            label: 'Reach',         type: 'number',     sortable: true },
  { key: 'frequency',        label: 'Frequency',     type: 'fixed2',     sortable: true },
];

export const STATUS_STYLES = {
  ACTIVE:      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  PAUSED:      'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30',
  ARCHIVED:    'bg-zinc-800/50 text-zinc-500 border border-zinc-700/30',
  DELETED:     'bg-red-500/15 text-red-400 border border-red-500/20',
  IN_PROCESS:  'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  WITH_ISSUES: 'bg-red-500/15 text-red-400 border border-red-500/20',
};

export function statusStyle(s) {
  return STATUS_STYLES[s] || 'bg-zinc-700/50 text-zinc-400 border border-zinc-600/30';
}
