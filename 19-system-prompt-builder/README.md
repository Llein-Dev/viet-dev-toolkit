# system-prompt-builder

> Fluent builder pattern to cleanly assemble multi-layered system prompts (Role, Constraints, Context, Schema, Few-Shot examples).

[![npm version](https://img.shields.io/npm/v/system-prompt-builder.svg?style=flat-square)](https://www.npmjs.com/package/system-prompt-builder)
[![npm downloads](https://img.shields.io/npm/dm/system-prompt-builder.svg?style=flat-square)](https://www.npmjs.com/package/system-prompt-builder)
[![bundle size](https://img.shields.io/bundlephobia/minzip/system-prompt-builder?style=flat-square)](https://bundlephobia.com/package/system-prompt-builder)
[![license](https://img.shields.io/npm/l/system-prompt-builder.svg?style=flat-square)](./LICENSE)

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
npm install system-prompt-builder

# Using pnpm
pnpm add system-prompt-builder

# Using yarn
yarn add system-prompt-builder
```

---

## 🚀 Quickstart

```typescript
import { SystemPromptBuilder } from 'system-prompt-builder';

const prompt = new SystemPromptBuilder()
  .setRole('Senior Database Architect')
  .addConstraint('Never suggest DROP TABLE commands.')
  .addConstraint('Always format SQL in uppercase keywords.')
  .setOutputFormat('JSON array of query objects')
  .build();
```

---

## 📖 API Reference

- `new SystemPromptBuilder()`
- `.setRole(role: string)`
- `.addConstraint(constraint: string)`
- `.addContext(context: string)`
- `.setOutputFormat(format: string)`
- `.build(): string`

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
