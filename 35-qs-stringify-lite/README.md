# qs-stringify-lite

> Ultra-compact (~500 bytes) query string serializer and parser supporting nested objects, arrays, and boolean encoding.

[![npm version](https://img.shields.io/npm/v/qs-stringify-lite.svg?style=flat-square)](https://www.npmjs.com/package/qs-stringify-lite)
[![npm downloads](https://img.shields.io/npm/dm/qs-stringify-lite.svg?style=flat-square)](https://www.npmjs.com/package/qs-stringify-lite)
[![bundle size](https://img.shields.io/bundlephobia/minzip/qs-stringify-lite?style=flat-square)](https://bundlephobia.com/package/qs-stringify-lite)
[![license](https://img.shields.io/npm/l/qs-stringify-lite.svg?style=flat-square)](./LICENSE)

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
npm install qs-stringify-lite

# Using pnpm
pnpm add qs-stringify-lite

# Using yarn
yarn add qs-stringify-lite
```

---

## 🚀 Quickstart

```typescript
import { stringifyQuery, parseQuery } from 'qs-stringify-lite';

const qs = stringifyQuery({ page: 1, tags: ['react', 'ts'], filter: { active: true } });
console.log(qs); // "page=1&tags=react&tags=ts&filter[active]=true"

const parsed = parseQuery(qs);
console.log(parsed.page); // "1"
```

---

## 📖 API Reference

- `stringifyQuery(obj: Record<string, any>): string`
- `parseQuery(qs: string): Record<string, any>`

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
