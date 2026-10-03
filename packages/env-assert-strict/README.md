# env-assert-strict

> Strict environment variable validation at startup with colored terminal error reporting and type coercion.

[![npm version](https://img.shields.io/npm/v/env-assert-strict.svg?style=flat-square)](https://www.npmjs.com/package/env-assert-strict)
[![npm downloads](https://img.shields.io/npm/dm/env-assert-strict.svg?style=flat-square)](https://www.npmjs.com/package/env-assert-strict)
[![bundle size](https://img.shields.io/bundlephobia/minzip/env-assert-strict?style=flat-square)](https://bundlephobia.com/package/env-assert-strict)
[![license](https://img.shields.io/npm/l/env-assert-strict.svg?style=flat-square)](./LICENSE)

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
npm install env-assert-strict

# Using pnpm
pnpm add env-assert-strict

# Using yarn
yarn add env-assert-strict
```

---

## 🚀 Quickstart

```typescript
import { assertEnv } from 'env-assert-strict';

// Call at the very top of server entry point
assertEnv({
  PORT: { type: 'number', default: 3000 },
  DATABASE_URL: { required: true, type: 'url' },
  NODE_ENV: { enum: ['development', 'production', 'test'], default: 'development' }
});
```

---

## 📖 API Reference

- `assertEnv(schema: Record<string, EnvRule>): Record<string, any>`

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
