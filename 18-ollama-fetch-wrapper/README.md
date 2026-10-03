# ollama-fetch-wrapper

> Featherweight 1KB client to query local Ollama API instances with full streaming support in Node.js and Browser environments.

[![npm version](https://img.shields.io/npm/v/ollama-fetch-wrapper.svg?style=flat-square)](https://www.npmjs.com/package/ollama-fetch-wrapper)
[![npm downloads](https://img.shields.io/npm/dm/ollama-fetch-wrapper.svg?style=flat-square)](https://www.npmjs.com/package/ollama-fetch-wrapper)
[![bundle size](https://img.shields.io/bundlephobia/minzip/ollama-fetch-wrapper?style=flat-square)](https://bundlephobia.com/package/ollama-fetch-wrapper)
[![license](https://img.shields.io/npm/l/ollama-fetch-wrapper.svg?style=flat-square)](./LICENSE)

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
npm install ollama-fetch-wrapper

# Using pnpm
pnpm add ollama-fetch-wrapper

# Using yarn
yarn add ollama-fetch-wrapper
```

---

## 🚀 Quickstart

```typescript
import { createOllamaClient } from 'ollama-fetch-wrapper';

const ollama = createOllamaClient({ baseUrl: 'http://localhost:11434' });

// Simple generation
const response = await ollama.generate({
  model: 'llama3',
  prompt: 'Write a haiku about TypeScript.'
});
console.log(response.response);
```

---

## 📖 API Reference

- `createOllamaClient(config?): OllamaClient`
- `generate(params)`
- `chat(params)`

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
