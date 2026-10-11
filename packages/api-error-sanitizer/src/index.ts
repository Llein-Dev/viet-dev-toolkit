export type ErrorLocale = 'vi' | 'en';

export interface SanitizedAPIError {
  /** Clean, single-line error message guaranteed safe for UI Toast/Alert */
  message: string;

  /** HTTP response status code (e.g. 400, 401, 403, 404, 422, 500, 502) if available */
  status?: number;

  /** System or API machine-readable code (e.g. 'ERR_NETWORK', 'ECONNABORTED', 'VALIDATION_FAILED') */
  code?: string;

  /** Field-level validation errors (e.g. for Laravel, NestJS, FastAPI forms) */
  fields?: Record<string, string[]>;

  /** Whether the error is caused by lost internet connection or offline status */
  isNetworkError: boolean;

  /** Whether the error is caused by a request timeout */
  isTimeout: boolean;

  /** Whether the error is authentication/permission related (401 Unauthorized or 403 Forbidden) */
  isAuthError: boolean;

  /** Whether the error is a client-side error (HTTP 4xx) */
  isClientError: boolean;

  /** Whether the error is a server-side error (HTTP 5xx) */
  isServerError: boolean;

  /** Original raw error object for debugging/logging */
  raw: unknown;
}

export interface SanitizeOptions {
  /**
   * Locale for default system messages
   * @default 'vi'
   */
  locale?: ErrorLocale;

  /**
   * Custom fallback message when no understandable message can be extracted
   */
  fallbackMessage?: string;

  /**
   * Custom mapping of HTTP status codes to user-facing friendly messages
   */
  statusMessages?: Record<number, string>;
}

const DEFAULT_MESSAGES: Record<ErrorLocale, {
  network: string;
  timeout: string;
  auth: string;
  forbidden: string;
  notFound: string;
  server: string;
  fallback: string;
}> = {
  vi: {
    network: 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.',
    timeout: 'Yêu cầu quá thời gian chờ (Timeout). Vui lòng thử lại sau giây lát.',
    auth: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
    forbidden: 'Bạn không có quyền thực hiện hành động này.',
    notFound: 'Không tìm thấy dữ liệu yêu cầu.',
    server: 'Hệ thống đang gặp sự cố. Vui lòng thử lại sau.',
    fallback: 'Đã có lỗi xảy ra. Vui lòng thử lại.'
  },
  en: {
    network: 'Unable to connect to server. Please check your network connection.',
    timeout: 'Request timed out. Please try again later.',
    auth: 'Authentication required. Please log in again.',
    forbidden: 'You do not have permission to perform this action.',
    notFound: 'Requested resource not found.',
    server: 'Internal server error. Please try again later.',
    fallback: 'An unexpected error occurred. Please try again.'
  }
};

/**
 * Extracts title or clean summary from HTML crash dumps (Nginx, Cloudflare, Apache).
 * Prevents raw HTML tags from leaking into UI components.
 */
function extractFromHTML(html: string): string | null {
  if (typeof html !== 'string') return null;
  const trimmed = html.trim();
  if (!trimmed.startsWith('<') || !trimmed.endsWith('>')) return null;

  // Extract <title> content
  const titleMatch = trimmed.match(/<title[^>]*>(.*?)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    const cleanTitle = titleMatch[1].replace(/<[^>]+>/g, '').trim();
    if (cleanTitle) return cleanTitle;
  }

  // Extract <h1> content
  const h1Match = trimmed.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1Match && h1Match[1]) {
    const cleanH1 = h1Match[1].replace(/<[^>]+>/g, '').trim();
    if (cleanH1) return cleanH1;
  }

  return '502 Bad Gateway / Server Crash';
}

/**
 * Extracts structured validation errors from various popular backend frameworks:
 * - Laravel: { errors: { email: ["The email field is required."] } }
 * - NestJS: { message: ["name must be a string", "email must be valid"], error: "Bad Request" }
 * - Django / DRF: { username: ["This field is required."], password: [...] }
 * - FastAPI: { detail: [ { loc: ["body", "email"], msg: "field required" } ] }
 */
function extractValidationFields(data: any): Record<string, string[]> | undefined {
  if (!data || typeof data !== 'object') return undefined;

  // Laravel format: { errors: { field: ["msg1", "msg2"] } }
  if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
    const result: Record<string, string[]> = {};
    for (const key of Object.keys(data.errors)) {
      const val = data.errors[key];
      if (Array.isArray(val)) {
        result[key] = val.map(String);
      } else if (typeof val === 'string') {
        result[key] = [val];
      }
    }
    if (Object.keys(result).length > 0) return result;
  }

  // FastAPI format: { detail: [ { loc: ["body", "field"], msg: "..." } ] }
  if (Array.isArray(data.detail)) {
    const result: Record<string, string[]> = {};
    for (const item of data.detail) {
      if (item && typeof item === 'object' && item.msg) {
        const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : 'general';
        if (!result[field]) result[field] = [];
        result[field].push(String(item.msg));
      }
    }
    if (Object.keys(result).length > 0) return result;
  }

  // Django REST Framework format: { field: ["error1", "error2"] }
  if (!data.message && !data.error && !data.status) {
    const result: Record<string, string[]> = {};
    let hasField = false;
    for (const key of Object.keys(data)) {
      const val = data[key];
      if (Array.isArray(val) && val.every((v) => typeof v === 'string')) {
        result[key] = val;
        hasField = true;
      }
    }
    if (hasField) return result;
  }

  return undefined;
}

