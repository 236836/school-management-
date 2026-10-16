// frontend/src/hooks/useFetch.js
import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export const useFetch = (url) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) return;
    try {
      setLoading(true);
      setError(null);
      const { data: res } = await api.get(url);
      setData(res);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};