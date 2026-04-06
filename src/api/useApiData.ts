import { useState, useEffect, useRef, useCallback } from 'react';

export function useApiData<T>(
  fetcher: () => Promise<T>,
  fallback: T,
  options?: { transform?: (raw: any) => T; enabled?: boolean }
): { data: T; loading: boolean; error: Error | null; refetch: () => void } {
  const [state, setState] = useState<{ data: T; loading: boolean; error: Error | null }>({
    data: fallback,
    loading: false,
    error: null,
  });
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  const transformRef = useRef(options?.transform);
  fetcherRef.current = fetcher;
  transformRef.current = options?.transform;

  const enabled = options?.enabled ?? true;
  const enabledRef = useRef(enabled);
  enabledRef.current = enabled;

  const doFetch = useCallback(async () => {
    if (!enabledRef.current) return;
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const raw = await fetcherRef.current();
      if (!mountedRef.current) return;
      const result = transformRef.current ? transformRef.current(raw) : raw;
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      if (!mountedRef.current) return;
      setState(prev => ({ ...prev, loading: false, error: err as Error }));
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) doFetch();
    return () => { mountedRef.current = false; };
  }, [enabled, doFetch]);

  return { data: state.data, loading: state.loading, error: state.error, refetch: doFetch };
}
