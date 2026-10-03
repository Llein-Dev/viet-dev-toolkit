# ping-host-fast

> High-speed TCP/Socket port connectivity test to probe online status of LAN IPs, cameras, printers, and microservices.

[![npm version](https://img.shields.io/npm/v/ping-host-fast.svg?style=flat-square)](https://www.npmjs.com/package/ping-host-fast)
[![npm downloads](https://img.shields.io/npm/dm/ping-host-fast.svg?style=flat-square)](https://www.npmjs.com/package/ping-host-fast)
[![bundle size](https://img.shields.io/bundlephobia/minzip/ping-host-fast?style=flat-square)](https://bundlephobia.com/package/ping-host-fast)
[![license](https://img.shields.io/npm/l/ping-host-fast.svg?style=flat-square)](./LICENSE)

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
npm install ping-host-fast

# Using pnpm
pnpm add ping-host-fast

# Using yarn
yarn add ping-host-fast
```

---

## 🚀 Quickstart

```typescript
import { pingHost } from 'ping-host-fast';

const status = await pingHost('192.168.1.1', 80, { timeoutMs: 1000 });
console.log(status.isAlive); // true
console.log(status.latencyMs); // 12
```

---

## 📖 API Reference

- `pingHost(host: string, port: number, options?): Promise<PingResult>`

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
