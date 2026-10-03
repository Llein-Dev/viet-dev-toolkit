# easy-cron-builder

> Human-friendly phrase to 5-field Cron expression builder ("every 5 minutes", "daily at 09:30", "every monday").

[![npm version](https://img.shields.io/npm/v/easy-cron-builder.svg?style=flat-square)](https://www.npmjs.com/package/easy-cron-builder)
[![npm downloads](https://img.shields.io/npm/dm/easy-cron-builder.svg?style=flat-square)](https://www.npmjs.com/package/easy-cron-builder)
[![bundle size](https://img.shields.io/bundlephobia/minzip/easy-cron-builder?style=flat-square)](https://bundlephobia.com/package/easy-cron-builder)
[![license](https://img.shields.io/npm/l/easy-cron-builder.svg?style=flat-square)](./LICENSE)

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
npm install easy-cron-builder

# Using pnpm
pnpm add easy-cron-builder

# Using yarn
yarn add easy-cron-builder
```

---

## 🚀 Quickstart

```typescript
import { buildCron, parseHumanSchedule } from 'easy-cron-builder';

console.log(parseHumanSchedule('every 15 minutes')); // "*/15 * * * *"
console.log(parseHumanSchedule('every day at 08:30')); // "30 8 * * *"
console.log(parseHumanSchedule('every monday at 09:00')); // "0 9 * * 1"
```

---

## 📖 API Reference

- `parseHumanSchedule(phrase: string): string`
- `buildCron(options): string`

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
