# vn-slugify-plus

> Transform Vietnamese text with diacritics into URL-friendly, SEO-optimized slugs. Cleanly handles đ/Đ, emojis, and symbols.

[![npm version](https://img.shields.io/npm/v/vn-slugify-plus.svg?style=flat-square)](https://www.npmjs.com/package/vn-slugify-plus)
[![npm downloads](https://img.shields.io/npm/dm/vn-slugify-plus.svg?style=flat-square)](https://www.npmjs.com/package/vn-slugify-plus)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-slugify-plus?style=flat-square)](https://bundlephobia.com/package/vn-slugify-plus)
[![license](https://img.shields.io/npm/l/vn-slugify-plus.svg?style=flat-square)](./LICENSE)

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
npm install vn-slugify-plus

# Using pnpm
pnpm add vn-slugify-plus

# Using yarn
yarn add vn-slugify-plus
```

---

## 🚀 Quickstart

```typescript
import { slugifyVN, removeVNAccents } from 'vn-slugify-plus';

console.log(slugifyVN('Đắc Nhân Tâm - Dale Carnegie 🚀'));
// "dac-nhan-tam-dale-carnegie"

console.log(removeVNAccents('Học Lập Trình Node.js & React'));
// "Hoc Lap Trinh Node.js & React"
```

---

## 📖 API Reference

- `slugifyVN(text: string, options?): string`
- `removeVNAccents(text: string): string`

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
