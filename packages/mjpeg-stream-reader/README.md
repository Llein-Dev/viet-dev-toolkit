# mjpeg-stream-reader

> Micro-client to extract individual JPEG image frames from HTTP multipart/x-mixed-replace MJPEG camera streams.

[![npm version](https://img.shields.io/npm/v/mjpeg-stream-reader.svg?style=flat-square)](https://www.npmjs.com/package/mjpeg-stream-reader)
[![npm downloads](https://img.shields.io/npm/dm/mjpeg-stream-reader.svg?style=flat-square)](https://www.npmjs.com/package/mjpeg-stream-reader)
[![bundle size](https://img.shields.io/bundlephobia/minzip/mjpeg-stream-reader?style=flat-square)](https://bundlephobia.com/package/mjpeg-stream-reader)
[![license](https://img.shields.io/npm/l/mjpeg-stream-reader.svg?style=flat-square)](./LICENSE)

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
npm install mjpeg-stream-reader

# Using pnpm
pnpm add mjpeg-stream-reader

# Using yarn
yarn add mjpeg-stream-reader
```

---

## 🚀 Quickstart

```typescript
import { createMjpegReader } from 'mjpeg-stream-reader';

const reader = createMjpegReader('http://192.168.1.50/mjpeg', {
  onFrame: (frameBuffer) => {
    console.log('Received JPEG frame of size:', frameBuffer.length);
  }
});

reader.start();
```

---

## 📖 API Reference

- `createMjpegReader(url: string, options)`
- `reader.start()`
- `reader.stop()`

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
