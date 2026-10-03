# process-lock-file

> Simple file-based process locking mechanism preventing concurrent executions of cron jobs and CLI daemon scripts.

[![npm version](https://img.shields.io/npm/v/process-lock-file.svg?style=flat-square)](https://www.npmjs.com/package/process-lock-file)
[![npm downloads](https://img.shields.io/npm/dm/process-lock-file.svg?style=flat-square)](https://www.npmjs.com/package/process-lock-file)
[![bundle size](https://img.shields.io/bundlephobia/minzip/process-lock-file?style=flat-square)](https://bundlephobia.com/package/process-lock-file)
[![license](https://img.shields.io/npm/l/process-lock-file.svg?style=flat-square)](./LICENSE)

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
npm install process-lock-file

# Using pnpm
pnpm add process-lock-file

# Using yarn
yarn add process-lock-file
```

---

## 🚀 Quickstart

```typescript
import { acquireLock } from 'process-lock-file';

const lock = acquireLock('.sync.lock');
if (!lock.acquired) {
  console.log('Script is already running in another process! Exiting.');
  process.exit(0);
}

// ... do heavy work ...
lock.release();
```

---

## 📖 API Reference

- `acquireLock(lockFilePath: string): LockHandle`
- `releaseLock(lockFilePath: string): void`

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
