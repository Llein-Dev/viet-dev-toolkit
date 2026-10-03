export interface EnvRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'url';
  enum?: string[];
  default?: any;
}

export function assertEnv(schema: Record<string, EnvRule>): Record<string, any> {
  const missing: string[] = [];
  const invalid: string[] = [];
  const parsed: Record<string, any> = {};

  for (const [key, rule] of Object.entries(schema)) {
    let val = process.env[key];

    if (val === undefined || val === '') {
      if (rule.default !== undefined) {
        parsed[key] = rule.default;
        continue;
      }
      if (rule.required) {
        missing.push(key);
        continue;
      }
    }

    if (val !== undefined && val !== '') {
      if (rule.type === 'number') {
        const num = Number(val);
        if (isNaN(num)) invalid.push(`${key}: Expected number, got "${val}"`);
        else parsed[key] = num;
      } else if (rule.type === 'boolean') {
        parsed[key] = val === 'true' || val === '1';
      } else if (rule.type === 'url') {
        try {
          new URL(val);
          parsed[key] = val;
        } catch {
          invalid.push(`${key}: Expected valid URL, got "${val}"`);
        }
      } else {
        parsed[key] = val;
      }

      if (rule.enum && !rule.enum.includes(val)) {
        invalid.push(`${key}: Must be one of [${rule.enum.join(', ')}], got "${val}"`);
      }
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    const lines = [
      '❌ [env-assert-strict] Environment Configuration Errors:',
      ...missing.map((k) => `  - Missing required variable: ${k}`),
      ...invalid.map((e) => `  - Invalid value: ${e}`)
    ];
    throw new Error(lines.join('\n'));
  }

  return parsed;
}
