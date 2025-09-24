// @/hooks/useApiErrorHandler.ts
import { ApiError } from '@/services/api/api.service';
import { useState, useCallback } from 'react';

interface UseApiErrorHandlerReturn {
  error: string | null;
  isLoading: boolean;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  handleAsyncOperation: <T>(
    operation: () => Promise<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: string) => void
  ) => Promise<T | null>;
  clearError: () => void;
}

/**
 * Custom hook for handling API errors and loading states
 */
export const useApiErrorHandler = (): UseApiErrorHandlerReturn => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleAsyncOperation = useCallback(
    async <T>(
      operation: () => Promise<T>,
      onSuccess?: (data: T) => void,
      onError?: (error: string) => void
    ): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        const result = await operation();

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        let errorMessage = 'An unexpected error occurred';

        if (err instanceof ApiError) {
          switch (err.status) {
            case 400:
              errorMessage = 'Invalid request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please log in again.';
              break;
            case 403:
              errorMessage = 'Access denied. You do not have permission.';
              break;
            case 404:
              errorMessage = 'Resource not found.';
              break;
            case 429:
              errorMessage = 'Too many requests. Please try again later.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              break;
            case 0:
              errorMessage = 'Network error. Please check your connection.';
              break;
            default:
              errorMessage = err.message || errorMessage;
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);

        if (onError) {
          onError(errorMessage);
        }

        console.error('API operation failed:', err);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    error,
    isLoading,
    setError,
    setLoading,
    handleAsyncOperation,
    clearError,
  };
};
