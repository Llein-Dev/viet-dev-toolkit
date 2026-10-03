export function renderPrompt(template: string, data: Record<string, any> = {}): string {
  let result = template;

  // Handle conditional blocks: {{#if key}}content{{/if}}
  result = result.replace(/\{\{#if\s+([a-zA-Z0-9_]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, content) => {
    return data[key] ? content : '';
  });

  // Handle variables with optional defaults: {{key|fallback}}
  result = result.replace(/\{\{\s*([a-zA-Z0-9_]+)(\|([^}]+))?\s*\}\}/g, (_, key, __, fallback) => {
    const val = data[key];
    if (val !== undefined && val !== null) {
      return String(val);
    }
    return fallback !== undefined ? fallback.trim() : '';
  });

  return result;
}

export function compilePrompt(template: string) {
  return (data: Record<string, any>) => renderPrompt(template, data);
}
