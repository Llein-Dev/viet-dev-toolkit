import { describe, it, expect } from 'vitest';
import { sanitizeAPIError } from './index';

describe('@llein/api-error-sanitizer', () => {
  it('should sanitize basic string error', () => {
    const res = sanitizeAPIError('Mật khẩu không hợp lệ');
    expect(res.message).toBe('Mật khẩu không hợp lệ');
    expect(res.isNetworkError).toBe(false);
  });

  it('should sanitize standard Error instance', () => {
    const res = sanitizeAPIError(new Error('Tài khoản đã bị khóa'));
    expect(res.message).toBe('Tài khoản đã bị khóa');
  });

  it('should sanitize Axios-like response error with message', () => {
    const axiosError = {
      isAxiosError: true,
      response: {
        status: 400,
        data: {
          message: 'Số điện thoại đã được đăng ký'
        }
      }
    };
    const res = sanitizeAPIError(axiosError);
    expect(res.message).toBe('Số điện thoại đã được đăng ký');
    expect(res.status).toBe(400);
    expect(res.isClientError).toBe(true);
    expect(res.isServerError).toBe(false);
  });

  it('should sanitize NestJS validation error array', () => {
    const nestError = {
      response: {
        status: 400,
        data: {
          message: ['email must be an email', 'password is too weak']
        }
      }
    };
    const res = sanitizeAPIError(nestError);
    expect(res.message).toBe('email must be an email. password is too weak');
    expect(res.status).toBe(400);
  });

  it('should sanitize Laravel validation field errors', () => {
    const laravelError = {
      response: {
        status: 422,
        data: {
          message: 'The given data was invalid.',
          errors: {
            email: ['Email đã tồn tại trong hệ thống'],
            phone: ['Số điện thoại không đúng định dạng']
          }
        }
      }
    };
    const res = sanitizeAPIError(laravelError);
    expect(res.status).toBe(422);
    expect(res.fields?.email).toEqual(['Email đã tồn tại trong hệ thống']);
    expect(res.fields?.phone).toEqual(['Số điện thoại không đúng định dạng']);
    expect(res.message).toBe('The given data was invalid.');
  });

  it('should safely extract clean title from Cloudflare/Nginx HTML crash dump', () => {
    const htmlCrash = `
      <!DOCTYPE html>
      <html>
        <head><title>502 Bad Gateway</title></head>
        <body><center><h1>502 Bad Gateway</h1></center></body>
      </html>
    `;
    const res = sanitizeAPIError({
      response: {
        status: 502,
        data: htmlCrash
      }
    });
    expect(res.message).toBe('502 Bad Gateway');
    expect(res.status).toBe(502);
    expect(res.isServerError).toBe(true);
  });

  it('should identify network error properly with friendly Vietnamese message', () => {
    const netErr = {
      message: 'Network Error',
      code: 'ERR_NETWORK'
    };
    const res = sanitizeAPIError(netErr);
    expect(res.isNetworkError).toBe(true);
    expect(res.message).toContain('Không thể kết nối đến máy chủ');
  });

  it('should identify timeout error properly with friendly message', () => {
    const timeoutErr = {
      message: 'timeout of 5000ms exceeded',
      code: 'ECONNABORTED'
    };
    const res = sanitizeAPIError(timeoutErr);
    expect(res.isTimeout).toBe(true);
    expect(res.message).toContain('quá thời gian chờ');
  });

  it('should flag auth errors (401 & 403)', () => {
    const authErr = { response: { status: 401 } };
    const res = sanitizeAPIError(authErr);
    expect(res.isAuthError).toBe(true);
    expect(res.message).toContain('Phiên đăng nhập đã hết hạn');

    const forbiddenErr = { response: { status: 403 } };
    const res2 = sanitizeAPIError(forbiddenErr);
    expect(res2.isAuthError).toBe(true);
    expect(res2.message).toContain('không có quyền');
  });

  it('should support English locale fallback', () => {
    const netErr = { code: 'ERR_NETWORK' };
    const res = sanitizeAPIError(netErr, { locale: 'en' });
    expect(res.message).toBe('Unable to connect to server. Please check your network connection.');
  });
});
