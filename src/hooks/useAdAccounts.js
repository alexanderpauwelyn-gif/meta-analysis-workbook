import { useState, useEffect } from 'react';
import { fetchAdAccounts } from '../utils/metaApi.js';

export function useAdAccounts(accessToken) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchAdAccounts(accessToken)
      .then((data) => {
        if (!cancelled) {
          // Filter to active accounts (account_status === 1)
          const active = data.filter((a) => a.account_status !== 2);
          setAccounts(active);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [accessToken]);

  return { accounts, loading, error };
}
