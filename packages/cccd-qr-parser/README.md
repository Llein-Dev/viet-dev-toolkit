# cccd-qr-parser

> Parse static QR Code strings printed on Vietnamese chip-based citizen identity cards into standardized citizen profile fields.

[![npm version](https://img.shields.io/npm/v/cccd-qr-parser.svg?style=flat-square)](https://www.npmjs.com/package/cccd-qr-parser)
[![npm downloads](https://img.shields.io/npm/dm/cccd-qr-parser.svg?style=flat-square)](https://www.npmjs.com/package/cccd-qr-parser)
[![bundle size](https://img.shields.io/bundlephobia/minzip/cccd-qr-parser?style=flat-square)](https://bundlephobia.com/package/cccd-qr-parser)
[![license](https://img.shields.io/npm/l/cccd-qr-parser.svg?style=flat-square)](./LICENSE)

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
npm install cccd-qr-parser

# Using pnpm
pnpm add cccd-qr-parser

# Using yarn
yarn add cccd-qr-parser
```

---

## 🚀 Quickstart

```typescript
import { parseCCCDQr } from 'cccd-qr-parser';

// Format printed on CCCD: CCCD|OldCMND|FullName|DOB|Gender|Address|IssueDate
const qrData = '001095012345||Nguyễn Văn An|25101995|Nam|123 Phố Huế, Hà Nội|10122021';
const citizen = parseCCCDQr(qrData);

console.log(citizen.fullName); // "Nguyễn Văn An"
console.log(citizen.cccd);     // "001095012345"
console.log(citizen.gender);   // "Nam"
```

---

## 📖 API Reference

- `parseCCCDQr(qrString: string): ParsedCitizenQr`

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
