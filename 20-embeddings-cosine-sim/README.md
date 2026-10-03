# embeddings-cosine-sim

> High-performance pure JavaScript/TypeScript calculation of Cosine Similarity, Dot Product, and Top-K search for vector embeddings.

[![npm version](https://img.shields.io/npm/v/embeddings-cosine-sim.svg?style=flat-square)](https://www.npmjs.com/package/embeddings-cosine-sim)
[![npm downloads](https://img.shields.io/npm/dm/embeddings-cosine-sim.svg?style=flat-square)](https://www.npmjs.com/package/embeddings-cosine-sim)
[![bundle size](https://img.shields.io/bundlephobia/minzip/embeddings-cosine-sim?style=flat-square)](https://bundlephobia.com/package/embeddings-cosine-sim)
[![license](https://img.shields.io/npm/l/embeddings-cosine-sim.svg?style=flat-square)](./LICENSE)

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
npm install embeddings-cosine-sim

# Using pnpm
pnpm add embeddings-cosine-sim

# Using yarn
yarn add embeddings-cosine-sim
```

---

## 🚀 Quickstart

```typescript
import { cosineSimilarity, topKSimilars } from 'embeddings-cosine-sim';

const vecA = [0.1, 0.8, -0.2];
const vecB = [0.12, 0.78, -0.19];

const score = cosineSimilarity(vecA, vecB);
console.log(score); // 0.998... (Very close match)
```

---

## 📖 API Reference

- `cosineSimilarity(a: number[], b: number[]): number`
- `dotProduct(a: number[], b: number[]): number`
- `topKSimilars(target: number[], candidates: number[][], k?: number)`

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
