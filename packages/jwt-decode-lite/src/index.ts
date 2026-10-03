export interface BaseJwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export function decodeJwt<T extends BaseJwtPayload = BaseJwtPayload>(token: string): T {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token provided');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload: string;

    if (typeof atob === 'function') {
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } else {
      jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    }

    return JSON.parse(jsonPayload);
  } catch (err: any) {
    throw new Error(`Failed to decode JWT: ${err.message}`);
  }
}

export function isTokenExpired(token: string, offsetSeconds = 0): boolean {
  try {
    const payload = decodeJwt(token);
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now + offsetSeconds;
  } catch {
    return true;
  }
}
