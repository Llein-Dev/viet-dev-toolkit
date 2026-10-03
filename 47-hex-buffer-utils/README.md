# hex-buffer-utils

> Utility for fast zero-allocation conversions between Hex strings, Byte arrays, ASCII, and binary strings.

[![npm version](https://img.shields.io/npm/v/hex-buffer-utils.svg?style=flat-square)](https://www.npmjs.com/package/hex-buffer-utils)
[![npm downloads](https://img.shields.io/npm/dm/hex-buffer-utils.svg?style=flat-square)](https://www.npmjs.com/package/hex-buffer-utils)
[![bundle size](https://img.shields.io/bundlephobia/minzip/hex-buffer-utils?style=flat-square)](https://bundlephobia.com/package/hex-buffer-utils)
[![license](https://img.shields.io/npm/l/hex-buffer-utils.svg?style=flat-square)](./LICENSE)

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
npm install hex-buffer-utils

# Using pnpm
pnpm add hex-buffer-utils

# Using yarn
yarn add hex-buffer-utils
```

---

## 🚀 Quickstart

```typescript
import { hexToBytes, bytesToHex, stringToHex } from 'hex-buffer-utils';

const bytes = hexToBytes('01030000000AC5CD');
console.log(bytesToHex(bytes, ' ')); // "01 03 00 00 00 0A C5 CD"
```

---

## 📖 API Reference

- `hexToBytes(hex: string): Uint8Array`
- `bytesToHex(bytes: Uint8Array | number[], delimiter?: string): string`
- `stringToHex(str: string): string`

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
