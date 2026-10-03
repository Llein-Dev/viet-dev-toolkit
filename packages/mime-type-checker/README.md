# mime-type-checker

> Detect true MIME types and extensions from file magic bytes buffer, preventing extension spoofing attacks.

[![npm version](https://img.shields.io/npm/v/mime-type-checker.svg?style=flat-square)](https://www.npmjs.com/package/mime-type-checker)
[![npm downloads](https://img.shields.io/npm/dm/mime-type-checker.svg?style=flat-square)](https://www.npmjs.com/package/mime-type-checker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/mime-type-checker?style=flat-square)](https://bundlephobia.com/package/mime-type-checker)
[![license](https://img.shields.io/npm/l/mime-type-checker.svg?style=flat-square)](./LICENSE)

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
npm install mime-type-checker

# Using pnpm
pnpm add mime-type-checker

# Using yarn
yarn add mime-type-checker
```

---

## 🚀 Quickstart

```typescript
import { detectMimeFromBuffer } from 'mime-type-checker';

// Check first 16 bytes of uploaded file
const mime = detectMimeFromBuffer(fileBuffer);
console.log(mime); // { ext: 'png', mime: 'image/png' }
```

---

## 📖 API Reference

- `detectMimeFromBuffer(buffer: Uint8Array | Buffer): MimeResult | null`

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