/**
 * Universal error sanitizer and normalizer.
 * Ingests any error type (AxiosError, Fetch Response, Error, string, object, HTML crash)
 * and returns a standardized, UI-ready SanitizedAPIError object.
 *
 * @example
 * ```ts
 * try {
 *   await api.post('/users', payload);
 * } catch (err) {
 *   const error = sanitizeAPIError(err);
 *   toast.error(error.message); // Clean, safe, user-friendly!
 * }
 * ```
 */
export function sanitizeAPIError(error: unknown, options: SanitizeOptions = {}): SanitizedAPIError {
  const {
    locale = 'vi',
    fallbackMessage,
    statusMessages = {}
  } = options;

  const msgs = DEFAULT_MESSAGES[locale] ?? DEFAULT_MESSAGES.vi;

  // 1. Primitive string error
  if (typeof error === 'string') {
    const htmlClean = extractFromHTML(error);
    return {
      message: htmlClean || error.trim() || fallbackMessage || msgs.fallback,
      isNetworkError: false,
      isTimeout: false,
      isAuthError: false,
      isClientError: false,
      isServerError: false,
      raw: error
    };
  }

  // Non-object fallback
  if (!error || typeof error !== 'object') {
    return {
      message: fallbackMessage || msgs.fallback,
      isNetworkError: false,
      isTimeout: false,
      isAuthError: false,
      isClientError: false,
      isServerError: false,
      raw: error
    };
  }

  const errObj = error as Record<string, any>;

  // Check network error flags
  const code = typeof errObj.code === 'string' ? errObj.code : undefined;
  const isNetwork =
    code === 'ERR_NETWORK' ||
    errObj.message === 'Network Error' ||
    errObj.name === 'NetworkError' ||
    (typeof navigator !== 'undefined' && !navigator.onLine);

  const isTimeout =
    code === 'ECONNABORTED' ||
    code === 'ETIMEDOUT' ||
    errObj.name === 'TimeoutError' ||
    (typeof errObj.message === 'string' && errObj.message.toLowerCase().includes('timeout'));

  // Extract HTTP status
  let status: number | undefined;
  if (typeof errObj.response?.status === 'number') {
    status = errObj.response.status;
  } else if (typeof errObj.status === 'number') {
    status = errObj.status;
  }

  const isClientError = status !== undefined && status >= 400 && status < 500;
  const isServerError = status !== undefined && status >= 500 && status < 600;
  const isAuthError = status === 401 || status === 403;

  // Response data extraction
  const responseData = errObj.response?.data ?? errObj.data;

  // Validation errors
  const fields = extractValidationFields(responseData);

  // Message resolution priority
  let extractedMessage: string | null = null;

  // Priority 1: Check status-specific custom message
  if (status && statusMessages[status]) {
    extractedMessage = statusMessages[status];
  }

  // Priority 2: HTML body detection (Nginx/Cloudflare crash dump)
  if (!extractedMessage && typeof responseData === 'string') {
    extractedMessage = extractFromHTML(responseData);
  }

  // Priority 3: Deep nested message in response.data
  if (!extractedMessage && responseData && typeof responseData === 'object') {
    if (typeof responseData.message === 'string') {
      extractedMessage = responseData.message;
    } else if (Array.isArray(responseData.message) && responseData.message.length > 0) {
      // NestJS class-validator format: { message: ["email must be valid", "name is required"] }
      extractedMessage = responseData.message.map(String).join('. ');
    } else if (typeof responseData.error === 'string') {
      extractedMessage = responseData.error;
    } else if (typeof responseData.detail === 'string') {
      extractedMessage = responseData.detail;
    } else if (Array.isArray(responseData.errors) && responseData.errors[0]?.message) {
      // GraphQL error format
      extractedMessage = responseData.errors[0].message;
    }
  }

  // Priority 4: Network and Timeout specific friendly messages
  if (!extractedMessage) {
    if (isNetwork) extractedMessage = msgs.network;
    else if (isTimeout) extractedMessage = msgs.timeout;
  }

  // Priority 5: First validation error if available
  if (!extractedMessage && fields) {
    const firstKey = Object.keys(fields)[0];
    if (firstKey && fields[firstKey][0]) {
      extractedMessage = fields[firstKey][0];
    }
  }

  // Priority 6: Fallback on standard Error.message (ignoring generic Axios wrapper text)
  if (!extractedMessage && typeof errObj.message === 'string') {
    const rawMsg = errObj.message.trim();
    if (rawMsg && !rawMsg.startsWith('Request failed with status code')) {
      extractedMessage = rawMsg;
    }
  }

  // Priority 7: Standard HTTP status messages
  if (!extractedMessage && status) {
    if (status === 401) extractedMessage = msgs.auth;
    else if (status === 403) extractedMessage = msgs.forbidden;
    else if (status === 404) extractedMessage = msgs.notFound;
    else if (status >= 500) extractedMessage = msgs.server;
  }

  // Final fallback
  const finalMessage = extractedMessage || fallbackMessage || msgs.fallback;

  return {
    message: finalMessage,
    status,
    code,
    fields,
    isNetworkError: Boolean(isNetwork),
    isTimeout: Boolean(isTimeout),
    isAuthError,
    isClientError,
    isServerError,
    raw: error
  };
}
