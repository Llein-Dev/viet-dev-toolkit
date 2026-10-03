# vn-tax-id-validator

> Validate and format Vietnam Tax Identification Numbers (Mã số thuế - MST 10 and 13 digits) using official Checksum Modulo-11 algorithm.

[![npm version](https://img.shields.io/npm/v/vn-tax-id-validator.svg?style=flat-square)](https://www.npmjs.com/package/vn-tax-id-validator)
[![npm downloads](https://img.shields.io/npm/dm/vn-tax-id-validator.svg?style=flat-square)](https://www.npmjs.com/package/vn-tax-id-validator)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-tax-id-validator?style=flat-square)](https://bundlephobia.com/package/vn-tax-id-validator)
[![license](https://img.shields.io/npm/l/vn-tax-id-validator.svg?style=flat-square)](./LICENSE)

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
npm install vn-tax-id-validator

# Using pnpm
pnpm add vn-tax-id-validator

# Using yarn
yarn add vn-tax-id-validator
```

---

## 🚀 Quickstart

```typescript
import { validateTaxId, formatTaxId } from 'vn-tax-id-validator';

const result = validateTaxId('0100109106');
console.log(result.isValid); // true
console.log(result.type);    // "enterprise"

const branchResult = validateTaxId('0100109106-001');
console.log(branchResult.isValid); // true
console.log(branchResult.type);    // "branch"
```

---

## 📖 API Reference

- `validateTaxId(taxId: string): TaxValidationResult`
- `formatTaxId(taxId: string): string`
- `isEnterpriseTaxId(taxId: string): boolean`

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
