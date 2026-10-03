# path-clean-crossplatform

> Zero-dep cross-platform path sanitizer converting Windows backslashes and POSIX slashes into consistent format.

[![npm version](https://img.shields.io/npm/v/path-clean-crossplatform.svg?style=flat-square)](https://www.npmjs.com/package/path-clean-crossplatform)
[![npm downloads](https://img.shields.io/npm/dm/path-clean-crossplatform.svg?style=flat-square)](https://www.npmjs.com/package/path-clean-crossplatform)
[![bundle size](https://img.shields.io/bundlephobia/minzip/path-clean-crossplatform?style=flat-square)](https://bundlephobia.com/package/path-clean-crossplatform)
[![license](https://img.shields.io/npm/l/path-clean-crossplatform.svg?style=flat-square)](./LICENSE)

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
npm install path-clean-crossplatform

# Using pnpm
pnpm add path-clean-crossplatform

# Using yarn
yarn add path-clean-crossplatform
```

---

## 🚀 Quickstart

```typescript
import { toPosixPath, cleanPath } from 'path-clean-crossplatform';

console.log(toPosixPath('C:\\Users\\Admin\\project\\file.ts'));
// "C:/Users/Admin/project/file.ts"

console.log(cleanPath('foo//bar/../baz'));
// "foo/baz"
```

---

## 📖 API Reference

- `toPosixPath(filepath: string): string`
- `cleanPath(filepath: string): string`

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
