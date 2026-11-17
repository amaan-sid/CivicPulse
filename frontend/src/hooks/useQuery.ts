import { useCallback, useEffect, useRef, useState } from "react";

type State<T> = { key: string | null; data?: T; error?: Error };

/**
 * Small data-fetching hook. Refetches whenever `key` changes, cancels stale
 * requests, and keeps the previous data visible while new data loads.
 */
export function useQuery<T>(key: string, fetcher: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<State<T>>({ key: null });
  const [version, setVersion] = useState(0);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  const requestKey = `${key}#${version}`;

  useEffect(() => {
    const controller = new AbortController();
    fetcherRef.current(controller.signal).then(
      (data) => setState({ key: requestKey, data }),
      (error: Error) => {
        if (!controller.signal.aborted) setState((prev) => ({ key: requestKey, data: prev.data, error }));
      },
    );
    return () => controller.abort();
  }, [requestKey]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback((data: T) => setState((prev) => ({ ...prev, data, error: undefined })), []);

  const loading = state.key !== requestKey;

  return {
    data: state.data,
    error: loading ? undefined : state.error,
    loading,
    reload,
    setData,
  };
}
