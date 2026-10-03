# react-intersection-lazy

> Defers rendering or triggers callbacks only when an element enters the browser viewport using native IntersectionObserver.

[![npm version](https://img.shields.io/npm/v/react-intersection-lazy.svg?style=flat-square)](https://www.npmjs.com/package/react-intersection-lazy)
[![npm downloads](https://img.shields.io/npm/dm/react-intersection-lazy.svg?style=flat-square)](https://www.npmjs.com/package/react-intersection-lazy)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-intersection-lazy?style=flat-square)](https://bundlephobia.com/package/react-intersection-lazy)
[![license](https://img.shields.io/npm/l/react-intersection-lazy.svg?style=flat-square)](./LICENSE)

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
npm install react-intersection-lazy

# Using pnpm
pnpm add react-intersection-lazy

# Using yarn
yarn add react-intersection-lazy
```

---

## 🚀 Quickstart

```typescript
import { IntersectionLazy } from 'react-intersection-lazy';

function BigFeed() {
  return (
    <IntersectionLazy placeholder={<div className="h-40 bg-gray-100" />}>
      <HeavyComponent />
    </IntersectionLazy>
  );
}
```

---

## 📖 API Reference

- `<IntersectionLazy rootMargin="..." threshold={0.1}>...</IntersectionLazy>`
- `useInView(options)`

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
