# @llein/vn-number-humanize

> Ultra-lightweight, zero-dependency Vietnamese compact number and byte humanizer (`1,5 triệu`, `2,3 tỷ`, `1,5 GB`) with native `BigInt` support and official React Hook.

[![npm version](https://img.shields.io/npm/v/@llein/vn-number-humanize.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-number-humanize)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-number-humanize)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%201.5KB-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-number-humanize)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Standard Vietnamese Scales**: Natural Vietnamese spoken numbers (`nghìn`, `triệu`, `tỷ`, `nghìn tỷ`, `triệu tỷ`).
- **Flexible Formats**:
  - `standard`: `1,5 triệu`, `2,3 tỷ` (comma `,` decimal separator).
  - `short`: `1.5tr`, `2.3tỷ`, `50k`.
  - `compact`: `1.5M`, `2.3B`, `50K`.
- **Vietnamese Pretty Bytes**: Natural computer storage formatter with comma decimal standard (`1,54 GB`, `256 MB`, `1 GiB`).
- **Native BigInt Support**: Safely formats astronomical numbers exceeding `Number.MAX_SAFE_INTEGER` without precision loss.
- **Official React Hook**: `useVNNumber` and `useVNBytes` exported via `@llein/vn-number-humanize/react`.
- **Zero Dependencies**: Pure TypeScript, bundle size < 1.5 KB minzipped.

---

## 📦 Installation

```bash
npm install @llein/vn-number-humanize
```

---

## 🚀 Usage

### 1. Natural Vietnamese Numbers

```ts
import { humanizeVNNumber } from '@llein/vn-number-humanize';

// Millions & Billions
humanizeVNNumber(1500000);              // "1,5 triệu"
humanizeVNNumber(2300000000);           // "2,3 tỷ"
humanizeVNNumber(12500);                // "12,5 nghìn"

// Currency suffix
humanizeVNNumber(2500000, { currency: ' ₫' });    // "2,5 triệu ₫"
humanizeVNNumber(5000000000, { currency: ' VND' }); // "5 tỷ VND"

// Short & Compact formats
humanizeVNNumber(1500000, { style: 'short' });    // "1.5tr"
humanizeVNNumber(2300000000, { style: 'short' }); // "2.3tỷ"
humanizeVNNumber(50000, { style: 'short' });      // "50k"

// BigInt support
humanizeVNNumber(1500000000000000n);    // "1,5 triệu tỷ"
```

### 2. Vietnamese Byte Humanizer (Pretty Bytes)

```ts
import { humanizeVNBytes } from '@llein/vn-number-humanize';

humanizeVNBytes(1536000000);            // "1,54 GB"
humanizeVNBytes(1048576, { binary: true }); // "1 MiB"
humanizeVNBytes(500);                   // "500 B"
```

### 3. React Hook Integration

```tsx
import { useVNNumber, useVNBytes } from '@llein/vn-number-humanize/react';

function ProductCard({ price, fileSize }: { price: number; fileSize: number }) {
  const formattedPrice = useVNNumber(price, { currency: ' ₫' });
  const readableSize = useVNBytes(fileSize);

  return (
    <div>
      <p>Giá: {formattedPrice}</p>      {/* "1,5 triệu ₫" */}
      <p>Dung lượng: {readableSize}</p> {/* "2,4 GB" */}
    </div>
  );
}
```

---

## 📄 License

MIT © [llein](https://github.com/Llein-Dev)
