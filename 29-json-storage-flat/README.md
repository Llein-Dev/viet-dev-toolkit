# json-storage-flat

> Crash-resilient JSON flat-file storage engine with atomic writes and in-memory cache for fast local persistence.

[![npm version](https://img.shields.io/npm/v/json-storage-flat.svg?style=flat-square)](https://www.npmjs.com/package/json-storage-flat)
[![npm downloads](https://img.shields.io/npm/dm/json-storage-flat.svg?style=flat-square)](https://www.npmjs.com/package/json-storage-flat)
[![bundle size](https://img.shields.io/bundlephobia/minzip/json-storage-flat?style=flat-square)](https://bundlephobia.com/package/json-storage-flat)
[![license](https://img.shields.io/npm/l/json-storage-flat.svg?style=flat-square)](./LICENSE)

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
npm install json-storage-flat

# Using pnpm
pnpm add json-storage-flat

# Using yarn
yarn add json-storage-flat
```

---

## 🚀 Quickstart

```typescript
import { JsonStorage } from 'json-storage-flat';

const db = new JsonStorage('./data.json', { users: [] });
await db.update((data) => {
  data.users.push({ id: 1, name: 'Alice' });
});

console.log(db.get('users'));
```

---

## 📖 API Reference

- `new JsonStorage(filepath, initialData)`
- `db.get(key)`
- `db.set(key, value)`
- `db.update(updaterFn)`

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
