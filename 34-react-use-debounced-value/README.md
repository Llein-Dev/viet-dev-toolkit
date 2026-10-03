# react-use-debounced-value

> Minimalistic React hook to debounce any rapidly changing value like search queries, slider values, or window resize metrics.

[![npm version](https://img.shields.io/npm/v/react-use-debounced-value.svg?style=flat-square)](https://www.npmjs.com/package/react-use-debounced-value)
[![npm downloads](https://img.shields.io/npm/dm/react-use-debounced-value.svg?style=flat-square)](https://www.npmjs.com/package/react-use-debounced-value)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-use-debounced-value?style=flat-square)](https://bundlephobia.com/package/react-use-debounced-value)
[![license](https://img.shields.io/npm/l/react-use-debounced-value.svg?style=flat-square)](./LICENSE)

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
npm install react-use-debounced-value

# Using pnpm
pnpm add react-use-debounced-value

# Using yarn
yarn add react-use-debounced-value
```

---

## 🚀 Quickstart

```typescript
import { useDebouncedValue } from 'react-use-debounced-value';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    // Only triggers after user stops typing for 300ms
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);
}
```

---

## 📖 API Reference

- `useDebouncedValue<T>(value: T, delayMs: number): T`

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
