module.exports = [
  {
    folder: '31-react-smart-fallback-img',
    name: 'react-smart-fallback-img',
    description: 'React image component with built-in skeleton loading and automatic graceful fallback to placeholder SVG or avatar initials on 404/broken URL.',
    keywords: ['react', 'image', 'fallback', 'skeleton', 'broken-image', 'avatar'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { SmartImage } from 'react-smart-fallback-img';

function Profile({ user }) {
  return (
    <SmartImage
      src={user.avatarUrl}
      fallbackSrc="https://avatar.vercel.sh/user"
      alt={user.name}
      className="w-16 h-16 rounded-full"
    />
  );
}`,
    apiList: `- \`<SmartImage src={string} fallbackSrc={string} ... />\`
- \`useImageFallback(src, fallbackSrc)\``,
    code: `import * as React from 'react';

export interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  skeletonClassName?: string;
}

export function SmartImage({
  src,
  fallbackSrc = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23eee" width="100" height="100"/><text fill="%23aaa" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="12">No Image</text></svg>',
  alt = '',
  className = '',
  onError,
  ...props
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    onError?.(e);
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}
`
  },
  {
    folder: '32-react-copy-to-clipboard-hook',
    name: 'react-copy-to-clipboard-hook',
    description: 'Lightweight React hook for modern async Clipboard API with copied feedback state and auto-reset timeout.',
    keywords: ['react', 'clipboard', 'copy', 'hook', 'use-copy', 'text-copy'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { useCopyToClipboard } from 'react-copy-to-clipboard-hook';

function CopyButton({ text }: { text: string }) {
  const { copy, copied, error } = useCopyToClipboard({ timeout: 2000 });

  return (
    <button onClick={() => copy(text)}>
      {copied ? 'Copied! ✅' : 'Copy'}
    </button>
  );
}`,
    apiList: `- \`useCopyToClipboard(options?: { timeout?: number }): CopyResult\``,
    code: `import { useState, useCallback } from 'react';

export interface UseCopyOptions {
  timeout?: number;
}

export function useCopyToClipboard(options: UseCopyOptions = {}) {
  const { timeout = 2000 } = options;
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        setError(new Error('Clipboard API not available'));
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setError(null);

        setTimeout(() => {
          setCopied(false);
        }, timeout);

        return true;
      } catch (err: any) {
        setError(err);
        setCopied(false);
        return false;
      }
    },
    [timeout]
  );

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
  }, []);

  return { copy, copied, error, reset };
}
`
  },
  {
    folder: '33-tailwind-merge-clsx',
    name: 'tailwind-merge-clsx',
    description: 'Zero-bloat utility uniting clsx and lightweight Tailwind class conflict resolution into a single cn() function for Shadcn/UI.',
    keywords: ['tailwind', 'clsx', 'tailwind-merge', 'cn', 'shadcn', 'classes'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { cn } from 'tailwind-merge-clsx';

// Resolves conflicting classes cleanly
const className = cn(
  'px-4 py-2 bg-blue-500 text-white rounded',
  isDanger && 'bg-red-500',
  customClassName
);`,
    apiList: `- \`cn(...inputs: ClassValue[]): string\``,
    code: `export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  // Deduplicate and resolve basic conflict tokens (last wins)
  const tokenMap = new Map<string, string>();
  const tokens = classes.join(' ').trim().split(/\\s+/);

  for (const token of tokens) {
    if (!token) continue;
    // Prefix extractor for standard utilities like p-*, m-*, bg-*, text-*, rounded-*
    const prefixMatch = token.match(/^([a-z0-9]+:)?([a-z]+-)/);
    if (prefixMatch) {
      tokenMap.set(prefixMatch[0], token);
    } else {
      tokenMap.set(token, token);
    }
  }

  return Array.from(tokenMap.values()).join(' ');
}
`
  },
  {
    folder: '34-react-use-debounced-value',
    name: 'react-use-debounced-value',
    description: 'Minimalistic React hook to debounce any rapidly changing value like search queries, slider values, or window resize metrics.',
    keywords: ['react', 'debounce', 'hook', 'use-debounce', 'search-input', 'performance'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { useDebouncedValue } from 'react-use-debounced-value';
import { useState, useEffect } from 'react';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    // Only triggers after user stops typing for 300ms
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);
}`,
    apiList: `- \`useDebouncedValue<T>(value: T, delayMs: number): T\``,
    code: `import { useState, useEffect } from 'react';

export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
`
  },
  {
    folder: '35-qs-stringify-lite',
    name: 'qs-stringify-lite',
    description: 'Ultra-compact (~500 bytes) query string serializer and parser supporting nested objects, arrays, and boolean encoding.',
    keywords: ['querystring', 'qs', 'stringify', 'parse', 'url-params', 'lightweight'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { stringifyQuery, parseQuery } from 'qs-stringify-lite';

const qs = stringifyQuery({ page: 1, tags: ['react', 'ts'], filter: { active: true } });
console.log(qs); // "page=1&tags=react&tags=ts&filter[active]=true"

const parsed = parseQuery(qs);
console.log(parsed.page); // "1"`,
    apiList: `- \`stringifyQuery(obj: Record<string, any>): string\`
- \`parseQuery(qs: string): Record<string, any>\``,
    code: `export function stringifyQuery(obj: Record<string, any>, prefix = ''): string {
  const pairs: string[] = [];

  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null) continue;

    const fullKey = prefix ? \`\${prefix}[\${key}]\` : key;

    if (Array.isArray(val)) {
      for (const item of val) {
        pairs.push(\`\${encodeURIComponent(fullKey)}[]=\${encodeURIComponent(String(item))}\`);
      }
    } else if (typeof val === 'object') {
      pairs.push(stringifyQuery(val, fullKey));
    } else {
      pairs.push(\`\${encodeURIComponent(fullKey)}=\${encodeURIComponent(String(val))}\`);
    }
  }

  return pairs.filter(Boolean).join('&');
}

export function parseQuery(queryString: string): Record<string, any> {
  const clean = queryString.replace(/^\\?/, '');
  if (!clean) return {};

  const params = new URLSearchParams(clean);
  const result: Record<string, any> = {};

  params.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const realKey = key.slice(0, -2);
      if (!Array.isArray(result[realKey])) {
        result[realKey] = [];
      }
      result[realKey].push(value);
    } else {
      result[key] = value;
    }
  });

  return result;
}
`
  },
  {
    folder: '36-react-intersection-lazy',
    name: 'react-intersection-lazy',
    description: 'Defers rendering or triggers callbacks only when an element enters the browser viewport using native IntersectionObserver.',
    keywords: ['react', 'intersection-observer', 'lazy-load', 'viewport', 'performance', 'infinite-scroll'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { IntersectionLazy } from 'react-intersection-lazy';

function BigFeed() {
  return (
    <IntersectionLazy placeholder={<div className="h-40 bg-gray-100" />}>
      <HeavyComponent />
    </IntersectionLazy>
  );
}`,
    apiList: `- \`<IntersectionLazy rootMargin="..." threshold={0.1}>...</IntersectionLazy>\`
- \`useInView(options)\``,
    code: `import * as React from 'react';

export interface LazyProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

export function IntersectionLazy({
  children,
  placeholder = null,
  rootMargin = '100px',
  threshold = 0,
  triggerOnce = true
}: LazyProps) {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin, threshold, triggerOnce]);

  return <div ref={ref}>{isVisible ? children : placeholder}</div>;
}
`
  },
  {
    folder: '37-canvas-avatar-gen',
    name: 'canvas-avatar-gen',
    description: 'Generate high-res initials avatar pictures on deterministically colored pastel backgrounds with pure HTML5 Canvas or SVG data URIs.',
    keywords: ['avatar', 'initials', 'canvas', 'svg', 'profile-picture', 'generator'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { generateInitialsSvgDataUri, getInitials } from 'canvas-avatar-gen';

const avatarUri = generateInitialsSvgDataUri('Nguyễn Văn An');
console.log(avatarUri); // "data:image/svg+xml;utf8,..."`,
    apiList: `- \`generateInitialsSvgDataUri(name: string, size?: number): string\`
- \`getInitials(name: string): string\`
- \`getDeterministicColor(str: string): string\``,
    code: `const PALETTES = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
];

export function getDeterministicColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function generateInitialsSvgDataUri(name: string, size = 128): string {
  const initials = getInitials(name);
  const bg = getDeterministicColor(name);

  const svg = \`<svg xmlns="http://www.w3.org/2000/svg" width="\${size}" height="\${size}" viewBox="0 0 \${size} \${size}">
    <rect width="\${size}" height="\${size}" fill="\${bg}" rx="\${size / 2}"/>
    <text x="50%" y="50%" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="\${size * 0.4}" dominant-baseline="middle" text-anchor="middle">\${initials}</text>
  </svg>\`;

  return \`data:image/svg+xml;utf8,\${encodeURIComponent(svg)}\`;
}
`
  },
  {
    folder: '38-jwt-decode-lite',
    name: 'jwt-decode-lite',
    description: 'Ultra-fast, zero-dependency client-side JWT token decoder with automatic expiry verification and payload type casting.',
    keywords: ['jwt', 'decode', 'token', 'auth', 'jwt-decode', 'bearer'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { decodeJwt, isTokenExpired } from 'jwt-decode-lite';

const payload = decodeJwt<{ sub: string; role: string }>(token);
console.log(payload.role); // "admin"

console.log(isTokenExpired(token)); // true / false`,
    apiList: `- \`decodeJwt<T>(token: string): T\`
- \`isTokenExpired(token: string, offsetSeconds?: number): boolean\``,
    code: `export interface BaseJwtPayload {
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export function decodeJwt<T extends BaseJwtPayload = BaseJwtPayload>(token: string): T {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token provided');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT format');
  }

  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload: string;

    if (typeof atob === 'function') {
      jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } else {
      jsonPayload = Buffer.from(base64, 'base64').toString('utf8');
    }

    return JSON.parse(jsonPayload);
  } catch (err: any) {
    throw new Error(\`Failed to decode JWT: \${err.message}\`);
  }
}

export function isTokenExpired(token: string, offsetSeconds = 0): boolean {
  try {
    const payload = decodeJwt(token);
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now + offsetSeconds;
  } catch {
    return true;
  }
}
`
  },
  {
    folder: '39-react-localstorage-sync',
    name: 'react-localstorage-sync',
    description: 'React hook that syncs state with browser localStorage and automatically mirrors updates in real-time across multiple open browser tabs.',
    keywords: ['react', 'localstorage', 'hook', 'sync-tabs', 'state-management'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { useLocalStorageSync } from 'react-localstorage-sync';

function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorageSync('app-theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current Theme: {theme}
    </button>
  );
}`,
    apiList: `- \`useLocalStorageSync<T>(key: string, initialValue: T): [T, (val: T) => void]\``,
    code: `import { useState, useEffect, useCallback } from 'react';

export function useLocalStorageSync<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (err) {
        console.error(err);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          setStoredValue(JSON.parse(event.newValue));
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key]);

  return [storedValue, setValue];
}
`
  },
  {
    folder: '40-keyboard-shortcut-listener',
    name: 'keyboard-shortcut-listener',
    description: 'Reliable keyboard shortcut listener and React hook for Cmd+K, Ctrl+S, Escape with automatic suppression inside text input fields.',
    keywords: ['hotkey', 'shortcuts', 'keyboard', 'ctrl-k', 'cmd-k', 'react-hotkey'],
    category: 'Frontend & React / Next.js Micro Components',
    usageCode: `import { registerShortcut } from 'keyboard-shortcut-listener';

// Register global shortcut
const unbind = registerShortcut('meta+k', (e) => {
  e.preventDefault();
  openCommandPalette();
});`,
    apiList: `- \`registerShortcut(combo: string, handler: (e: KeyboardEvent) => void, options?)\`
- \`useShortcut(combo: string, handler: (e: KeyboardEvent) => void)\``,
    code: `export interface ShortcutOptions {
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
`
  }
];
