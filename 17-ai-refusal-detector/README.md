# ai-refusal-detector

> Fast regex and semantic pattern matcher to detect if an LLM refused to fulfill a prompt in English or Vietnamese.

[![npm version](https://img.shields.io/npm/v/ai-refusal-detector.svg?style=flat-square)](https://www.npmjs.com/package/ai-refusal-detector)
[![npm downloads](https://img.shields.io/npm/dm/ai-refusal-detector.svg?style=flat-square)](https://www.npmjs.com/package/ai-refusal-detector)
[![bundle size](https://img.shields.io/bundlephobia/minzip/ai-refusal-detector?style=flat-square)](https://bundlephobia.com/package/ai-refusal-detector)
[![license](https://img.shields.io/npm/l/ai-refusal-detector.svg?style=flat-square)](./LICENSE)

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
npm install ai-refusal-detector

# Using pnpm
pnpm add ai-refusal-detector

# Using yarn
yarn add ai-refusal-detector
```

---

## 🚀 Quickstart

```typescript
import { isAIRefusal, detectRefusalReason } from 'ai-refusal-detector';

console.log(isAIRefusal("I'm sorry, but I cannot assist with that request."));
// true

console.log(isAIRefusal("Rất tiếc, tôi không thể hỗ trợ yêu cầu này."));
// true
```

---

## 📖 API Reference

- `isAIRefusal(text: string): boolean`
- `detectRefusalReason(text: string): { isRefusal: boolean; matchedPattern?: string }`

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
