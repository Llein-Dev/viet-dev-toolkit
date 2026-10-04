# @llein/vn-currency-words

> Enterprise-grade, zero-dependency utility to convert numbers into standardized Vietnamese currency words for invoices, banking, and contracts.

[![npm version](https://img.shields.io/npm/v/@llein/vn-currency-words.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-currency-words)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-currency-words)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%203KB-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-currency-words)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Zero Dependencies**: Pure TypeScript, minimal footprint (< 2KB gzipped).
- **Accounting & Legal Ready**: Handles edge cases like *mốt, lăm, linh/lẻ, tư/bốn, không trăm linh một*.
- **Regional Dialects**: Easily switch between North (`nghìn` & `linh`) and South (`ngàn` & `lẻ`) dialect modes.
- **Large Numbers & BigInt**: Supports values from 0 up to trillions, quadrillions, and beyond.
- **Decimal Fractions**: Cleanly reads fractional currency (xu, cents) or decimal points.
- **Currency Formatter**: Includes `formatVND(1500000)` -> `"1.500.000 ₫"`.

---

## 📦 Installation

```bash
# Using npm
npm install @llein/vn-currency-words

# Using pnpm
pnpm add @llein/vn-currency-words

# Using yarn
yarn add @llein/vn-currency-words
```

---

## 🚀 Quickstart

### 1. Basic Conversion

```typescript
import { numberToWords, docSoThanhChu } from '@llein/vn-currency-words';

console.log(numberToWords(1500000));
// "Một triệu năm trăm nghìn đồng"

console.log(numberToWords(101000, { suffix: 'đồng chẵn' }));
// "Một trăm linh một nghìn đồng chẵn"
```

### 2. North vs South Dialects

```typescript
// North dialect (default): nghìn, linh
console.log(numberToWords(101000, { dialect: 'north' }));
// "Một trăm linh một nghìn đồng"

// South dialect: ngàn, lẻ
console.log(numberToWords(101000, { dialect: 'south' }));
// "Một trăm lẻ một ngàn đồng"
```

### 3. Extremely Large Numbers (BigInt / String)

```typescript
console.log(numberToWords('1000000000000'));
// "Một nghìn tỷ đồng"

console.log(numberToWords(1000000000000000n));
// "Một triệu tỷ đồng"
```

### 4. Fast Currency Formatter

```typescript
import { formatVND } from '@llein/vn-currency-words';

console.log(formatVND(1500000)); // "1.500.000 ₫"
console.log(formatVND(-50000));  // "-50.000 ₫"
```

---

## 📖 API Reference

### `numberToWords(amount, options?)`

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `suffix` | `string` | `'đồng'` | Currency unit to append at the end |
| `dialect` | `'north' \| 'south'` | `'north'` | Regional reading preference |
| `capitalizeFirst` | `boolean` | `true` | Capitalize the first letter |
| `useTuInsteadOfBon` | `boolean` | `true` | Use "tư" instead of "bốn" (e.g. "hai mươi tư") |
| `negativePrefix` | `string` | `'âm'` | Prefix for negative numbers |
| `decimalMode` | `'point' \| 'subunit'` | `'point'` | How decimals are read |

---

## 📄 License

MIT © [llein](https://github.com/Llein-Dev)
