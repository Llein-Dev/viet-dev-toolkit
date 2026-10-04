# @llein/vn-tax-id-validator

> Validate, format, and parse Vietnam Tax Identification Numbers (Mã số thuế - MST 10 and 13 digits) using official Checksum Modulo-11 algorithm (Circular 105/2020/TT-BTC).

[![npm version](https://img.shields.io/npm/v/@llein/vn-tax-id-validator.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-tax-id-validator)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-tax-id-validator)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%203KB-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-tax-id-validator)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Official Modulo-11 Checksum**: Accurately implements the mathematical weights `[31, 29, 23, 19, 17, 13, 7, 5, 3]` specified by the Vietnam General Department of Taxation.
- **Enterprise & Branch Support**: Handles 10-digit primary enterprise tax codes and 13-digit dependent branch codes (`XXXXXXXXXX-YYY`).
- **Province Detection**: Resolves the issuing province / city from the first 2 digits across all 63 Vietnam provinces.
- **CCCD Personal Tax Code**: Compatible with 12-digit citizen ID format under the Law on Identification 2023.
- **Testing & Fixture Helpers**: Includes `generateMockTaxId()` to generate valid mock MSTs for e-invoicing and accounting test suites.
- **Zero Dependencies**: Pure TypeScript, tiny footprint (< 3KB).

---

## 📦 Installation

```bash
# Using npm
npm install @llein/vn-tax-id-validator

# Using pnpm
pnpm add @llein/vn-tax-id-validator

# Using yarn
yarn add @llein/vn-tax-id-validator
```

---

## 🚀 Quickstart

```typescript
import { validateTaxId, isValidTaxId, formatTaxId } from '@llein/vn-tax-id-validator';

// 1. Validate enterprise tax code
const res = validateTaxId('0300588569'); // Vinamilk
console.log(res.isValid);      // true
console.log(res.type);         // "enterprise"
console.log(res.provinceName); // "Thành phố Hồ Chí Minh"
console.log(res.checkDigit);   // 9

// 2. Validate branch tax code (13 digits)
const branch = validateTaxId('0100109106001'); // Viettel branch
console.log(branch.isValid);   // true
console.log(branch.type);      // "branch"
console.log(branch.formatted); // "0100109106-001"

// 3. Fast boolean check
console.log(isValidTaxId('0100109107')); // false (checksum error)
```

---

## 📖 API Reference

### `validateTaxId(taxId: string): TaxValidationResult`
Full validation returning detailed metadata:
```typescript
interface TaxValidationResult {
  isValid: boolean;
  raw: string;
  formatted: string;
  type?: 'enterprise' | 'branch' | 'personal_10' | 'personal_cccd';
  baseTaxId?: string;
  branchCode?: string;
  provinceCode?: string;
  provinceName?: string;
  checkDigit?: number;
  expectedCheckDigit?: number;
  error?: string;
}
```

### `isValidTaxId(taxId: string): boolean`
Quick boolean check for valid tax identification numbers.

### `formatTaxId(taxId: string): string`
Standardizes into `XXXXXXXXXX` or `XXXXXXXXXX-YYY`.

### `generateMockTaxId(options?: { province?: string; branch?: boolean | string }): string`
Generates syntactically and mathematically valid tax IDs for test suites.

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

MIT © [Llein-Dev](https://github.com/Llein-Dev)
