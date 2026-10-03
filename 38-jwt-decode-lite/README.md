# jwt-decode-lite

> Ultra-fast, zero-dependency client-side JWT token decoder with automatic expiry verification and payload type casting.

[![npm version](https://img.shields.io/npm/v/jwt-decode-lite.svg?style=flat-square)](https://www.npmjs.com/package/jwt-decode-lite)
[![npm downloads](https://img.shields.io/npm/dm/jwt-decode-lite.svg?style=flat-square)](https://www.npmjs.com/package/jwt-decode-lite)
[![bundle size](https://img.shields.io/bundlephobia/minzip/jwt-decode-lite?style=flat-square)](https://bundlephobia.com/package/jwt-decode-lite)
[![license](https://img.shields.io/npm/l/jwt-decode-lite.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Zero / Lightweight Dependencies**: Fast, minimal footprint.
- **Dual Export**: Built with `tsup` supporting both **ESM** (`.mjs`) and **CommonJS** (`.cjs`).
- **100% TypeScript**: Strongly typed with full auto-completion and declaration files.
- **Production Ready**: Tested for edge cases and high throughput.

---

## 📦 Installation

```bash
# Using npm
npm install jwt-decode-lite

# Using pnpm
pnpm add jwt-decode-lite

# Using yarn
yarn add jwt-decode-lite
```

---

## 🚀 Quickstart

```typescript
import { decodeJwt, isTokenExpired } from 'jwt-decode-lite';

const payload = decodeJwt<{ sub: string; role: string }>(token);
console.log(payload.role); // "admin"

console.log(isTokenExpired(token)); // true / false
```

---

## 📖 API Reference

- `decodeJwt<T>(token: string): T`
- `isTokenExpired(token: string, offsetSeconds?: number): boolean`

---

## 🛠️ Development & Testing

```bash
# Install dependencies
npm install

# Build ESM, CJS, and types
npm run build

# Run unit tests
npm test
```

---

## 📄 License

MIT © [Your Name](https://github.com)
