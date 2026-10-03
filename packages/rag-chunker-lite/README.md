# rag-chunker-lite

> Lightweight recursive text chunker for RAG pipelines with configurable chunk sizes, overlap, and smart boundary splitting.

[![npm version](https://img.shields.io/npm/v/rag-chunker-lite.svg?style=flat-square)](https://www.npmjs.com/package/rag-chunker-lite)
[![npm downloads](https://img.shields.io/npm/dm/rag-chunker-lite.svg?style=flat-square)](https://www.npmjs.com/package/rag-chunker-lite)
[![bundle size](https://img.shields.io/bundlephobia/minzip/rag-chunker-lite?style=flat-square)](https://bundlephobia.com/package/rag-chunker-lite)
[![license](https://img.shields.io/npm/l/rag-chunker-lite.svg?style=flat-square)](./LICENSE)

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
npm install rag-chunker-lite

# Using pnpm
pnpm add rag-chunker-lite

# Using yarn
yarn add rag-chunker-lite
```

---

## 🚀 Quickstart

```typescript
import { chunkText } from 'rag-chunker-lite';

const document = "Long text content...";
const chunks = chunkText(document, {
  chunkSize: 500,
  chunkOverlap: 50
});

console.log(chunks.length); // Array of text chunk strings
```

---

## 📖 API Reference

- `chunkText(text: string, options?: ChunkerOptions): string[]`

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
