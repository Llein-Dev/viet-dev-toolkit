# vn-zalo-oa-helper

> Lightweight helper for Zalo Official Account (OA) and ZNS (Zalo Notification Service) payload formatting and signature verification.

[![npm version](https://img.shields.io/npm/v/vn-zalo-oa-helper.svg?style=flat-square)](https://www.npmjs.com/package/vn-zalo-oa-helper)
[![npm downloads](https://img.shields.io/npm/dm/vn-zalo-oa-helper.svg?style=flat-square)](https://www.npmjs.com/package/vn-zalo-oa-helper)
[![bundle size](https://img.shields.io/bundlephobia/minzip/vn-zalo-oa-helper?style=flat-square)](https://bundlephobia.com/package/vn-zalo-oa-helper)
[![license](https://img.shields.io/npm/l/vn-zalo-oa-helper.svg?style=flat-square)](./LICENSE)

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
npm install vn-zalo-oa-helper

# Using pnpm
pnpm add vn-zalo-oa-helper

# Using yarn
yarn add vn-zalo-oa-helper
```

---

## 🚀 Quickstart

```typescript
import { buildZNSPayload, normalizeZaloPhone } from 'vn-zalo-oa-helper';

const phone = normalizeZaloPhone('0981234567'); // "84981234567"

const payload = buildZNSPayload({
  phone,
  templateId: '123456',
  templateData: {
    customer_name: 'Nguyễn Văn A',
    order_code: 'ORD-999'
  }
});
```

---

## 📖 API Reference

- `buildZNSPayload(options): ZNSPayload`
- `normalizeZaloPhone(phone: string): string`
- `verifyZaloWebhookSignature(appId, data, mac, secret): boolean`

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
