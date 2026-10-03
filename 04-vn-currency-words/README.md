# vn-currency-words

> Convert numerical amounts to standardized Vietnamese words for banking, invoices, and legal contracts.

[![npm version](https://img.shields.io/npm/v/vn-currency-words.svg?style=flat-square)](https://www.npmjs.com/package/vn-currency-words)
[![npm downloads](https://img.shields.io/npm/dm/vn-currency-words.svg?style=flat-square)](https://www.npmjs.com/package/vn-currency-words)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-currency-words?style=flat-square)](https://bundlephobia.com/package/vn-currency-words)
[![license](https://img.shields.io/npm/l/vn-currency-words.svg?style=flat-square)](./LICENSE)

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
npm install vn-currency-words

# Using pnpm
pnpm add vn-currency-words

# Using yarn
yarn add vn-currency-words
```

---

## 🚀 Quickstart

```typescript
import { numberToVietnameseWords } from 'vn-currency-words';

console.log(numberToVietnameseWords(1500000));
// "Một triệu năm trăm nghìn đồng"

console.log(numberToVietnameseWords('20500120', { suffix: 'đồng chẵn' }));
// "Hai mươi triệu năm trăm linh một nghìn một trăm hai mươi đồng chẵn"
```

---

## 📖 API Reference

- `numberToVietnameseWords(amount: number | string, options?): string`

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
