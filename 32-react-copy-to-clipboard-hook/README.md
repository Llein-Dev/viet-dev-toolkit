# react-copy-to-clipboard-hook

> Lightweight React hook for modern async Clipboard API with copied feedback state and auto-reset timeout.

[![npm version](https://img.shields.io/npm/v/react-copy-to-clipboard-hook.svg?style=flat-square)](https://www.npmjs.com/package/react-copy-to-clipboard-hook)
[![npm downloads](https://img.shields.io/npm/dm/react-copy-to-clipboard-hook.svg?style=flat-square)](https://www.npmjs.com/package/react-copy-to-clipboard-hook)
[![bundle size](https://img.shields.io/bundlephobia/minzip/react-copy-to-clipboard-hook?style=flat-square)](https://bundlephobia.com/package/react-copy-to-clipboard-hook)
[![license](https://img.shields.io/npm/l/react-copy-to-clipboard-hook.svg?style=flat-square)](./LICENSE)

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
npm install react-copy-to-clipboard-hook

# Using pnpm
pnpm add react-copy-to-clipboard-hook

# Using yarn
yarn add react-copy-to-clipboard-hook
```

---

## 🚀 Quickstart

```typescript
import { useCopyToClipboard } from 'react-copy-to-clipboard-hook';

function CopyButton({ text }: { text: string }) {
  const { copy, copied, error } = useCopyToClipboard({ timeout: 2000 });

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied! ✅' : 'Copy'}
    </button>
  );
}
```

---

## 📖 API Reference

- `useCopyToClipboard(options?: { timeout?: number }): CopyResult`

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
