# vn-phone-carrier

> Detect Vietnamese mobile network operators (Viettel, Vina, Mobi, Vietnamobile, Wintel, I-Telecom) and validate national phone numbers.

[![npm version](https://img.shields.io/npm/v/vn-phone-carrier.svg?style=flat-square)](https://www.npmjs.com/package/vn-phone-carrier)
[![npm downloads](https://img.shields.io/npm/dm/vn-phone-carrier.svg?style=flat-square)](https://www.npmjs.com/package/vn-phone-carrier)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-phone-carrier?style=flat-square)](https://bundlephobia.com/package/vn-phone-carrier)
[![license](https://img.shields.io/npm/l/vn-phone-carrier.svg?style=flat-square)](./LICENSE)

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
npm install vn-phone-carrier

# Using pnpm
pnpm add vn-phone-carrier

# Using yarn
yarn add vn-phone-carrier
```

---

## 🚀 Quickstart

```typescript
import { parseVNPhone, isVNPhoneValid } from 'vn-phone-carrier';

const phone = parseVNPhone('+84 981 234 567');
console.log(phone.carrier);      // "Viettel"
console.log(phone.formatE164);   // "+84981234567"
console.log(phone.formatNational);// "0981234567"
```

---

## 📖 API Reference

- `parseVNPhone(phone: string): VNPhoneResult`
- `isVNPhoneValid(phone: string): boolean`
- `getCarrier(phone: string): string | undefined`

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
