# modbus-crc16-calc

> High-speed pure JavaScript Modbus RTU CRC16 checksum calculation for industrial IoT and PLC communication packets.

[![npm version](https://img.shields.io/npm/v/modbus-crc16-calc.svg?style=flat-square)](https://www.npmjs.com/package/modbus-crc16-calc)
[![npm downloads](https://img.shields.io/npm/dm/modbus-crc16-calc.svg?style=flat-square)](https://www.npmjs.com/package/modbus-crc16-calc)
[![bundle size](https://img.shields.io/bundlephobia/minzip/modbus-crc16-calc?style=flat-square)](https://bundlephobia.com/package/modbus-crc16-calc)
[![license](https://img.shields.io/npm/l/modbus-crc16-calc.svg?style=flat-square)](./LICENSE)

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
npm install modbus-crc16-calc

# Using pnpm
pnpm add modbus-crc16-calc

# Using yarn
yarn add modbus-crc16-calc
```

---

## 🚀 Quickstart

```typescript
import { calculateModbusCRC16, appendModbusCRC16 } from 'modbus-crc16-calc';

// Frame without CRC: [0x01, 0x03, 0x00, 0x00, 0x00, 0x0A]
const frame = new Uint8Array([0x01, 0x03, 0x00, 0x00, 0x00, 0x0a]);
const crc = calculateModbusCRC16(frame);
console.log(crc.toString(16)); // "c5cd"

const completePacket = appendModbusCRC16(frame);
```

---

## 📖 API Reference

- `calculateModbusCRC16(buffer: Uint8Array | number[]): number`
- `appendModbusCRC16(buffer: Uint8Array): Uint8Array`
- `verifyModbusCRC16(buffer: Uint8Array): boolean`

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
