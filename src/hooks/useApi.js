import { useState, useEffect } from 'react';

/**
 * Custom hook for API calls with loading, error, and data state management
 * @param {Function} apiCall - The API function to call
 * @param {Array} dependencies - Dependencies array for useEffect
 * @param {boolean} enabled - Whether to execute the API call (default: true)
 * @returns {Object} - Object containing data, loading, error state and refetch function
 */
export function useApi(apiCall, dependencies = [], enabled = true) {
  const [state, setState] = useState({
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
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      console.error('API call failed:', errorMessage);
      setState({ 
        data: null, 
        loading: false, 
        error: errorMessage
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

/**
 * Custom hook for handling async actions with loading and error states
 * @returns {Object} - Object with execute function, loading, and error state
 */
export function useAsyncAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (action) => {
    setLoading(true);
    setError(null);

    try {
      const result = await action();
      setLoading(false);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      throw err; // Re-throw to let caller handle it
    }
  };

  return { execute, loading, error };
}