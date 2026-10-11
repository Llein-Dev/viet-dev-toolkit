import { useMemo } from 'react';
import { sanitizeAPIError, SanitizedAPIError, SanitizeOptions } from './index';

/**
 * Official React Hook for seamless API error handling.
 * Automatically converts raw API or mutation errors into a memoized, UI-ready sanitized object.
 *
 * @example
 * ```tsx
 * import { useSanitizedError } from '@llein/api-error-sanitizer/react';
 *
 * function UserProfile() {
 *   const { data, error, isLoading } = useQuery(...);
 *   const apiError = useSanitizedError(error);
 *
 *   if (apiError) {
 *     return (
 *       <div className="alert alert-danger">
 *         <p>{apiError.message}</p>
 *         {apiError.isAuthError && <button onClick={redirectToLogin}>Đăng nhập lại</button>}
 *       </div>
 *     );
 *   }
 * }
 * ```
 */
export function useSanitizedError(
  error: unknown,
  options?: SanitizeOptions
): SanitizedAPIError | null {
  return useMemo(() => {
    if (!error) return null;
    return sanitizeAPIError(error, options);
  }, [error, options?.locale, options?.fallbackMessage]);
}
