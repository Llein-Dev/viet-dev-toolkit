# graceful-shutdown-node

> Safe exit lifecycle manager for Node.js servers, closing DB pools and finishing HTTP requests on SIGTERM / SIGINT.

[![npm version](https://img.shields.io/npm/v/graceful-shutdown-node.svg?style=flat-square)](https://www.npmjs.com/package/graceful-shutdown-node)
[![npm downloads](https://img.shields.io/npm/dm/graceful-shutdown-node.svg?style=flat-square)](https://www.npmjs.com/package/graceful-shutdown-node)
[![bundle size](https://img.shields.io/bundlephobia/minzip/graceful-shutdown-node?style=flat-square)](https://bundlephobia.com/package/graceful-shutdown-node)
[![license](https://img.shields.io/npm/l/graceful-shutdown-node.svg?style=flat-square)](./LICENSE)

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
npm install graceful-shutdown-node

# Using pnpm
pnpm add graceful-shutdown-node

# Using yarn
yarn add graceful-shutdown-node
```

---

## 🚀 Quickstart

```typescript
import { registerShutdownHook } from 'graceful-shutdown-node';

registerShutdownHook(async () => {
  console.log('Closing database connections...');
  await db.disconnect();
  console.log('Closing HTTP server...');
  await server.close();
}, { timeoutMs: 10000 });
```

---

## 📖 API Reference

- `registerShutdownHook(cleanupFn: () => Promise<void>, options?): void`

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
