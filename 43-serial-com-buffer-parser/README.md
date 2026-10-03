# serial-com-buffer-parser

> Packet framer and buffer parser for Serial/COM/RS232/RS485 data streams using STX (0x02) and ETX (0x03) delimiters.

[![npm version](https://img.shields.io/npm/v/serial-com-buffer-parser.svg?style=flat-square)](https://www.npmjs.com/package/serial-com-buffer-parser)
[![npm downloads](https://img.shields.io/npm/dm/serial-com-buffer-parser.svg?style=flat-square)](https://www.npmjs.com/package/serial-com-buffer-parser)
[![bundle size](https://img.shields.io/bundlephobia/minzip/serial-com-buffer-parser?style=flat-square)](https://bundlephobia.com/package/serial-com-buffer-parser)
[![license](https://img.shields.io/npm/l/serial-com-buffer-parser.svg?style=flat-square)](./LICENSE)

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
npm install serial-com-buffer-parser

# Using pnpm
pnpm add serial-com-buffer-parser

# Using yarn
yarn add serial-com-buffer-parser
```

---

## 🚀 Quickstart

```typescript
import { PacketFramer } from 'serial-com-buffer-parser';

const framer = new PacketFramer({
  onPacket: (packet) => {
    console.log('Received valid packet:', packet.toString('utf8'));
  }
});

// Pass streaming chunks from SerialPort.on('data')
framer.push(chunkBuffer);
```

---

## 📖 API Reference

- `new PacketFramer(options)`
- `framer.push(chunk: Buffer | Uint8Array)`
- `framer.reset()`

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
