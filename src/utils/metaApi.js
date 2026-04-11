const BASE = 'https://graph.facebook.com/v18.0';

// ─── Error class ──────────────────────────────────────────────────────────────

export class MetaAPIError extends Error {
  constructor(message, code, type) {
    super(message);
    this.name = 'MetaAPIError';
    this.code = code;
    this.type = type;
  }
}

// ─── Low-level fetch helpers ──────────────────────────────────────────────────

async function apiFetch(url) {
  const res  = await fetch(url);
  const data = await res.json();
  if (data.error) {
    throw new MetaAPIError(data.error.message, data.error.code, data.error.type);
  }
  return data;
}

export async function fetchAPI(path, params, token) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('access_token', token);
  for (const [k, v] of Object.entries(params || {})) {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
    }
  }
  return apiFetch(url.toString());
}

export async function fetchAllPages(path, params, token) {
  const results = [];
  let data = await fetchAPI(path, params, token);
  if (Array.isArray(data.data)) results.push(...data.data);
  while (data.paging?.next) {
    data = await apiFetch(data.paging.next);
    if (Array.isArray(data.data)) results.push(...data.data);
    if (results.length > 10_000) break; // safety cap
  }
  return results;
}

// ─── Entity fetchers ──────────────────────────────────────────────────────────

export async function fetchAdAccounts(token) {
  return fetchAllPages(
    '/me/adaccounts',
    { fields: 'id,name,account_id,account_status,currency', limit: 100 },
    token
  );
}

export async function fetchCampaigns(token, accountId) {
  return fetchAllPages(
    `/${accountId}/campaigns`,
    { fields: 'id,name,effective_status,status,objective', limit: 500 },
    token
  );
}

export async function fetchAdSets(token, accountId, campaignId) {
  const path = campaignId
    ? `/${campaignId}/adsets`
    : `/${accountId}/adsets`;
  return fetchAllPages(
    path,
    { fields: 'id,name,effective_status,status,campaign_id', limit: 500 },
    token
  );
}

export async function fetchAds(token, accountId, adsetId) {
  const path = adsetId
    ? `/${adsetId}/ads`
    : `/${accountId}/ads`;
  return fetchAllPages(
    path,
    {
      fields: [
        'id,name,effective_status,status,adset_id,campaign_id',
        'creative{thumbnail_url,object_story_spec,effective_instagram_media_id}',
      ].join(','),
      limit: 300,
    },
    token
  );
}

// ─── Insights fetchers ────────────────────────────────────────────────────────

const INSIGHT_FIELDS =
  'spend,impressions,reach,frequency,clicks,ctr,cpc,cpm,actions,action_values,purchase_roas';

/**
 * Fetch insights for a given account + level + date range.
 * level: 'account' | 'campaign' | 'adset' | 'ad'
 * When level is not 'account', includes {level}_id and {level}_name in fields.
 */
export async function fetchInsights(token, accountId, timeRange, level) {
  const fields =
    level === 'account'
      ? INSIGHT_FIELDS
      : `${level}_id,${level}_name,${INSIGHT_FIELDS}`;

  const params = {
    fields,
    time_increment: 1,
    time_range: { since: timeRange.since, until: timeRange.until },
    limit: 500,
  };

  if (level !== 'account') {
    params.level = level;
  }

  return fetchAllPages(`/${accountId}/insights`, params, token);
}

// ─── Metric parsing helpers ───────────────────────────────────────────────────

function getAction(actions, type) {
  const a = (actions || []).find((x) => x.action_type === type);
  return a ? parseFloat(a.value) || 0 : 0;
}

function getActionValue(actionValues, type) {
  const a = (actionValues || []).find((x) => x.action_type === type);
  return a ? parseFloat(a.value) || 0 : 0;
}

function getRoas(purchaseRoas, type) {
  const r = (purchaseRoas || []).find((x) => x.action_type === type);
  return r ? parseFloat(r.value) || 0 : 0;
}

/** Parse a single insights API row into a normalized metrics object. */
export function parseMetrics(row) {
  if (!row) return null;

  const spend    = parseFloat(row.spend) || 0;
  const purchases = getAction(row.actions, 'omni_purchase');
  const revenue   = getActionValue(row.action_values, 'omni_purchase');
  const addToCart = getAction(row.actions, 'add_to_cart');
  const roas      = getRoas(row.purchase_roas, 'omni_purchase');
  const impressions = parseInt(row.impressions) || 0;
  const clicks    = parseInt(row.clicks) || 0;
  const reach     = parseInt(row.reach) || 0;

  return {
    spend,
    impressions,
    reach,
    frequency:  parseFloat(row.frequency) || 0,
    clicks,
    ctr:        parseFloat(row.ctr) || 0,
    cpc:        parseFloat(row.cpc) || 0,
    cpm:        parseFloat(row.cpm) || 0,
    purchases,
    revenue,
    addToCart,
    roas,
    cpa:        purchases > 0 ? spend / purchases : 0,
    date:       row.date_start,
  };
}

/**
 * Aggregate an array of daily insights rows into a single totals object.
 * Derived metrics (ctr, cpc, cpm, roas, cpa, frequency) are recomputed
 * from the raw totals to avoid double-counting.
 */
export function aggregateMetrics(rows) {
  const empty = {
    spend: 0, impressions: 0, reach: 0, frequency: 0,
    clicks: 0, ctr: 0, cpc: 0, cpm: 0,
    purchases: 0, revenue: 0, addToCart: 0, roas: 0, cpa: 0,
  };
  if (!rows || rows.length === 0) return empty;

  const parsed = rows.map(parseMetrics).filter(Boolean);

  const t = parsed.reduce(
    (acc, m) => ({
      spend:      acc.spend + m.spend,
      impressions: acc.impressions + m.impressions,
      reach:      acc.reach + m.reach,
      clicks:     acc.clicks + m.clicks,
      purchases:  acc.purchases + m.purchases,
      revenue:    acc.revenue + m.revenue,
      addToCart:  acc.addToCart + m.addToCart,
    }),
    { spend: 0, impressions: 0, reach: 0, clicks: 0, purchases: 0, revenue: 0, addToCart: 0 }
  );

  return {
    ...t,
    frequency:  t.impressions > 0 && t.reach > 0 ? t.impressions / t.reach : 0,
    ctr:        t.impressions > 0 ? (t.clicks / t.impressions) * 100 : 0,
    cpc:        t.clicks > 0 ? t.spend / t.clicks : 0,
    cpm:        t.impressions > 0 ? (t.spend / t.impressions) * 1000 : 0,
    roas:       t.spend > 0 ? t.revenue / t.spend : 0,
    cpa:        t.purchases > 0 ? t.spend / t.purchases : 0,
  };
}

/**
 * Join an array of insight rows with an array of entity objects.
 * Groups daily rows by idField, aggregates, then merges with entity metadata.
 */
export function mergeWithObjects(insightRows, objects, idField) {
  const byId = {};
  for (const row of insightRows) {
    const id = row[idField];
    if (!byId[id]) byId[id] = [];
    byId[id].push(row);
  }

  return objects
    .map((obj) => ({
      ...obj,
      metrics: aggregateMetrics(byId[obj.id] || []),
    }))
    .sort((a, b) => b.metrics.spend - a.metrics.spend);
}
