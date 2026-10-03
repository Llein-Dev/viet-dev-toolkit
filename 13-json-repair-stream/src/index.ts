export function repairJson(raw: string): string {
  if (!raw || typeof raw !== 'string') return '{}';

  let str = raw.trim();

  // Strip Markdown code fence if model wrapped in ```json ... ```
  if (str.startsWith('```json')) {
    str = str.replace(/^```json\s*/, '').replace(/```$/, '').trim();
  } else if (str.startsWith('```')) {
    str = str.replace(/^```\s*/, '').replace(/```$/, '').trim();
  }

  // Try direct parse first
  try {
    JSON.parse(str);
    return str;
  } catch {
    // Proceed to repair
  }

  // Close unclosed quotes
  let inString = false;
  let escape = false;
  const stack: ('{' | '[')[] = [];

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === '\\' && inString) {
      escape = !escape;
      continue;
    }
    if (ch === '"' && !escape) {
      inString = !inString;
    } else if (!inString) {
      if (ch === '{' || ch === '[') {
        stack.push(ch);
      } else if (ch === '}' && stack[stack.length - 1] === '{') {
        stack.pop();
      } else if (ch === ']' && stack[stack.length - 1] === '[') {
        stack.pop();
      }
    }
    escape = false;
  }

  // If broken inside a string, close quote or cut incomplete value
  if (inString) {
    str += '"';
  }

  // Remove trailing comma if any
  str = str.replace(/,\s*$/, '');

  // Close unclosed brackets in reverse order
  while (stack.length > 0) {
    const open = stack.pop();
    str += open === '{' ? '}' : ']';
  }

  return str;
}

export function safeParseStreamJson<T = any>(raw: string, fallback: T = {} as T): T {
  try {
    const fixed = repairJson(raw);
    return JSON.parse(fixed);
  } catch {
    return fallback;
  }
}
