import { useState, useEffect } from 'react';
import {
  fetchInsights,
  fetchCampaigns,
  fetchAdSets,
  fetchAds,
  aggregateMetrics,
  mergeWithObjects,
  parseMetrics,
} from '../utils/metaApi.js';

// ─── Account-level (Overview tab) ────────────────────────────────────────────

/**
 * Fetches daily account-level insights for both the current and previous periods.
 * Returns aggregated KPI totals and the sorted daily rows for charts.
 */
export function useAccountInsights(accessToken, accountId, dateRanges) {
  const [state, setState] = useState({
    currentRows:   null,
    previousRows:  null,
    currentAgg:    null,
    previousAgg:   null,
    loading:       false,
    error:         null,
  });

  const curSince  = dateRanges?.current?.since;
  const prevSince = dateRanges?.previous?.since;

  useEffect(() => {
    if (!accessToken || !accountId || !curSince) return;

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    Promise.all([
      fetchInsights(accessToken, accountId, dateRanges.current, 'account'),
      fetchInsights(accessToken, accountId, dateRanges.previous, 'account'),
    ])
      .then(([curRows, prevRows]) => {
        if (cancelled) return;
        const sorted = [...curRows].sort((a, b) =>
          (a.date_start || '').localeCompare(b.date_start || '')
        );
        setState({
          currentRows:  sorted,
          previousRows: prevRows,
          currentAgg:   aggregateMetrics(curRows),
          previousAgg:  aggregateMetrics(prevRows),
          loading:      false,
          error:        null,
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: err.message }));
        }
      });

    return () => { cancelled = true; };
  }, [accessToken, accountId, curSince, prevSince]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

// ─── Campaign-level ───────────────────────────────────────────────────────────

export function useCampaignData(accessToken, accountId, dateRange) {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  useEffect(() => {
    if (!accessToken || !accountId || !dateRange?.since) return;

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    Promise.all([
      fetchCampaigns(accessToken, accountId),
      fetchInsights(accessToken, accountId, dateRange, 'campaign'),
    ])
      .then(([campaigns, rows]) => {
        if (!cancelled) {
          setState({
            data:    mergeWithObjects(rows, campaigns, 'campaign_id'),
            loading: false,
            error:   null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, [accessToken, accountId, dateRange?.since]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

// ─── Ad Set-level ─────────────────────────────────────────────────────────────

export function useAdSetData(accessToken, accountId, campaignId, dateRange) {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  useEffect(() => {
    if (!accessToken || !accountId || !dateRange?.since) return;

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    Promise.all([
      fetchAdSets(accessToken, accountId, campaignId),
      fetchInsights(accessToken, accountId, dateRange, 'adset'),
    ])
      .then(([adsets, rows]) => {
        if (!cancelled) {
          // When a campaign filter is active, filter insight rows too
          const filtered = campaignId
            ? rows.filter((r) => r.campaign_id === campaignId)
            : rows;
          setState({
            data:    mergeWithObjects(filtered, adsets, 'adset_id'),
            loading: false,
            error:   null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, [accessToken, accountId, campaignId, dateRange?.since]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

// ─── Ad-level ─────────────────────────────────────────────────────────────────

export function useAdData(accessToken, accountId, adsetId, dateRange) {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  useEffect(() => {
    if (!accessToken || !accountId || !dateRange?.since) return;

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    Promise.all([
      fetchAds(accessToken, accountId, adsetId),
      fetchInsights(accessToken, accountId, dateRange, 'ad'),
    ])
      .then(([ads, rows]) => {
        if (!cancelled) {
          const filtered = adsetId
            ? rows.filter((r) => r.adset_id === adsetId)
            : rows;
          setState({
            data:    mergeWithObjects(filtered, ads, 'ad_id'),
            loading: false,
            error:   null,
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: err.message }));
      });

    return () => { cancelled = true; };
  }, [accessToken, accountId, adsetId, dateRange?.since]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

// ─── Daily rows → chart-ready series ─────────────────────────────────────────

/** Convert sorted daily insight rows into { labels, spendSeries, roasSeries } */
export function toDailySeries(rows) {
  if (!rows || rows.length === 0) return { labels: [], spendSeries: [], roasSeries: [], purchasesSeries: [] };

  const parsed = rows.map(parseMetrics).filter(Boolean);

  return {
    labels:          parsed.map((r) => r.date),
    spendSeries:     parsed.map((r) => r.spend),
    roasSeries:      parsed.map((r) => r.roas),
    purchasesSeries: parsed.map((r) => r.purchases),
  };
}
