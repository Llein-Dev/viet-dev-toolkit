import { useEffect, useRef } from 'react';
import { registerShortcut, ShortcutOptions } from './index';

export interface UseKeyboardShortcutOptions extends ShortcutOptions {
  /**
   * Whether the shortcut listener is actively listening.
   * Useful to temporarily pause listening when modals or dialogs are closed.
   * @default true
   */
  enabled?: boolean;
}

/**
 * React Custom Hook to listen for keyboard shortcuts with automatic lifecycle cleanup.
 *
 * @example
 * ```tsx
 * import { useKeyboardShortcut } from '@llein/keyboard-shortcut-listener/react';
 *
 * function App() {
 *   // Open search modal with Cmd+K (Mac) or Ctrl+K (Win)
 *   useKeyboardShortcut('mod+k', () => {
 *     setSearchOpen(true);
 *   }, { preventDefault: true });
 *
 *   // Quick save with Ctrl+S / Cmd+S
 *   useKeyboardShortcut('mod+s', (e) => {
 *     handleSave();
 *   }, { preventDefault: true });
 *
 *   // Close modal on Escape
 *   useKeyboardShortcut('escape', () => {
 *     closeModal();
 *   });
 *
 *   return <div>Press Cmd+K or Ctrl+K</div>;
 * }
 * ```
 */
export function useKeyboardShortcut(
  combo: string | string[],
  handler: (e: KeyboardEvent) => void,
  options: UseKeyboardShortcutOptions = {}
): void {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const { enabled = true, ...restOptions } = options;

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const unregister = registerShortcut(
      combo,
      (e) => {
        handlerRef.current(e);
      },
      restOptions
    );

    return () => {
      unregister();
    };
  }, [
    Array.isArray(combo) ? combo.join('|') : combo,
    enabled,
    restOptions.ignoreInputs,
    restOptions.preventDefault,
    restOptions.exactModifiers,
    restOptions.target
  ]);
}
