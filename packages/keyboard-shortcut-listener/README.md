# @llein/keyboard-shortcut-listener

> Zero-dependency keyboard shortcut listener and React hook for Cmd+K, Ctrl+S, Escape with cross-platform `mod` key and automatic text input suppression.

[![npm version](https://img.shields.io/npm/v/@llein/keyboard-shortcut-listener.svg?style=flat-square)](https://www.npmjs.com/package/@llein/keyboard-shortcut-listener)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/keyboard-shortcut-listener)
[![bundle size](https://img.shields.io/badge/bundle%20size-%3C%203KB-success.svg?style=flat-square)](https://www.npmjs.com/package/@llein/keyboard-shortcut-listener)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)

---

## ⚡ Highlights

- **React Custom Hook (`useKeyboardShortcut`)**: Automatic lifecycle management, attaches on mount and cleans up on unmount.
- **Cross-Platform `mod` Key**: `"mod+k"` automatically triggers `Cmd+K` on macOS/iOS, and `Ctrl+K` on Windows/Linux.
- **Text Input Suppression (`ignoreInputs: true`)**: Prevents shortcuts from firing while the user is typing inside `<input>`, `<textarea>`, or `contentEditable` elements.
- **Strict Modifier Matching**: Pressing `Shift+Ctrl+K` won't accidentally trigger a handler configured strictly for `Ctrl+K`.
- **Multiple Shortcut Combos**: Accepts arrays or comma-delimited strings (e.g. `['ctrl+k', 'ctrl+p']`).
- **Zero Dependencies**: 100% pure TypeScript, ultra-lightweight (< 2KB), dual ESM/CJS with full `.d.ts`.

---

## 📦 Installation

```bash
npm install @llein/keyboard-shortcut-listener
# or
pnpm add @llein/keyboard-shortcut-listener
```

---

## 🛠️ Usage

### 1. React / Next.js (`useKeyboardShortcut` Custom Hook)

```tsx
import React, { useState } from 'react';
import { useKeyboardShortcut } from '@llein/keyboard-shortcut-listener/react';

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Open search with Cmd+K (Mac) or Ctrl+K (Windows/Linux)
  useKeyboardShortcut('mod+k', () => {
    setIsOpen(true);
  }, { preventDefault: true });

  // 2. Quick save with Ctrl+S / Cmd+S
  useKeyboardShortcut('mod+s', () => {
    console.log('Saved document!');
  }, { preventDefault: true });

  // 3. Close dialog on Escape
  useKeyboardShortcut('escape', () => {
    setIsOpen(false);
  });

  return (
    <div>
      <p>Press <b>Cmd+K</b> or <b>Ctrl+K</b> to open command palette.</p>
      {isOpen && <div className="modal">Search dialog...</div>}
    </div>
  );
}
```

### 2. Vanilla JavaScript / HTML

```typescript
import { registerShortcut } from '@llein/keyboard-shortcut-listener';

// Register global shortcut
const unregister = registerShortcut('mod+k', (e) => {
  openCommandPalette();
}, {
  preventDefault: true,
  ignoreInputs: true // Does not trigger while typing in inputs
});

// Cleanup when unmounting or changing views
// unregister();
```

---

## ⚙️ Options

| Option | Type | Default | Description |
|---|---|:---:|---|
| `preventDefault` | `boolean` | `false` | Automatically calls `e.preventDefault()` |
| `ignoreInputs` | `boolean` | `true` | Suppresses shortcut if user is typing in an input/textarea |
| `exactModifiers` | `boolean` | `true` | Requires strictly only specified modifiers |
| `enabled` | `boolean` | `true` | *(Hook only)* Toggle listener active/inactive |
| `target` | `EventTarget` | `window` | Custom DOM element or window to listen on |

---

## 📄 License

MIT © [Llein-Dev](https://github.com/Llein-Dev)
