# bounding-box-scaler

> Transform and scale bounding boxes between original video/camera resolution and browser canvas/screen display dimensions.

[![npm version](https://img.shields.io/npm/v/bounding-box-scaler.svg?style=flat-square)](https://www.npmjs.com/package/bounding-box-scaler)
[![npm downloads](https://img.shields.io/npm/dm/bounding-box-scaler.svg?style=flat-square)](https://www.npmjs.com/package/bounding-box-scaler)
[![bundle size](https://img.shields.io/bundlephobia/minzip/bounding-box-scaler?style=flat-square)](https://bundlephobia.com/package/bounding-box-scaler)
[![license](https://img.shields.io/npm/l/bounding-box-scaler.svg?style=flat-square)](./LICENSE)

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
npm install bounding-box-scaler

# Using pnpm
pnpm add bounding-box-scaler

# Using yarn
yarn add bounding-box-scaler
```

---

## 🚀 Quickstart

```typescript
import { scaleBox, boxToXYWH, boxToXYXY } from 'bounding-box-scaler';

// Video is 1920x1080, Canvas is 960x540
const originalBox = { x: 100, y: 200, width: 300, height: 400 };
const scaled = scaleBox(originalBox, { srcWidth: 1920, srcHeight: 1080, destWidth: 960, destHeight: 540 });
console.log(scaled); // { x: 50, y: 100, width: 150, height: 200 }
```

---

## 📖 API Reference

- `scaleBox(box, config): BoundingBoxXYWH`
- `boxToXYWH(xyxy: [number, number, number, number]): BoundingBoxXYWH`
- `boxToXYXY(box: BoundingBoxXYWH): [number, number, number, number]`

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
