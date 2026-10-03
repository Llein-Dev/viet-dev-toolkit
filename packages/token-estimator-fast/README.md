# token-estimator-fast

> Fast, lightweight token count estimator for OpenAI, Anthropic, Gemini, and DeepSeek text without loading heavy 50MB WASM files.

[![npm version](https://img.shields.io/npm/v/token-estimator-fast.svg?style=flat-square)](https://www.npmjs.com/package/token-estimator-fast)
[![npm downloads](https://img.shields.io/npm/dm/token-estimator-fast.svg?style=flat-square)](https://www.npmjs.com/package/token-estimator-fast)
[![bundle size](https://img.shields.io/bundlephobia/minzip/token-estimator-fast?style=flat-square)](https://bundlephobia.com/package/token-estimator-fast)
[![license](https://img.shields.io/npm/l/token-estimator-fast.svg?style=flat-square)](./LICENSE)

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
npm install token-estimator-fast

# Using pnpm
pnpm add token-estimator-fast

# Using yarn
yarn add token-estimator-fast
```

---

## 🚀 Quickstart

```typescript
import { estimateTokens } from 'token-estimator-fast';

const count = estimateTokens('Xin chào, đây là câu lệnh thử nghiệm token count!');
console.log(count); // Estimated token count (~12 tokens)
```

---

## 📖 API Reference

- `estimateTokens(text: string, options?): number`
- `estimateChatTokens(messages: Array<{ role: string, content: string }>): number`

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
