# rtsp-url-builder

> Construct standardized RTSP video streaming URLs for major IP camera brands (Hikvision, Dahua, KBVision, Imou, Uniview).

[![npm version](https://img.shields.io/npm/v/rtsp-url-builder.svg?style=flat-square)](https://www.npmjs.com/package/rtsp-url-builder)
[![npm downloads](https://img.shields.io/npm/dm/rtsp-url-builder.svg?style=flat-square)](https://www.npmjs.com/package/rtsp-url-builder)
[![bundle size](https://img.shields.io/bundlephobia/minzip/rtsp-url-builder?style=flat-square)](https://bundlephobia.com/package/rtsp-url-builder)
[![license](https://img.shields.io/npm/l/rtsp-url-builder.svg?style=flat-square)](./LICENSE)

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
npm install rtsp-url-builder

# Using pnpm
pnpm add rtsp-url-builder

# Using yarn
yarn add rtsp-url-builder
```

---

## 🚀 Quickstart

```typescript
import { buildRtspUrl } from 'rtsp-url-builder';

const url = buildRtspUrl({
  brand: 'hikvision',
  host: '192.168.1.100',
  username: 'admin',
  password: 'Password123',
  channel: 1,
  subtype: 'sub'
});
console.log(url);
// "rtsp://admin:Password123@192.168.1.100:554/Streaming/Channels/102"
```

---

## 📖 API Reference

- `buildRtspUrl(options: RtspCameraOptions): string`

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
