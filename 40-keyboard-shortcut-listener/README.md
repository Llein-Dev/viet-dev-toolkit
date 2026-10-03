# keyboard-shortcut-listener

> Reliable keyboard shortcut listener and React hook for Cmd+K, Ctrl+S, Escape with automatic suppression inside text input fields.

[![npm version](https://img.shields.io/npm/v/keyboard-shortcut-listener.svg?style=flat-square)](https://www.npmjs.com/package/keyboard-shortcut-listener)
[![npm downloads](https://img.shields.io/npm/dm/keyboard-shortcut-listener.svg?style=flat-square)](https://www.npmjs.com/package/keyboard-shortcut-listener)
[![bundle size](https://img.shields.io/bundlephobia/minzip/keyboard-shortcut-listener?style=flat-square)](https://bundlephobia.com/package/keyboard-shortcut-listener)
[![license](https://img.shields.io/npm/l/keyboard-shortcut-listener.svg?style=flat-square)](./LICENSE)

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
npm install keyboard-shortcut-listener

# Using pnpm
pnpm add keyboard-shortcut-listener

# Using yarn
yarn add keyboard-shortcut-listener
```

---

## 🚀 Quickstart

```typescript
import { registerShortcut } from 'keyboard-shortcut-listener';

// Register global shortcut
const unbind = registerShortcut('meta+k', (e) => {
  e.preventDefault();
  openCommandPalette();
});
```

---

## 📖 API Reference

- `registerShortcut(combo: string, handler: (e: KeyboardEvent) => void, options?)`
- `useShortcut(combo: string, handler: (e: KeyboardEvent) => void)`

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
