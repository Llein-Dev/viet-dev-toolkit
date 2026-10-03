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

## 🇻🇳 Điểm Nhấn Công Nghệ & Trải Nghiệm Lập Trình Viên

- **Format số tự động thời gian thực (Real-time Masking)**: Khi người dùng gõ phím, chuỗi số tự động được phân tách hàng nghìn (`1,000,000` hoặc `1.000.000 ₫`) mượt mà không có độ trễ.
- **Giữ vị trí con trỏ chuột tuyệt đối (Flawless Caret Preservation)**: Áp dụng thuật toán **$O(1)$ TypedArray Projection Matrix**, khi người dùng xóa hoặc chèn thêm số vào giữa hay đầu chuỗi, con trỏ chuột sẽ giữ nguyên đúng vị trí logic của con số đang gõ thay vì bị văng/nhảy về cuối ô nhập liệu như các thư viện thông thường.
- **Tương thích toàn bộ Framework qua Web Component**: Không cần cài thêm wrapper cho React, Vue, Svelte hay Angular. Chỉ cần dùng thẻ `<realtime-number-input>` là có ngay input xịn sò với 0 dependencies.
- **Zero Flicker với W3C `beforeinput`**: Chặn các ký tự không hợp lệ (chữ cái, ký tự lạ) trước khi kịp render vào DOM.
- **Tối ưu Mobile Keypad**: Tự động mở bàn phím số (numeric/decimal keypad) trên điện thoại và tắt gợi ý từ rườm rà.

---

## 📦 Cài Đặt (Installation)

```bash
npm install @llein/realtime-number-mask
# hoặc dùng yarn, pnpm, bun:
# pnpm add @llein/realtime-number-mask
```

---

## 📖 Hướng Dẫn Tích Hợp Chi Tiết Vào Input (Step-by-Step Integration Guide)

### 🌟 Cách 1: HTML Thuần / JavaScript / PHP / Laravel (Gắn vào thẻ `<input>` có sẵn)

Gắn trực tiếp vào bất kỳ thẻ `<input>` nào trên trang web để kích hoạt định dạng tiền tệ / số tự động:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Tích hợp Input Mask</title>
</head>
<body>

  <!-- Thẻ input của bạn -->
  <label for="price">Số tiền nạp ví:</label>
  <input id="price" type="text" placeholder="VD: 1.000.000 ₫" />

  <button id="btn-submit">Xác nhận thanh toán</button>

  <script type="module">
    import { attachNumberMask, VIETNAM_VND_PRESET } from './node_modules/@llein/realtime-number-mask/dist/index.mjs';
    // Hoặc import { attachNumberMask, VIETNAM_VND_PRESET } from '@llein/realtime-number-mask';

    const input = document.getElementById('price');

    // 1. Kích hoạt mask trên thẻ input
    const mask = attachNumberMask(input, {
      ...VIETNAM_VND_PRESET, // Dấu chấm nghìn, hậu tố " ₫"
      onChange: (detail) => {
        console.log('Hiển thị trên input:', detail.formatted);   // "1.500.000 ₫"
        console.log('Chuỗi số sạch (raw):', detail.raw);          // "1500000"
        console.log('Số nguyên gửi API:', detail.numericValue);   // 1500000
      }
    });

    // 2. Gán giá trị ban đầu bằng code (nếu cần):
    mask.setValue(2500000); // Tự format thành: "2.500.000 ₫"

    // 3. Khi submit form, lấy số chuẩn để gửi lên Backend:
    document.getElementById('btn-submit').addEventListener('click', () => {
      const amountToSend = mask.getNumericValue(); // 2500000 (number)
      fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountToSend })
      });
    });
  </script>
</body>
</html>
```

---

### 🚀 Cách 2: Dùng Autonomous Web Component `<realtime-number-input>` (0 Boilerplate)

Chỉ cần import script 1 lần, bạn có thể dùng thẻ `<realtime-number-input>` trực tiếp trong **HTML, React, Vue, Svelte, Angular, Astro**:

```html
<script type="module" src="node_modules/@llein/realtime-number-mask/dist/index.mjs"></script>

<!-- Định dạng tiền VND -->
<realtime-number-input 
  id="my-vnd-input"
  thousand-separator="." 
  suffix=" ₫" 
  value="1500000">
</realtime-number-input>

<!-- Định dạng USD có 2 số thập phân -->
<realtime-number-input 
  locale="en-US"
  precision="2" 
  prefix="$" 
  value="1250.50">
</realtime-number-input>

<script>
  const el = document.getElementById('my-vnd-input');
  
  el.addEventListener('change', (e) => {
    console.log('Số tiền thực tế:', el.numericValue); // 1500000 (number)
    console.log('Chuỗi số thô:', el.value);            // "1500000" (string)
  });
</script>
```

---

### ⚛️ Cách 3: React / Next.js với Custom Hook Chính Chủ `useNumberMask`

Thư viện tích hợp sẵn **Custom Hook `useNumberMask`** chính chủ. Chỉ cần 1 dòng gọi hook là có ngay `ref`, `numericValue`, `formattedValue`, và hàm `setValue`:

```tsx
import React from 'react';
import { useNumberMask } from '@llein/realtime-number-mask/react';
// Hoặc import { useNumberMask } from '@llein/realtime-number-mask';
import { VIETNAM_VND_PRESET } from '@llein/realtime-number-mask';

