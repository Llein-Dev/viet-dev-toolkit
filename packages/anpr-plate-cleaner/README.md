# @llein/anpr-plate-cleaner

> Production-grade OCR / ANPR license plate text cleaner, character confusion disambiguation (`0` vs `O`, `1` vs `I`, `8` vs `B`), 2-line combiner, and whitelist fuzzy matcher.

[![npm version](https://img.shields.io/npm/v/@llein/anpr-plate-cleaner.svg?style=flat-square)](https://www.npmjs.com/package/@llein/anpr-plate-cleaner)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/anpr-plate-cleaner)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%203KB-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/anpr-plate-cleaner)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ Why This Package?

In real-world parking barrier systems and traffic cameras (ANPR / ALPR), raw OCR output from models like YOLO, PaddleOCR, or EasyOCR is often corrupted by:
- Night infrared reflections, dirt, scratches, and screw heads on the license plate.
- OCR character confusions:
  - Letters read where digits are required (e.g., `S` instead of `5`, `I` / `L` instead of `1`, `B` instead of `8`, `O` / `D` instead of `0`).
  - Digits read where letters are required (e.g., `8` instead of `B`, `0` instead of `D`/`O`, `1` instead of `I`).
- Two-line plates (top line: province & series, bottom line: sequence numbers).

`@llein/anpr-plate-cleaner` solves this using **position-aware syntactic disambiguation**, **2-line merging**, and **confusion-discounted fuzzy matching** for resident whitelists.

---

## 🚀 Features

- **Position-Aware Error Correction**:
  - Automatically fixes province digits, series letters, and serial numbers according to vehicle registration standards (Circular 24/2023/TT-BCA).
- **Two-Line Plate Stitching**:
  - Combines multi-line OCR detections (e.g. `59-P1` on line 1 and `123.45` on line 2 -> `59P112345`).
- **Vehicle Type Classification**:
  - Classifies into `car`, `motorbike`, `electric_motorbike`, `military`, and `diplomatic`.
- **Confusion-Weighted Fuzzy Matching**:
  - Levenshtein distance with fractional penalties for known OCR confusions (e.g. mistaking `8` for `B` is penalized with only `0.25` instead of `1.0`).
  - Perfect for matching parking gate scans against database whitelist records.
- **Zero External Dependencies**: Pure TypeScript, minimal footprint (< 4KB).

---

## 📦 Installation

```bash
# Using npm
npm install @llein/anpr-plate-cleaner

# Using pnpm
pnpm add @llein/anpr-plate-cleaner

# Using yarn
yarn add @llein/anpr-plate-cleaner
```

---

## 🛠️ Usage Examples

### 1. Clean Corrupted OCR Output

```typescript
import { cleanVietnamPlate, cleanANPRText } from '@llein/anpr-plate-cleaner';

// OCR misread 'S' as 5, 'I' as 1, 'B' as 8
const result = cleanVietnamPlate('SIK-999.9B');

console.log(result.compact);   // "51K99998"
console.log(result.formatted); // "51K-999.98"
console.log(result.vehicleType); // "car"
console.log(result.isValid);   // true
```

### 2. Multi-line Motorbike Plate

```typescript
// Bounding boxes read top & bottom lines
const rawOCR = "59-P1\n123.45";

const result = cleanVietnamPlate(rawOCR);
console.log(result.compact);   // "59P112345"
console.log(result.formatted); // "59-P1 123.45"
console.log(result.vehicleType); // "motorbike"
```

### 3. Match Plate Against Parking Whitelist (Fuzzy Search)

```typescript
import { findBestPlateMatch } from '@llein/anpr-plate-cleaner';

const whitelist = [
  '51K99999',
  '29A12345',
  '59P167890'
];

// OCR reading has a glitch: 'O' instead of '0'
const scanned = '59P16789O';

const match = findBestPlateMatch(scanned, whitelist, 0.85);

if (match) {
  console.log(`Open Barrier! Matched: ${match.match} (Confidence: ${match.score * 100}%)`);
}
```

---

## 📖 API Reference

### `cleanVietnamPlate(raw: string): PlateCleanResult`
Full syntactic analysis returning `{ raw, compact, formatted, vehicleType, isValid, score }`.

### `cleanANPRText(raw: string, options?: CleanOptions): string`
Returns cleaned string directly (compact or formatted).

### `combinePlateLines(topLine: string, bottomLine: string): string`
Joins 2-line OCR boxes into a unified text string.

### `calculatePlateSimilarity(plateA: string, plateB: string): number`
Returns a similarity score between `0.0` and `1.0` utilizing OCR confusion matrices.

### `findBestPlateMatch(query: string, candidates: string[], threshold?: number)`
Searches a candidate array for the closest matching registered plate.

---

## 🧪 Testing

```bash
npm test
```

---

## 📄 License

MIT © [Llein-Dev](https://github.com/Llein-Dev)
