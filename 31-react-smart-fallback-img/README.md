# react-smart-fallback-img

> React image component with built-in skeleton loading and automatic graceful fallback to placeholder SVG or avatar initials on 404/broken URL.

[![npm version](https://img.shields.io/npm/v/react-smart-fallback-img.svg?style=flat-square)](https://www.npmjs.com/package/react-smart-fallback-img)
[![npm downloads](https://img.shields.io/npm/dm/react-smart-fallback-img.svg?style=flat-square)](https://www.npmjs.com/package/react-smart-fallback-img)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-smart-fallback-img?style=flat-square)](https://bundlephobia.com/package/react-smart-fallback-img)
[![license](https://img.shields.io/npm/l/react-smart-fallback-img.svg?style=flat-square)](./LICENSE)

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
npm install react-smart-fallback-img

# Using pnpm
pnpm add react-smart-fallback-img

# Using yarn
yarn add react-smart-fallback-img
```

---

## 🚀 Quickstart

```typescript
import { SmartImage } from 'react-smart-fallback-img';

function Profile({ user }) {
  return (
    <SmartImage
      src={user.avatarUrl}
      fallbackSrc="https://avatar.vercel.sh/user"
      alt={user.name}
      className="w-16 h-16 rounded-full"
    />
  );
}
```

---

## 📖 API Reference

- `<SmartImage src={string} fallbackSrc={string} ... />`
- `useImageFallback(src, fallbackSrc)`

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
