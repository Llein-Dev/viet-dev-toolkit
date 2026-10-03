# vn-address-parser

> Heuristic parser to break down unstructured Vietnamese address strings into Province, District, Ward, and Street parts.

[![npm version](https://img.shields.io/npm/v/vn-address-parser.svg?style=flat-square)](https://www.npmjs.com/package/vn-address-parser)
[![npm downloads](https://img.shields.io/npm/dm/vn-address-parser.svg?style=flat-square)](https://www.npmjs.com/package/vn-address-parser)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-address-parser?style=flat-square)](https://bundlephobia.com/package/vn-address-parser)
[![license](https://img.shields.io/npm/l/vn-address-parser.svg?style=flat-square)](./LICENSE)

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
npm install vn-address-parser

# Using pnpm
pnpm add vn-address-parser

# Using yarn
yarn add vn-address-parser
```

---

## 🚀 Quickstart

```typescript
import { parseVNAddress } from 'vn-address-parser';

const address = parseVNAddress('Tầng 5, 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh');
console.log(address.province); // "TP. Hồ Chí Minh"
console.log(address.district); // "Quận 1"
console.log(address.ward);     // "Phường Bến Nghé"
console.log(address.street);   // "Tầng 5, 123 Nguyễn Huệ"
```

---

## 📖 API Reference

- `parseVNAddress(rawAddress: string): ParsedVNAddress`

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
