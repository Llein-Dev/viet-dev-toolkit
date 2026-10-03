# prompt-template-mini

> Zero-dependency mini template engine for LLM prompts supporting variable interpolation, default values, and conditional blocks.

[![npm version](https://img.shields.io/npm/v/prompt-template-mini.svg?style=flat-square)](https://www.npmjs.com/package/prompt-template-mini)
[![npm downloads](https://img.shields.io/npm/dm/prompt-template-mini.svg?style=flat-square)](https://www.npmjs.com/package/prompt-template-mini)
[![bundle size](https://img.shields.io/bundlephobia/minzip/prompt-template-mini?style=flat-square)](https://bundlephobia.com/package/prompt-template-mini)
[![license](https://img.shields.io/npm/l/prompt-template-mini.svg?style=flat-square)](./LICENSE)

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
npm install prompt-template-mini

# Using pnpm
pnpm add prompt-template-mini

# Using yarn
yarn add prompt-template-mini
```

---

## 🚀 Quickstart

```typescript
import { renderPrompt } from 'prompt-template-mini';

const template = `You are an expert in {{domain|software engineering}}.
User query: {{query}}
{{#if includeCode}}Please provide code samples in {{language}}.{{/if}}`;

const prompt = renderPrompt(template, {
  query: 'How to debounce input in React?',
  includeCode: true,
  language: 'TypeScript'
});
```

---

## 📖 API Reference

- `renderPrompt(template: string, data: Record<string, any>): string`
- `compilePrompt(template: string): (data: Record<string, any>) => string`

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