export default function CheckoutPage() {
  const { 
    ref,             // Gắn vào input: <input ref={ref} />
    numericValue,    // Giá trị số thực tế: 1500000 (number)
    formattedValue,  // Chuỗi hiển thị: "1.500.000 ₫"
    rawValue,        // Chuỗi số sạch: "1500000"
    setValue,        // Hàm gán giá trị bằng code: setValue(5000000)
    clear            // Hàm xóa rỗng: clear()
  } = useNumberMask({
    ...VIETNAM_VND_PRESET,
    defaultValue: 1500000,
    onChange: (details) => {
      console.log('Người dùng gõ:', details.numericValue);
    }
  });

  const handlePay = () => {
    // Gửi numericValue lên API:
    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: numericValue })
    });
  };

  return (
    <div className="space-y-4 p-6 max-w-md mx-auto">
      <label className="block text-sm font-semibold">Nhập số tiền chuyển khoản:</label>
      
      {/* 🚀 GẮN REF VÀO INPUT LÀ XONG! */}
      <input
        ref={ref}
        placeholder="0 ₫"
        className="w-full border rounded-xl px-4 py-3 text-lg font-mono text-right"
      />

      <div className="flex justify-between text-sm text-gray-500">
        <span>Số tiền API nhận: <b>{numericValue.toLocaleString('vi-VN')} VND</b></span>
        <button onClick={() => setValue(5000000)} className="text-blue-500 underline">
          Gán nhanh 5 Tr
        </button>
      </div>

      <button onClick={handlePay} className="w-full bg-emerald-600 text-white py-3 rounded-xl">
        Thanh toán
      </button>
    </div>
  );
}
```

---

### 🟢 Cách 4: Tích hợp vào Vue 3 / Nuxt 3 (Custom Directive `v-number-mask`)

```vue
<script setup>
import { ref } from 'vue';
import { attachNumberMask, VIETNAM_VND_PRESET } from '@llein/realtime-number-mask';

// Directive tự động attach và clean up mask
const vNumberMask = {
  mounted(el, binding) {
    const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
    el._mask = attachNumberMask(input, {
      ...VIETNAM_VND_PRESET,
      ...binding.value,
      onChange: (details) => {
        binding.value?.onChange?.(details);
      }
    });
  },
  unmounted(el) {
    el._mask?.destroy();
  }
};

const numericAmount = ref(0);
const onAmountChange = (details) => {
  numericAmount.value = details.numericValue;
};
</script>

<template>
  <div>
    <label>Nhập tiền:</label>
    <input 
      v-number-mask="{ onChange: onAmountChange }" 
      placeholder="0 ₫" 
      class="input"
    />
    <p>Số nguyên: {{ numericAmount }}</p>
  </div>
</template>
```

---

### 🛠️ Cách 5: Hàm Thuần Túy Không Cần DOM (Pure Utilities)

```typescript
import { formatNumber, unformatNumber, getNumericValue, getLocaleSeparators, EURO_PRESET } from '@llein/realtime-number-mask';

// Tự động nhận diện dấu phân cách theo chuẩn quốc gia (BCP-47)
formatNumber(5000000, { locale: 'vi-VN' }); // "5.000.000"
formatNumber(5000000, { locale: 'en-US' }); // "5,000,000"

// Định dạng tiền Euro
formatNumber(1500000.5, EURO_PRESET); // "€1.500.000,5"

// Tách lấy giá trị số từ chuỗi định dạng
unformatNumber('1.500.000 ₫'); // "1500000"
getNumericValue('1.500.000,50 ₫', { decimalSeparator: ',' }); // 1500000.5
```

---

## ⚙️ Bảng Tùy Chọn Cấu Hình (Options Reference)

| Tùy chọn | Kiểu dữ liệu | Mặc định | Mô tả chi tiết |
|---|---|:---:|---|
| `locale` | `string` | `undefined` | Mã chuẩn BCP-47 (`'vi-VN'`, `'en-US'`, `'de-DE'`) để tự động tra cứu dấu phân cách qua ICU engine |
| `thousandSeparator` | `string` | `','` | Dấu phân cách hàng nghìn (VD: `','` hoặc `'.'`) |
| `decimalSeparator` | `string` | `'.'` | Dấu phân cách số thập phân (VD: `'.'` hoặc `','`) |
| `precision` | `number` | `0` | Số chữ số thập phân tối đa cho phép (`0` cho số nguyên / tiền VND) |
| `allowNegative` | `boolean` | `false` | Cho phép nhập số âm với dấu trừ `-` |
| `prefix` | `string` | `''` | Tiền tố phía trước số (VD: `'$'`, `'US$ '`) |
| `suffix` | `string` | `''` | Hậu tố phía sau số (VD: `' ₫'`, `' VND'`) |
| `smartArrowNavigation` | `boolean` | `true` | Phím mũi tên trái/phải tự động bước qua dấu chấm/phẩy |
| `autoInputMode` | `boolean` | `true` | Tự động kích hoạt bàn phím số (`numeric`/`decimal`) trên thiết bị di động |
| `max` | `number \| bigint` | `undefined` | Giới hạn giá trị lớn nhất cho phép |
| `min` | `number \| bigint` | `undefined` | Giới hạn giá trị nhỏ nhất cho phép |
| `onChange` | `(details) => void` | `undefined` | Callback nhận giá trị định dạng, chuỗi thô, và giá trị số `numericValue` |

---

## 📄 License

MIT © [Llein-Dev](https://github.com/Llein-Dev)
