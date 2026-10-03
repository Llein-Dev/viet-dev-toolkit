# multer-disk-filename

> Generate clean, collision-free disk filenames for Multer file uploads with timestamp, random hex, and slugified original names.

[![npm version](https://img.shields.io/npm/v/multer-disk-filename.svg?style=flat-square)](https://www.npmjs.com/package/multer-disk-filename)
[![npm downloads](https://img.shields.io/npm/dm/multer-disk-filename.svg?style=flat-square)](https://www.npmjs.com/package/multer-disk-filename)
[![bundle size](https://img.shields.io/bundlephobia/minzip/multer-disk-filename?style=flat-square)](https://bundlephobia.com/package/multer-disk-filename)
[![license](https://img.shields.io/npm/l/multer-disk-filename.svg?style=flat-square)](./LICENSE)

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
npm install multer-disk-filename

# Using pnpm
pnpm add multer-disk-filename

# Using yarn
yarn add multer-disk-filename
```

---

## 🚀 Quickstart

```typescript
import { safeUploadFilename, createMulterFilenameHandler } from 'multer-disk-filename';

console.log(safeUploadFilename('Báo cáo tài chính 2026.pdf'));
// "20261003-a1b2c3d4-bao-cao-tai-chinh-2026.pdf"
```

---

## 📖 API Reference

- `safeUploadFilename(originalName: string): string`
- `createMulterFilenameHandler(options?): MulterFilenameFunction`

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
