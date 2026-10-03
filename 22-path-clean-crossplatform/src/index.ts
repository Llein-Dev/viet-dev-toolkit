export function toPosixPath(filepath: string): string {
  if (!filepath) return '';
  return filepath.replace(/\\/g, '/');
}

export function cleanPath(filepath: string): string {
  if (!filepath) return '';

  let normalized = toPosixPath(filepath);

  // Preserve Windows drive letter
  const driveMatch = normalized.match(/^([a-zA-Z]:)(\/.*)?$/);
  let prefix = '';
  if (driveMatch) {
    prefix = driveMatch[1];
    normalized = driveMatch[2] || '/';
  }

  const parts = normalized.split('/').filter(Boolean);
  const stack: string[] = [];

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop();
      } else {
        stack.push('..');
      }
    } else {
      stack.push(part);
    }
  }

  const result = stack.join('/');
  if (prefix) {
    return prefix + (result ? '/' + result : '');
  }
  return (filepath.startsWith('/') ? '/' : '') + result;
}
