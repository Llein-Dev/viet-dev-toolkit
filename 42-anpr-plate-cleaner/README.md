# anpr-plate-cleaner

> Post-processing text cleaner for License Plate OCR (ANPR) resolving character confusions like 0 vs O, 1 vs I, 8 vs B based on position rules.

[![npm version](https://img.shields.io/npm/v/anpr-plate-cleaner.svg?style=flat-square)](https://www.npmjs.com/package/anpr-plate-cleaner)
[![npm downloads](https://img.shields.io/npm/dm/anpr-plate-cleaner.svg?style=flat-square)](https://www.npmjs.com/package/anpr-plate-cleaner)
[![bundle size](https://img.shields.io/bundlephobia/minzip/anpr-plate-cleaner?style=flat-square)](https://bundlephobia.com/package/anpr-plate-cleaner)
[![license](https://img.shields.io/npm/l/anpr-plate-cleaner.svg?style=flat-square)](./LICENSE)

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
npm install anpr-plate-cleaner

# Using pnpm
pnpm add anpr-plate-cleaner

# Using yarn
yarn add anpr-plate-cleaner
```

---

## 🚀 Quickstart

```typescript
import { cleanANPRText } from 'anpr-plate-cleaner';

// OCR misread "51K" as "51|<" and "001" as "OO1"
const corrected = cleanANPRText('51K-OO1.23');
console.log(corrected); // "51K-001.23"
```

---

## 📖 API Reference

- `cleanANPRText(rawOcr: string): string`
- `fixLetterConfusion(char: string): string`
- `fixDigitConfusion(char: string): string`

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
