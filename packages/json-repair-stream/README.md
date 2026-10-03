# json-repair-stream

> Repair malformed, cut-off, or truncated JSON responses streaming from LLMs back into valid parseable JSON objects.

[![npm version](https://img.shields.io/npm/v/json-repair-stream.svg?style=flat-square)](https://www.npmjs.com/package/json-repair-stream)
[![npm downloads](https://img.shields.io/npm/dm/json-repair-stream.svg?style=flat-square)](https://www.npmjs.com/package/json-repair-stream)
[![bundle size](https://img.shields.io/bundlephobia/minzip/json-repair-stream?style=flat-square)](https://bundlephobia.com/package/json-repair-stream)
[![license](https://img.shields.io/npm/l/json-repair-stream.svg?style=flat-square)](./LICENSE)

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
npm install json-repair-stream

# Using pnpm
pnpm add json-repair-stream

# Using yarn
yarn add json-repair-stream
```

---

## 🚀 Quickstart

```typescript
import { repairJson, safeParseStreamJson } from 'json-repair-stream';

// Incomplete JSON from LLM stream
const brokenJson = '{"title": "Report", "items": ["item1", "ite';

const repaired = repairJson(brokenJson);
console.log(repaired); // '{"title": "Report", "items": ["item1"]}'

const data = safeParseStreamJson(brokenJson);
console.log(data.title); // "Report"
```

---

## 📖 API Reference

- `repairJson(jsonStr: string): string`
- `safeParseStreamJson<T = any>(jsonStr: string, fallback?: T): T`

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
