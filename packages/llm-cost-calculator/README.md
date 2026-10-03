# llm-cost-calculator

> Calculate USD API expenses based on input and output tokens across OpenAI, Anthropic, Gemini, and DeepSeek models.

[![npm version](https://img.shields.io/npm/v/llm-cost-calculator.svg?style=flat-square)](https://www.npmjs.com/package/llm-cost-calculator)
[![npm downloads](https://img.shields.io/npm/dm/llm-cost-calculator.svg?style=flat-square)](https://www.npmjs.com/package/llm-cost-calculator)
[![bundle size](https://img.shields.io/bundlephobia/minzip/llm-cost-calculator?style=flat-square)](https://bundlephobia.com/package/llm-cost-calculator)
[![license](https://img.shields.io/npm/l/llm-cost-calculator.svg?style=flat-square)](./LICENSE)

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
npm install llm-cost-calculator

# Using pnpm
pnpm add llm-cost-calculator

# Using yarn
yarn add llm-cost-calculator
```

---

## 🚀 Quickstart

```typescript
import { calculateLLMCost } from 'llm-cost-calculator';

const cost = calculateLLMCost({
  model: 'gpt-4o-mini',
  inputTokens: 15000,
  outputTokens: 2500
});

console.log(cost.totalUSD); // ~$0.00375
console.log(cost.formatted); // "$0.0038"
```

---

## 📖 API Reference

- `calculateLLMCost(options): CostResult`
- `getModelPricing(model: string): ModelPrice | undefined`

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
