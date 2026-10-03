# tailwind-merge-clsx

> Zero-bloat utility uniting clsx and lightweight Tailwind class conflict resolution into a single cn() function for Shadcn/UI.

[![npm version](https://img.shields.io/npm/v/tailwind-merge-clsx.svg?style=flat-square)](https://www.npmjs.com/package/tailwind-merge-clsx)
[![npm downloads](https://img.shields.io/npm/dm/tailwind-merge-clsx.svg?style=flat-square)](https://www.npmjs.com/package/tailwind-merge-clsx)
[![bundle size](https://img.shields.io/bundlephobia/minzip/tailwind-merge-clsx?style=flat-square)](https://bundlephobia.com/package/tailwind-merge-clsx)
[![license](https://img.shields.io/npm/l/tailwind-merge-clsx.svg?style=flat-square)](./LICENSE)

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
npm install tailwind-merge-clsx

# Using pnpm
pnpm add tailwind-merge-clsx

# Using yarn
yarn add tailwind-merge-clsx
```

---

## 🚀 Quickstart

```typescript
import { cn } from 'tailwind-merge-clsx';

// Resolves conflicting classes cleanly
const className = cn(
  'px-4 py-2 bg-blue-500 text-white rounded',
  isDanger && 'bg-red-500',
  customClassName
);
```

---

## 📖 API Reference

- `cn(...inputs: ClassValue[]): string`

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
