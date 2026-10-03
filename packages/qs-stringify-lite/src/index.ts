export function stringifyQuery(obj: Record<string, any>, prefix = ''): string {
  const pairs: string[] = [];

  for (const [key, val] of Object.entries(obj)) {
    if (val === undefined || val === null) continue;

    const fullKey = prefix ? `${prefix}[${key}]` : key;

    if (Array.isArray(val)) {
      for (const item of val) {
        pairs.push(`${encodeURIComponent(fullKey)}[]=${encodeURIComponent(String(item))}`);
      }
    } else if (typeof val === 'object') {
      pairs.push(stringifyQuery(val, fullKey));
    } else {
      pairs.push(`${encodeURIComponent(fullKey)}=${encodeURIComponent(String(val))}`);
    }
  }

  return pairs.filter(Boolean).join('&');
}

export function parseQuery(queryString: string): Record<string, any> {
  const clean = queryString.replace(/^\?/, '');
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
