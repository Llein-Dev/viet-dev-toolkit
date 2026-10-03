# @llein/vn-phone-carrier

> Detect Vietnamese mobile network operators (Viettel, Vina, Mobi, Vietnamobile, Wintel, I-Telecom), 11-to-10 digit migration, and E.164 phone formatting.

[![npm version](https://img.shields.io/npm/v/@llein/vn-phone-carrier.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-phone-carrier)
[![npm downloads](https://img.shields.io/npm/dm/@llein/vn-phone-carrier.svg?style=flat-square)](https://www.npmjs.com/package/@llein/vn-phone-carrier)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@llein/vn-phone-carrier?style=flat-square)](https://bundlephobia.com/package/@llein/vn-phone-carrier)
[![license](https://img.shields.io/npm/l/@llein/vn-phone-carrier.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **Complete Operator Coverage**: Detects Viettel, VinaPhone, MobiFone, Vietnamobile, Wintel (055), I-Telecom (087), and Gmobile (099, 059).
- **Auto 11-to-10 Migration**: Converts legacy 11-digit prefixes from the MIC 2018 migration (e.g. `0168xxxxxxx` -> `038xxxxxxx`, `0120xxxxxxx` -> `070xxxxxxx`).
- **Standard Formatting**: Formats into `pretty` (`0987 654 321`), `dots` (`0987.654.321`), `dashes` (`0987-654-321`), or `e164` (`+84987654321`).
- **Privacy Masking**: Built-in `maskPhone()` for OTP, checkout, and SMS verification UIs (e.g. `0987***321`).
- **Zero Dependencies**: Pure TypeScript, minified < 2KB.

---

## 📦 Installation

```bash
# Using npm
npm install @llein/vn-phone-carrier

# Using pnpm
pnpm add @llein/vn-phone-carrier

# Using yarn
yarn add @llein/vn-phone-carrier
```

---

## 🚀 Quickstart

```typescript
import { parseVNPhone, getCarrier, formatPhone, maskPhone } from '@llein/vn-phone-carrier';

// 1. Parse and detect operator
const info = parseVNPhone('+84987654321');
console.log(info.carrier); // "Viettel"
console.log(info.national); // "0987654321"
console.log(info.e164); // "+84987654321"

// 2. Legacy 11-digit auto migration
const legacy = parseVNPhone('0168 123 4567');
console.log(legacy.national); // "0381234567"
console.log(legacy.wasMigratedFrom11Digits); // true

// 3. Mask phone for OTP verification screen
console.log(maskPhone('0987654321')); // "0987***321"

// 4. Formatting styles
console.log(formatPhone('0987654321', 'pretty')); // "0987 654 321"
console.log(formatPhone('0987654321', 'dots'));   // "0987.654.321"
```

---

## ⚛️ React Custom Hook (`useVNPhone`)

Tự động nhận diện nhà mạng, kiểm tra tính hợp lệ và lấy màu thương hiệu (Brand Color) thời gian thực khi người dùng nhập số điện thoại trong form:

```tsx
import React, { useState } from 'react';
import { useVNPhone } from '@llein/vn-phone-carrier/react';

export function PhoneField() {
  const [phone, setPhone] = useState('');
  const { carrier, isValid, brandColor, formattedPretty, lineType, e164 } = useVNPhone(phone);

  return (
    <div className="space-y-2">
      <label>Số điện thoại:</label>
      <div className="relative">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="VD: 098 765 4321"
          className="border rounded-xl px-4 py-2 w-full pr-28"
        />
        {carrier && carrier !== 'Unknown' && (
          <span
            style={{ backgroundColor: brandColor }}
            className="absolute right-2 top-2 px-2.5 py-1 text-xs text-white rounded-lg font-bold"
          >
            {carrier}
          </span>
        )}
      </div>

      {isValid && (
        <p className="text-xs text-emerald-600">
          Hợp lệ: {formattedPretty} (Chuẩn quốc tế: {e164})
        </p>
      )}
    </div>
  );
}
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

MIT © [Llein-Dev](https://github.com/Llein-Dev)
