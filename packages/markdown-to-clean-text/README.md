# markdown-to-clean-text

> Strip Markdown formatting, badges, HTML tags, and code syntax into pure sanitized text optimized for RAG ingestion and embeddings.

[![npm version](https://img.shields.io/npm/v/markdown-to-clean-text.svg?style=flat-square)](https://www.npmjs.com/package/markdown-to-clean-text)
[![npm downloads](https://img.shields.io/npm/dm/markdown-to-clean-text.svg?style=flat-square)](https://www.npmjs.com/package/markdown-to-clean-text)
[![bundle size](https://img.shields.io/bundlephobia/minzip/markdown-to-clean-text?style=flat-square)](https://bundlephobia.com/package/markdown-to-clean-text)
[![license](https://img.shields.io/npm/l/markdown-to-clean-text.svg?style=flat-square)](./LICENSE)

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
npm install markdown-to-clean-text

# Using pnpm
pnpm add markdown-to-clean-text

# Using yarn
yarn add markdown-to-clean-text
```

---

## 🚀 Quickstart

```typescript
import { stripMarkdown } from 'markdown-to-clean-text';

const md = `# Welcome to **Antigravity**
Here is a [link](https://example.com) and some `inline code`.
> Quote of the day`;

console.log(stripMarkdown(md));
// "Welcome to Antigravity\nHere is a link and some inline code.\nQuote of the day"
```

---

## 📖 API Reference

- `stripMarkdown(markdown: string, options?): string`

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
