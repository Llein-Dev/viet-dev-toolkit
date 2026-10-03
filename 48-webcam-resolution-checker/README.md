# webcam-resolution-checker

> Probe and report all supported capture resolutions (4K, 1080p, 720p, 480p) of connected webcams via WebRTC.

[![npm version](https://img.shields.io/npm/v/webcam-resolution-checker.svg?style=flat-square)](https://www.npmjs.com/package/webcam-resolution-checker)
[![npm downloads](https://img.shields.io/npm/dm/webcam-resolution-checker.svg?style=flat-square)](https://www.npmjs.com/package/webcam-resolution-checker)
[![bundle size](https://img.shields.io/bundlephobia/minzip/webcam-resolution-checker?style=flat-square)](https://bundlephobia.com/package/webcam-resolution-checker)
[![license](https://img.shields.io/npm/l/webcam-resolution-checker.svg?style=flat-square)](./LICENSE)

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
npm install webcam-resolution-checker

# Using pnpm
pnpm add webcam-resolution-checker

# Using yarn
yarn add webcam-resolution-checker
```

---

## 🚀 Quickstart

```typescript
import { checkSupportedResolutions } from 'webcam-resolution-checker';

const report = await checkSupportedResolutions();
console.log('Highest supported resolution:', report.highest);
// { label: '1080p', width: 1920, height: 1080 }
```

---

## 📖 API Reference

- `checkSupportedResolutions(deviceId?: string): Promise<ResolutionReport>`

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
