import { useState, useEffect } from 'react';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for API calls with loading, error, and data state management
 * @param apiCall - The API function to call
 * @param dependencies - Dependencies array for useEffect
 * @param enabled - Whether to execute the API call (default: true)
 * @returns Object containing data, loading, error state and refetch function
 */
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  enabled: boolean = true
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: enabled,
    error: null,
  });

  const fetchData = async () => {
    if (!enabled || !apiCall) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      console.error('API call failed:', errorMessage);
      setState({
        data: null,
        loading: false,
        error: errorMessage,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [...dependencies, enabled]);

  return {
    ...state,
    refetch: fetchData,
  };
}

// Small helper hook used across components for running async actions with loading/error state
export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (action: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await action();
      setLoading(false);
      return result ?? true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      setLoading(false);
      return false;
    }
  };

  return { execute, loading, error } as const;
}
