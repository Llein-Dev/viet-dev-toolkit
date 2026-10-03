# file-size-humanize

> Fast byte formatter converting byte numbers into human-readable strings (KB, MB, GB) with binary (1024) and SI (1000) base support.

[![npm version](https://img.shields.io/npm/v/file-size-humanize.svg?style=flat-square)](https://www.npmjs.com/package/file-size-humanize)
[![npm downloads](https://img.shields.io/npm/dm/file-size-humanize.svg?style=flat-square)](https://www.npmjs.com/package/file-size-humanize)
[![bundle size](https://img.shields.io/bundlephobia/minzip/file-size-humanize?style=flat-square)](https://bundlephobia.com/package/file-size-humanize)
[![license](https://img.shields.io/npm/l/file-size-humanize.svg?style=flat-square)](./LICENSE)

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
npm install file-size-humanize

# Using pnpm
pnpm add file-size-humanize

# Using yarn
yarn add file-size-humanize
```

---

## 🚀 Quickstart

```typescript
import { humanizeFileSize } from 'file-size-humanize';

console.log(humanizeFileSize(1048576)); // "1 MB"
console.log(humanizeFileSize(1500000000, { standard: 'si', decimals: 2 })); // "1.50 GB"
```

---

## 📖 API Reference

- `humanizeFileSize(bytes: number, options?): string`

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
