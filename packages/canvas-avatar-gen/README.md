# canvas-avatar-gen

> Generate high-res initials avatar pictures on deterministically colored pastel backgrounds with pure HTML5 Canvas or SVG data URIs.

[![npm version](https://img.shields.io/npm/v/canvas-avatar-gen.svg?style=flat-square)](https://www.npmjs.com/package/canvas-avatar-gen)
[![npm downloads](https://img.shields.io/npm/dm/canvas-avatar-gen.svg?style=flat-square)](https://www.npmjs.com/package/canvas-avatar-gen)
[![bundle size](https://img.shields.io/bundlephobia/minzip/canvas-avatar-gen?style=flat-square)](https://bundlephobia.com/package/canvas-avatar-gen)
[![license](https://img.shields.io/npm/l/canvas-avatar-gen.svg?style=flat-square)](./LICENSE)

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
npm install canvas-avatar-gen

# Using pnpm
pnpm add canvas-avatar-gen

# Using yarn
yarn add canvas-avatar-gen
```

---

## 🚀 Quickstart

```typescript
import { generateInitialsSvgDataUri, getInitials } from 'canvas-avatar-gen';

const avatarUri = generateInitialsSvgDataUri('Nguyễn Văn An');
console.log(avatarUri); // "data:image/svg+xml;utf8,..."
```

---

## 📖 API Reference

- `generateInitialsSvgDataUri(name: string, size?: number): string`
- `getInitials(name: string): string`
- `getDeterministicColor(str: string): string`

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
