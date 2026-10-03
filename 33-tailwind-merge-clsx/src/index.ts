export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

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
  const tokens = classes.join(' ').trim().split(/\s+/);

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
