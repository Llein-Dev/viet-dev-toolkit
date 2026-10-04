# @llein/vn-plate-format

> Format, standardize and parse Vietnam vehicle license plates according to Circular 24/2023/TT-BCA.

[![npm version](https://img.shields.io/npm/v/@llein/vn-plate-format.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-plate-format)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-plate-format)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%203KB-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-plate-format)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Circular 24/2023/TT-BCA Compliant**: Supports 5-digit identification plates, 4-digit legacy plates, electric motorbikes, military, and diplomatic registrations.
- **Color & Vehicle Type Classification**: Accurately classifies plates into White (civilian), Yellow (commercial transport), Red (military), and Blue (state agency).
- **Province & Military Unit Mapping**: Complete lookup dictionary for all 63 Vietnam provinces and special military unit prefixes (`TM`, `TC`, `TH`, `QP`, `AA`, etc.).
- **Zero Dependencies & Blazing Fast**: Pure TypeScript, zero external dependencies, minified footprint < 3KB.
- **Dual Export**: Built with `tsup` supporting both **ESM** (`.mjs`) and **CommonJS** (`.js`).

---

## 📦 Installation

```bash
# Using npm
npm install @llein/vn-plate-format

# Using pnpm
pnpm add @llein/vn-plate-format

# Using yarn
yarn add @llein/vn-plate-format
```

---

## 🚀 Quickstart

```typescript
import { parseLicensePlate, formatLicensePlate, isValidLicensePlate } from '@llein/vn-plate-format';

// Parse civilian 5-digit car plate
const plate = parseLicensePlate('51K99999');
console.log(plate);
/*
{
  isValid: true,
  provinceCode: '51',
  province: 'Thành phố Hồ Chí Minh',
  series: 'K',
  number: '99999',
  formatted: '51K-999.99',
  compact: '51K99999',
  vehicleType: 'car',
  plateColor: 'white'
}
*/

// Motorbike plate formatting
console.log(formatLicensePlate('59p112345')); // "59-P1 123.45"

// Military plate detection
const military = parseLicensePlate('TM-1234');
console.log(military.province); // "Bộ Tổng tham mưu"
console.log(military.plateColor); // "red"
console.log(military.vehicleType); // "military"
```

---

## 📖 API Reference

### `parseLicensePlate(plate: string): PlateParseResult`
Parses raw plate string, removing extraneous symbols/whitespace, and extracts detailed metadata.

### `formatLicensePlate(plate: string): string`
Returns officially formatted plate number (e.g. `51K-999.99`, `29-P1 123.45`).

### `isValidLicensePlate(plate: string): boolean`
Fast boolean check for valid Vietnamese plate patterns.

### `getPlateProvince(codeOrPlate: string): string | undefined`
Resolves 2-digit province code (e.g. `"51"` -> `"Thành phố Hồ Chí Minh"`) or unit code.

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

MIT © [Llein-Dev](https://github.com/Llein-Dev)
