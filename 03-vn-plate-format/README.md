# vn-plate-format

> Format, standardize and parse Vietnam vehicle license plates according to Circular 24/2023/TT-BCA.

[![npm version](https://img.shields.io/npm/v/vn-plate-format.svg?style=flat-square)](https://www.npmjs.com/package/vn-plate-format)
[![npm downloads](https://img.shields.io/npm/dm/vn-plate-format.svg?style=flat-square)](https://www.npmjs.com/package/vn-plate-format)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-plate-format?style=flat-square)](https://bundlephobia.com/package/vn-plate-format)
[![license](https://img.shields.io/npm/l/vn-plate-format.svg?style=flat-square)](./LICENSE)

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
npm install vn-plate-format

# Using pnpm
pnpm add vn-plate-format

# Using yarn
yarn add vn-plate-format
```

---

## 🚀 Quickstart

```typescript
import { parseLicensePlate, formatLicensePlate } from 'vn-plate-format';

const plate = parseLicensePlate('51K99999');
console.log(plate.province);    // "Thành phố Hồ Chí Minh"
console.log(plate.vehicleType); // "car"
console.log(plate.formatted);   // "51K-999.99"
```

---

## 📖 API Reference

- `parseLicensePlate(plate: string): PlateParseResult`
- `formatLicensePlate(plate: string): string`
- `getPlateProvince(plateCode: string): string | undefined`

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
