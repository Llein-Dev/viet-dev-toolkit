# react-localstorage-sync

> React hook that syncs state with browser localStorage and automatically mirrors updates in real-time across multiple open browser tabs.

[![npm version](https://img.shields.io/npm/v/react-localstorage-sync.svg?style=flat-square)](https://www.npmjs.com/package/react-localstorage-sync)
[![npm downloads](https://img.shields.io/npm/dm/react-localstorage-sync.svg?style=flat-square)](https://www.npmjs.com/package/react-localstorage-sync)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-localstorage-sync?style=flat-square)](https://bundlephobia.com/package/react-localstorage-sync)
[![license](https://img.shields.io/npm/l/react-localstorage-sync.svg?style=flat-square)](./LICENSE)

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
npm install react-localstorage-sync

# Using pnpm
pnpm add react-localstorage-sync

# Using yarn
yarn add react-localstorage-sync
```

---

## 🚀 Quickstart

```typescript
import { useLocalStorageSync } from 'react-localstorage-sync';

function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorageSync('app-theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current Theme: {theme}
    </button>
  );
}
```

---

## 📖 API Reference

- `useLocalStorageSync<T>(key: string, initialValue: T): [T, (val: T) => void]`

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
