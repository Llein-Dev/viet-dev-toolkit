# express-async-catch

> Clean async/await wrapper for Express 4.x route handlers avoiding repetitive try-catch blocks.

[![npm version](https://img.shields.io/npm/v/express-async-catch.svg?style=flat-square)](https://www.npmjs.com/package/express-async-catch)
[![npm downloads](https://img.shields.io/npm/dm/express-async-catch.svg?style=flat-square)](https://www.npmjs.com/package/express-async-catch)
[![bundle size](https://img.shields.io/bundlephobia/minzip/express-async-catch?style=flat-square)](https://bundlephobia.com/package/express-async-catch)
[![license](https://img.shields.io/npm/l/express-async-catch.svg?style=flat-square)](./LICENSE)

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
npm install express-async-catch

# Using pnpm
pnpm add express-async-catch

# Using yarn
yarn add express-async-catch
```

---

## 🚀 Quickstart

```typescript
import { asyncCatch } from 'express-async-catch';
import express from 'express';

const app = express();

app.get('/users', asyncCatch(async (req, res) => {
  const users = await fetchUsersFromDb();
  res.json(users);
}));
```

---

## 📖 API Reference

- `asyncCatch(fn: Function): ExpressMiddleware`
- `wrapRouter(router: ExpressRouter): ExpressRouter`

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
