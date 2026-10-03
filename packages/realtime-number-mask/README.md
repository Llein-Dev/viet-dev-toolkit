# @llein/realtime-number-mask

> High-performance, zero-dependency real-time number and currency input mask with **flawless cursor position preservation** for HTML inputs, web forms, and fintech applications.

[![npm version](https://img.shields.io/npm/v/@llein/realtime-number-mask.svg?style=flat-square)](https://www.npmjs.com/package/@llein/realtime-number-mask)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## 🚀 Key Features

- **Flawless Cursor Position Preservation**: Caret never jumps to the end when typing or deleting characters in the middle of digits.
- **Real-Time Input Masking**: Auto-inserts thousand separators (`,` or `.`) as the user types.
- **Smart Backspace/Delete Handling**: Deleting directly against thousand separators removes the adjacent digit cleanly without getting stuck.
- **Unmasked Raw Values**: Easily retrieve the clean numeric string (`1500000`), JavaScript float (`1500000`), or `BigInt`.
- **Preconfigured Presets**:
  - `VIETNAM_VND_PRESET`: `1.500.000 ₫` (dots for thousands, comma for decimal, `₫` suffix).
  - `INTERNATIONAL_USD_PRESET`: `$1,500.50` (commas for thousands, dot for decimal, `$` prefix).
- **Zero Dependencies**: 100% pure TypeScript, ultra-lightweight (< 3KB gzipped), dual ESM/CJS.

---

## 📦 Installation

```bash
npm install @llein/realtime-number-mask
```

---

## 🛠️ Usage

### 1. Vanilla HTML / JavaScript

```html
<input id="price-input" type="text" placeholder="Nhập số tiền..." />

<script type="module">
  import { attachNumberMask, VIETNAM_VND_PRESET } from '@llein/realtime-number-mask';

  const input = document.getElementById('price-input');

  // Attach mask to input
  const mask = attachNumberMask(input, {
    ...VIETNAM_VND_PRESET,
    onChange: (details) => {
      console.log('Formatted:', details.formatted);       // "1.500.000 ₫"
      console.log('Raw string:', details.raw);             // "1500000"
      console.log('Numeric value:', details.numericValue); // 1500000
      console.log('BigInt value:', details.bigIntValue);   // 1500000n
    }
  });

  // Programmatically set value
  mask.setValue(2500000);

  // Clean up when removing input
  // mask.destroy();
</script>
```

### 2. Pure Functions (No DOM required)

```typescript
import { formatNumber, unformatNumber, getNumericValue } from '@llein/realtime-number-mask';

// Format
formatNumber(1500000); // "1,500,000"
formatNumber(1500000, { thousandSeparator: '.', suffix: ' ₫' }); // "1.500.000 ₫"

// Unformat
unformatNumber('1.500.000 ₫'); // "1500000"
getNumericValue('1.500.000 ₫'); // 1500000
```

---

## ⚙️ Options

| Option | Type | Default | Description |
|---|---|:---:|---|
| `thousandSeparator` | `string` | `','` | Character grouping thousands (e.g. `','`, `'.'`) |
| `decimalSeparator` | `string` | `'.'` | Character separating decimal fractions |
| `precision` | `number` | `0` | Decimal precision limit (`0` for integer / VND) |
| `allowNegative` | `boolean` | `false` | Allow negative values with `-` |
| `prefix` | `string` | `''` | String preceding the digits (e.g. `'$'`) |
| `suffix` | `string` | `''` | String following the digits (e.g. `' ₫'`, `' VND'`) |
| `max` | `number \| bigint` | `undefined` | Upper numerical cap |
| `min` | `number \| bigint` | `undefined` | Lower numerical floor |
| `onChange` | `(details) => void` | `undefined` | Real-time value change callback |

---

## 📄 License

MIT © [Llein-Dev](https://github.com/Llein-Dev)
