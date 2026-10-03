export interface ShortcutOptions {
  ignoreInputs?: boolean;
  target?: HTMLElement | Window;
}

export function parseCombo(combo: string) {
  const parts = combo.toLowerCase().split('+').map((p) => p.trim());
  return {
    ctrl: parts.includes('ctrl'),
    meta: parts.includes('cmd') || parts.includes('meta'),
    alt: parts.includes('alt'),
    shift: parts.includes('shift'),
    key: parts.find((p) => !['ctrl', 'cmd', 'meta', 'alt', 'shift'].includes(p)) || ''
  };
}

export function registerShortcut(
  combo: string,
  handler: (e: KeyboardEvent) => void,
  options: ShortcutOptions = {}
) {
  const { ignoreInputs = true, target = typeof window !== 'undefined' ? window : null } = options;
  if (!target) return () => {};

  const parsed = parseCombo(combo);

  const listener = (event: Event) => {
    const e = event as KeyboardEvent;
    if (ignoreInputs) {
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

    const matchesCtrl = parsed.ctrl ? e.ctrlKey : true;
    const matchesMeta = parsed.meta ? e.metaKey : true;
    const matchesAlt = parsed.alt ? e.altKey : true;
    const matchesShift = parsed.shift ? e.shiftKey : true;
    const matchesKey = e.key.toLowerCase() === parsed.key.toLowerCase();

    if (matchesCtrl && matchesMeta && matchesAlt && matchesShift && matchesKey) {
      handler(e);
    }
  };

  target.addEventListener('keydown', listener);
  return () => target.removeEventListener('keydown', listener);
}
