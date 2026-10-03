# @llein/realtime-number-mask

> Ultra-modern, high-performance real-time number and currency input mask with **$O(1)$ Virtual Caret Projection Matrix**, native `Intl` locale auto-detection, zero-flicker W3C `beforeinput` interception, and Autonomous Web Component `<realtime-number-input>`.

[![npm version](https://img.shields.io/npm/v/@llein/realtime-number-mask.svg?style=flat-square)](https://www.npmjs.com/package/@llein/realtime-number-mask)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ Cutting-Edge Architecture

1. **$O(1)$ Virtual Caret Projection Matrix (TypedArray)**:
   - Uses Monaco/Blink-style `Int32Array` projection mapping between raw digits and formatted string indices.
   - Caret position preservation operates in true $O(1)$ lookup time with **0 cursor jumps** when inserting or deleting digits anywhere in the input.
2. **Native `Intl.NumberFormat` Engine (150+ Locales)**:
   - Directly queries the browser's C++ ICU engine via `formatToParts()` to resolve thousand and decimal separators automatically (`vi-VN`, `en-US`, `de-DE`, `fr-FR`, etc.) with zero external runtime dependencies.
3. **Autonomous Web Component (`<realtime-number-input>`)**:
   - Registered via `customElements.define` for native drop-in usage across React 19, Vue 3, Svelte 5, Angular 17, Astro, or plain HTML.
4. **W3C `beforeinput` Zero-Flicker Interception**:
   - Pre-filters non-numeric characters before DOM mutation occurs, eliminating visual flickering and unwanted layout thrashing.
5. **Mobile Virtual Keyboard Auto-Adaptation**:
   - Automatically sets `inputmode="numeric"` or `"decimal"`, disabling intrusive autocomplete/autocorrect popups.
6. **Smart Navigation & Backspace Stepping**:
   - Arrow keys (`ArrowLeft`, `ArrowRight`) seamlessly step over grouping separators. Backspacing a thousand separator deletes the adjacent digit directly.

---

## 📦 Installation

```bash
npm install @llein/realtime-number-mask
```

---

## 🛠️ Usage

### 1. Vanilla HTML / JavaScript (DOM Attachment)

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

### 2. Autonomous Web Component (`<realtime-number-input>`)

Works in any framework (React, Vue, Svelte, Angular, Solid) or plain HTML without wrapper libraries:

```html
<script type="module" src="node_modules/@llein/realtime-number-mask/dist/index.mjs"></script>

<!-- Vietnamese Currency -->
<realtime-number-input
  thousand-separator="."
  suffix=" ₫"
  value="1000000"
></realtime-number-input>

<!-- US Currency with 2 decimals -->
<realtime-number-input
  locale="en-US"
  precision="2"
  prefix="$"
  value="1500.50"
></realtime-number-input>
```

### 3. Headless React / Controlled Component (`createNumberMaskState`)

```tsx
import React, { useState } from 'react';
import { createNumberMaskState } from '@llein/realtime-number-mask';

const maskState = createNumberMaskState({ thousandSeparator: ',', precision: 0 });

export function CurrencyInput() {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursorPos = e.target.selectionStart ?? e.target.value.length;
    const next = maskState.calculateNextState(e.target.value, cursorPos);
    setValue(next.formatted);
    // next.numericValue contains raw number
  };

  return <input value={value} onChange={handleChange} />;
}
```

### 4. Pure Functional Utilities (No DOM required)

```typescript
import { formatNumber, unformatNumber, getNumericValue, getLocaleSeparators, EURO_PRESET } from '@llein/realtime-number-mask';

// Auto-detect separators from BCP-47 locale
formatNumber(5000000, { locale: 'vi-VN' }); // "5.000.000"
formatNumber(5000000, { locale: 'en-US' }); // "5,000,000"

// Euro preset
formatNumber(1500000.5, EURO_PRESET); // "€1.500.000,5"

// Extract numeric values
unformatNumber('1.500.000 ₫'); // "1500000"
getNumericValue('1.500.000,50 ₫', { decimalSeparator: ',' }); // 1500000.5
```

---

## ⚙️ Options

| Option | Type | Default | Description |
|---|---|:---:|---|
| `locale` | `string` | `undefined` | BCP 47 locale tag (`'vi-VN'`, `'en-US'`, `'de-DE'`) for auto-resolving separators |
| `thousandSeparator` | `string` | `','` | Grouping separator for thousands (e.g. `','`, `'.'`) |
| `decimalSeparator` | `string` | `'.'` | Fraction separator for decimals |
| `precision` | `number` | `0` | Decimal precision limit (`0` for integer / VND) |
| `allowNegative` | `boolean` | `false` | Enable negative sign `-` support |
| `prefix` | `string` | `''` | Fixed prefix (e.g. `'$'`, `'US$ '`) |
| `suffix` | `string` | `''` | Fixed suffix (e.g. `' ₫'`, `' VND'`) |
| `smartArrowNavigation` | `boolean` | `true` | Caret automatically steps over thousand separators |
| `autoInputMode` | `boolean` | `true` | Automatically optimizes mobile virtual keyboard |
| `max` | `number \| bigint` | `undefined` | Numerical upper boundary |
| `min` | `number \| bigint` | `undefined` | Numerical lower boundary |
| `onChange` | `(details) => void` | `undefined` | Real-time formatted and raw value change callback |

---

## 📄 License

MIT © [Llein-Dev](https://github.com/Llein-Dev)
