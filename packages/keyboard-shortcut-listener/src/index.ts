/**
 * @llein/keyboard-shortcut-listener
 * Lightweight, zero-dependency keyboard shortcut listener and React hook.
 * Supports Cmd+K, Ctrl+S, Escape, Mod (Mac/Win detection), and input field suppression.
 */

export interface ShortcutOptions {
  /**
   * If true, suppresses shortcut execution when focus is inside text input, textarea, or contentEditable.
   * @default true
   */
  ignoreInputs?: boolean;

  /**
   * Event target to listen on.
   * @default window
   */
  target?: EventTarget | null;

  /**
   * Automatically call event.preventDefault() when shortcut matches.
   * @default false
   */
  preventDefault?: boolean;

  /**
   * Whether to strictly require only the specified modifiers and no unmentioned ones.
   * @default true
   */
  exactModifiers?: boolean;
}

export interface ParsedCombo {
  ctrl: boolean;
  meta: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

/** Detect if running on macOS or iOS */
export const isMac = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  // Modern userAgentData or legacy navigator.platform
  const nav = navigator as any;
  if (nav.userAgentData?.platform) {
    return /mac|iphone|ipad|ipod/i.test(nav.userAgentData.platform);
  }
  return /mac|iphone|ipad|ipod/i.test(navigator.platform || navigator.userAgent || '');
};

/**
 * Parses a shortcut combination string like "Ctrl+K", "mod+s", "Shift+Escape"
 */
export function parseCombo(combo: string): ParsedCombo {
  const parts = combo
    .toLowerCase()
    .split('+')
    .map((p) => p.trim())
    .filter(Boolean);

  const mac = isMac();
  let ctrl = parts.includes('ctrl') || parts.includes('control');
  let meta = parts.includes('cmd') || parts.includes('command') || parts.includes('meta');
  const alt = parts.includes('alt') || parts.includes('option');
  const shift = parts.includes('shift');

  // "mod" dynamically maps to Command on Mac, and Control on Windows/Linux
  if (parts.includes('mod')) {
    if (mac) {
      meta = true;
    } else {
      ctrl = true;
    }
  }

  const keyPart = parts.find((p) => !['ctrl', 'control', 'cmd', 'command', 'meta', 'alt', 'option', 'shift', 'mod'].includes(p)) || '';

  return {
    ctrl,
    meta,
    alt,
    shift,
    key: keyPart
  };
}

/**
 * Checks if a KeyboardEvent matches a parsed shortcut combo
 */
export function matchesCombo(
  e: KeyboardEvent,
  parsed: ParsedCombo,
  exactModifiers = true
): boolean {
  const eventKey = e.key.toLowerCase();
  const targetKey = parsed.key.toLowerCase();

  // Normalize special key names
  const isKeyMatch =
    eventKey === targetKey ||
    (targetKey === 'esc' && eventKey === 'escape') ||
    (targetKey === 'return' && eventKey === 'enter') ||
    (targetKey === 'space' && (eventKey === ' ' || eventKey === 'spacebar'));

  if (!isKeyMatch && targetKey !== '') {
    return false;
  }

  if (exactModifiers) {
    return (
      e.ctrlKey === parsed.ctrl &&
      e.metaKey === parsed.meta &&
      e.altKey === parsed.alt &&
      e.shiftKey === parsed.shift
    );
  }

  // Non-exact: modifier is required only if specified
  if (parsed.ctrl && !e.ctrlKey) return false;
  if (parsed.meta && !e.metaKey) return false;
  if (parsed.alt && !e.altKey) return false;
  if (parsed.shift && !e.shiftKey) return false;

  return true;
}

/**
 * Registers one or more keyboard shortcuts with automatic cleanup.
 *
 * @example
 * ```typescript
 * import { registerShortcut } from '@llein/keyboard-shortcut-listener';
 *
 * // Listen for Cmd+K (Mac) or Ctrl+K (Windows)
 * const unregister = registerShortcut('mod+k', (e) => {
 *   openCommandPalette();
 * }, { preventDefault: true });
 *
 * // Cleanup when done
 * unregister();
 * ```
 */
export function registerShortcut(
  combo: string | string[],
  handler: (e: KeyboardEvent) => void,
  options: ShortcutOptions = {}
): () => void {
  const {
    ignoreInputs = true,
    target = typeof window !== 'undefined' ? window : null,
    preventDefault = false,
    exactModifiers = true
  } = options;

  if (!target) return () => {};

  const comboList = Array.isArray(combo)
    ? combo
    : combo.split(',').map((c) => c.trim()).filter(Boolean);

  const parsedList = comboList.map(parseCombo);

  const listener = (event: Event) => {
    const e = event as KeyboardEvent;

    if (ignoreInputs && typeof document !== 'undefined') {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }
    }

    const matched = parsedList.some((parsed) => matchesCombo(e, parsed, exactModifiers));
    if (matched) {
      if (preventDefault) {
        e.preventDefault();
      }
      handler(e);
    }
  };

  target.addEventListener('keydown', listener as EventListener);
  return () => target.removeEventListener('keydown', listener as EventListener);
}
