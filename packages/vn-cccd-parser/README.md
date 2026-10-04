# @llein/vn-cccd-parser

> Comprehensive, zero-dependency parser & validator for Vietnam Citizen Identity Cards (CCCD / VNeID) and Chip QR Codes according to the Vietnam Citizen Identity Law.

[![npm version](https://img.shields.io/npm/v/@llein/vn-cccd-parser.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-cccd-parser)
[![npm downloads](https://img.shields.io/npm/dm/@llein/vn-cccd-parser.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-cccd-parser)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@llein/vn-cccd-parser?style=flat-square)](https://bundlephobia.com/package/@llein/vn-cccd-parser)
[![license](https://img.shields.io/npm/l/@llein/vn-cccd-parser.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Zero Dependencies**: Pure TypeScript, minimal footprint (< 3KB gzipped).
- **Comprehensive Data**: Full official mapping of all 63 Vietnam provinces/cities, regions (Bắc / Trung / Nam), and municipality flags.
- **Law-Compliant**: Covers centuries 20 through 24 (1900 to 2399) and renewal milestones at ages 25, 40, and 60 (Luật Căn cước Việt Nam).
- **Chip QR Parser**: Decode raw QR code strings printed on chip-based CCCD and verify cross-field consistency.
- **Mock Data Generator**: Generate valid CCCD numbers for testing and database seeds.
- **Dual Export**: ESM (`.mjs`) and CommonJS (`.js`) with full TypeScript declarations (`.d.ts`).

---

## 📦 Installation

```bash
# Using npm
npm install vn-cccd-parser

# Using pnpm
pnpm add vn-cccd-parser

# Using yarn
yarn add vn-cccd-parser
```

---

## 🚀 Quickstart

### 1. Parse 12-Digit CCCD Number

```typescript
import { parseCCCD } from 'vn-cccd-parser';

const result = parseCCCD('001095012345');

if (result.isValid) {
  console.log(result.province);        // "Thành phố Hà Nội"
  console.log(result.region);          // "Miền Bắc"
  console.log(result.isMunicipality);  // true
  console.log(result.gender);          // "Nam"
  console.log(result.birthYear);       // 1995
  console.log(result.age);             // 31
  console.log(result.renewalMilestones);
  // {
  //   age25Year: 2020,
  //   age40Year: 2035,
  //   age60Year: 2055,
  //   nextRenewalYear: 2035,
  //   isExpired: false
  // }
}
```

### 2. Parse Chip CCCD QR Code

```typescript
import { parseCCCDQr } from 'vn-cccd-parser';

// Format: CCCD|OldCMND|FullName|DOB|Gender|Address|IssueDate
const qrString = '001095012345|012345678|Nguyễn Văn An|25101995|Nam|123 Phố Huế, Hà Nội|10122021';
const citizen = parseCCCDQr(qrString);

console.log(citizen.fullName);     // "Nguyễn Văn An"
console.log(citizen.dateOfBirth);  // "1995-10-25"
console.log(citizen.isConsistent); // true (CCCD number matches DOB and gender)
```

### 3. Generate Mock Data for Tests

```typescript
import { generateMockCCCD } from 'vn-cccd-parser';

const mockHanoi = generateMockCCCD({ provinceCode: '001', gender: 'Nữ', birthYear: 2002 });
console.log(mockHanoi); // e.g. "001302847291"
```

---

## 📖 API Reference

### Functions

| Function | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `parseCCCD` | `(id: string)` | `CCCDParseResult` | Parses 12-digit CCCD and returns full profile |
| `isValidCCCD` | `(id: string)` | `boolean` | Quick boolean validator |
| `parseCCCDQr` | `(qrString: string)` | `CCCDQrResult` | Parses chip CCCD QR code payload |
| `getRenewalMilestones` | `(birthYear, currentYear?)` | `RenewalMilestones` | Calculates ages 25, 40, 60 renewal deadlines |
| `generateMockCCCD` | `(options?)` | `string` | Generates a valid 12-digit mock CCCD |

---

## 📄 License

MIT © [Open Source Developer](./LICENSE)
