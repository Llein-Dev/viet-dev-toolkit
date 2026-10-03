# vn-workday-calc

> Calculate working days in Vietnam excluding weekends and official public holidays (Tet, Hung Kings, National Day, etc.).

[![npm version](https://img.shields.io/npm/v/vn-workday-calc.svg?style=flat-square)](https://www.npmjs.com/package/vn-workday-calc)
[![npm downloads](https://img.shields.io/npm/dm/vn-workday-calc.svg?style=flat-square)](https://www.npmjs.com/package/vn-workday-calc)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-workday-calc?style=flat-square)](https://bundlephobia.com/package/vn-workday-calc)
[![license](https://img.shields.io/npm/l/vn-workday-calc.svg?style=flat-square)](./LICENSE)

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
npm install vn-workday-calc

# Using pnpm
pnpm add vn-workday-calc

# Using yarn
yarn add vn-workday-calc
```

---

## 🚀 Quickstart

```typescript
import { calculateWorkdays, isVNWorkday } from 'vn-workday-calc';

const days = calculateWorkdays('2026-04-28', '2026-05-04');
console.log(days); // Automatically skips weekends and 30/4 - 1/5!

console.log(isVNWorkday(new Date('2026-09-02'))); // false (Quoc khanh)
```

---

## 📖 API Reference

- `calculateWorkdays(start, end, options?): number`
- `isVNWorkday(date, options?): boolean`
- `getVNHolidays(year: number): string[]`

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
