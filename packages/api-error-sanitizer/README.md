# @llein/api-error-sanitizer

> Ultra-lightweight, zero-dependency API error normalizer and sanitizer for Axios, Fetch, NestJS, Laravel, FastAPI, and Cloudflare/Nginx HTML crash dumps into clean, UI-ready toast objects.

[![npm version](https://img.shields.io/npm/v/@llein/api-error-sanitizer.svg?style=flat-square)](https://www.npmjs.com/package/@llein/api-error-sanitizer)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/api-error-sanitizer)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%202KB-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/api-error-sanitizer)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ The Problem

When working with APIs (Axios, Fetch, GraphQL), error structures are chaotic:
- **Axios**: Nested deep inside `error.response.data.message`, `error.response.data.errors`, or `error.response.data.detail`.
- **NestJS**: Arrays of class-validator strings `['email must be an email', 'name is required']`.
- **Laravel / Django**: Field-level validation objects `{ errors: { email: [...] } }`.
- **Nginx / Cloudflare 502/504**: Returns a 500-line raw HTML dump (`<html><head><title>502 Bad Gateway</title>...`), causing the classic UI bug where entire HTML code leaks into user toasts!
- **Network / Offline / Timeout**: Inconsistent error names (`ERR_NETWORK`, `ECONNABORTED`).

**`@llein/api-error-sanitizer`** normalizes everything into a safe, guaranteed single-line UI message and structured status flags.

---

## 📦 Installation

```bash
npm install @llein/api-error-sanitizer
```

---

## 🚀 Usage

### 1. Basic Sanitization (Axios & Fetch)

```ts
import axios from 'axios';
import { sanitizeAPIError } from '@llein/api-error-sanitizer';

try {
  await axios.post('/api/users', payload);
} catch (rawError) {
  const error = sanitizeAPIError(rawError);

  console.log(error.message);        // Guaranteed safe single-line string for Toast / Alert
  console.log(error.status);         // 400, 401, 403, 422, 500...
  console.log(error.isNetworkError); // true if user is offline or server unreachable
  console.log(error.isTimeout);      // true if connection timed out
  console.log(error.isAuthError);    // true if 401 or 403 (for login redirect)
  console.log(error.fields);         // { email: ["Invalid email"], ... }
}
```

### 2. Cloudflare & Nginx HTML Crash Protection

```ts
// When server crashes and returns HTML:
const htmlError = {
  response: {
    status: 502,
    data: '<!DOCTYPE html><html><head><title>502 Bad Gateway</title></head><body>...</body></html>'
  }
};

const sanitized = sanitizeAPIError(htmlError);
console.log(sanitized.message); // "502 Bad Gateway" (Never dumps raw HTML!)
```

### 3. React Hook Integration

```tsx
import { useQuery } from '@tanstack/react-query';
import { useSanitizedError } from '@llein/api-error-sanitizer/react';

function UserList() {
  const { data, error } = useQuery({ queryKey: ['users'], queryFn: fetchUsers });
  const apiError = useSanitizedError(error);

  if (apiError) {
    return (
      <div className="error-banner">
        <p>{apiError.message}</p>
        {apiError.isAuthError && <button onClick={login}>Đăng nhập lại</button>}
      </div>
    );
  }

  return <div>...</div>;
}
```

---

## 📄 License

MIT © [llein](https://github.com/Llein-Dev)
