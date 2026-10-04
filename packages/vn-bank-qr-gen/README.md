# @llein/vn-bank-qr-gen

> Ultra-lightweight, zero-dependency VietQR (NAPAS 247) EMVCo payment payload generator & parser with full directory of 54+ Vietnamese banks.

[![npm version](https://img.shields.io/npm/v/@llein/vn-bank-qr-gen.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-bank-qr-gen)
[![npm downloads](https://img.shields.io/npm/dm/@llein/vn-bank-qr-gen.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-bank-qr-gen)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@llein/vn-bank-qr-gen?style=flat-square)](https://bundlephobia.com/package/@llein/vn-bank-qr-gen)
[![license](https://img.shields.io/npm/l/@llein/vn-bank-qr-gen.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Zero Dependencies**: Pure TypeScript, minimal footprint (< 3KB gzipped).
- **Official NAPAS 247 Standard**: Fully compliant with EMVCo QR Code Specification for Payment Systems (Tags 00, 01, 38, 53, 54, 58, 62, 63).
- **Bidirectional**: Both **generate** VietQR strings and **parse/decode** incoming VietQR payloads with CRC16-CCITT integrity verification.
- **54+ Banks Included**: Built-in directory of all Vietnamese banks (Vietcombank, MB, Techcombank, VPBank, ACB, BIDV, VietinBank, Timo, Cake, Viettel Money, VNPT Money, etc.).
- **Dual Export**: ESM (`.mjs`) and CommonJS (`.js`) with full TypeScript declarations (`.d.ts`).

---

## 📦 Installation

```bash
# Using npm
npm install vn-bank-qr-gen

# Using pnpm
pnpm add vn-bank-qr-gen

# Using yarn
yarn add vn-bank-qr-gen
```

---

## 🚀 Quickstart

### 1. Generate VietQR Payload & Image URL

```typescript
import { generateVietQR } from 'vn-bank-qr-gen';

// Dynamic QR (with predefined amount and message)
const qr = generateVietQR({
  bank: 'MB', // Can be Bank Code ('MB', 'VCB', 'TCB') or 6-digit BIN ('970422')
  accountNumber: '0981234567',
  amount: 150000,
  message: 'DH12345'
});

console.log(qr.qrContent);
// "00020101021238570010A00000072701270006970422011009812345670208QRIBFTTA530370454061500005802VN62110807DH123456304E8A9"

console.log(qr.qrImageUrl);
// "https://img.vietqr.io/image/970422-0981234567-compact.png?amount=150000&addInfo=DH12345"
```

### 2. Static QR (For storefront / cashier without fixed amount)

```typescript
import { generateVietQR } from 'vn-bank-qr-gen';

const staticQr = generateVietQR({
  bank: 'VCB',
  accountNumber: '1012345678'
});

console.log(staticQr.qrContent);
```

### 3. Parse & Verify an Incoming VietQR String

Extract bank account details and verify that the QR string was not tampered with:

```typescript
import { parseVietQR } from 'vn-bank-qr-gen';

const parsed = parseVietQR(qrString);

if (parsed.isValid && parsed.crcValid) {
  console.log(parsed.bank?.shortName); // "MBBank"
  console.log(parsed.accountNumber);   // "0981234567"
  console.log(parsed.amount);          // 150000
  console.log(parsed.message);         // "DH12345"
} else if (!parsed.crcValid) {
  console.error('Tampered QR code! Checksum mismatch.');
}
```

### 4. Search Bank Information

```typescript
import { findBank } from '@llein/vn-bank-qr-gen';

const bank = findBank('Techcombank');
console.log(bank);
// { bin: '970407', code: 'TCB', shortName: 'Techcombank', name: 'Ngân hàng TMCP Kỹ thương Việt Nam', supportNapas247: true }
```

### 5. React Custom Hook (`useVietQR`)

Tự động reactive sinh lại mã QR và link ảnh thanh toán mỗi khi state số tiền hoặc thông tin đơn hàng thay đổi:

```tsx
import React, { useState } from 'react';
import { useVietQR } from '@llein/vn-bank-qr-gen/react';

export function CheckoutModal({ orderId }) {
  const [amount, setAmount] = useState(150000);

  const { qrImageUrl, qrContent, isReady, error } = useVietQR({
    bank: 'MB',
    accountNumber: '0981234567',
    accountName: 'NGUYEN VAN A',
    amount,
    message: `THANH TOAN DH ${orderId}`
  });

  return (
    <div className="text-center p-4">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Nhập số tiền..."
      />

      {isReady && (
        <div className="mt-4">
          <img src={qrImageUrl} alt="Mã VietQR" className="mx-auto rounded-xl shadow-lg" />
          <p className="text-xs text-gray-500 mt-2 font-mono break-all">{qrContent}</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

---

## 📖 API Reference

| Function | Parameters | Returns | Description |
| :--- | :--- | :--- | :--- |
| `generateVietQR` | `(options: VietQROptions)` | `VietQRResult` | Generates EMVCo string and CDN image URL |
| `parseVietQR` | `(qrString: string)` | `ParsedVietQR` | Decodes QR string and validates CRC16 |
| `findBank` | `(keyword: string)` | `BankInfo \| undefined` | Looks up bank by BIN, Code, or Name |
| `crc16CCITT` | `(data: string)` | `string` | Calculates 4-hex CRC16-CCITT checksum |

---

## 📄 License

MIT © [Open Source Developer](./LICENSE)
