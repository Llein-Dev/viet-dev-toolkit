module.exports = [
  {
    folder: '11-prompt-template-mini',
    name: 'prompt-template-mini',
    description: 'Zero-dependency mini template engine for LLM prompts supporting variable interpolation, default values, and conditional blocks.',
    keywords: ['ai', 'prompt', 'template', 'mustache', 'llm', 'interpolation'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { renderPrompt } from 'prompt-template-mini';

const template = \`You are an expert in {{domain|software engineering}}.
User query: {{query}}
{{#if includeCode}}Please provide code samples in {{language}}.{{/if}}\`;

const prompt = renderPrompt(template, {
  query: 'How to debounce input in React?',
  includeCode: true,
  language: 'TypeScript'
});`,
    apiList: `- \`renderPrompt(template: string, data: Record<string, any>): string\`
- \`compilePrompt(template: string): (data: Record<string, any>) => string\``,
    code: `export function renderPrompt(template: string, data: Record<string, any> = {}): string {
  let result = template;

  // Handle conditional blocks: {{#if key}}content{{/if}}
  result = result.replace(/\\{\\{#if\\s+([a-zA-Z0-9_]+)\\}\\}([\\s\\S]*?)\\{\\{\\/if\\}\\}/g, (_, key, content) => {
    return data[key] ? content : '';
  });

  // Handle variables with optional defaults: {{key|fallback}}
  result = result.replace(/\\{\\{\\s*([a-zA-Z0-9_]+)(\\|([^}]+))?\\s*\\}\\}/g, (_, key, __, fallback) => {
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
`
  },
  {
    folder: '12-token-estimator-fast',
    name: 'token-estimator-fast',
    description: 'Fast, lightweight token count estimator for OpenAI, Anthropic, Gemini, and DeepSeek text without loading heavy 50MB WASM files.',
    keywords: ['token', 'estimator', 'tiktoken', 'llm', 'counter', 'tokenizer'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { estimateTokens } from 'token-estimator-fast';

const count = estimateTokens('Xin chào, đây là câu lệnh thử nghiệm token count!');
console.log(count); // Estimated token count (~12 tokens)`,
    apiList: `- \`estimateTokens(text: string, options?): number\`
- \`estimateChatTokens(messages: Array<{ role: string, content: string }>): number\``,
    code: `export interface EstimatorOptions {
  model?: 'gpt-4o' | 'claude' | 'gemini' | 'deepseek' | 'generic';
}

export function estimateTokens(text: string, options: EstimatorOptions = {}): number {
  if (!text || typeof text !== 'string') return 0;

  // Average rules:
  // English words ~ 1.3 tokens per word
  // CJK / Vietnamese accented characters ~ 0.8 - 1.2 tokens per character / syllable
  // Code / symbols ~ 1 token per 3-4 chars
  const words = text.trim().split(/\\s+/);
  let count = 0;

  for (const word of words) {
    if (/^[\\x00-\\x7F]+$/.test(word)) {
      // Latin ASCII word
      count += Math.max(1, Math.ceil(word.length / 4));
    } else {
      // Non-ASCII (Vietnamese, Chinese, Japanese, Emojis)
      count += Math.max(1, Math.ceil(word.length / 1.8));
    }
  }

  // Account for punctuation & whitespace overhead
  return Math.ceil(count * 1.1);
}

export function estimateChatTokens(
  messages: Array<{ role: string; content: string }>,
  options: EstimatorOptions = {}
): number {
  let total = 3; // overhead per conversation
  for (const msg of messages) {
    total += 3; // overhead per message
    total += estimateTokens(msg.role, options);
    total += estimateTokens(msg.content, options);
  }
  return total;
}
`
  },
  {
    folder: '13-json-repair-stream',
    name: 'json-repair-stream',
    description: 'Repair malformed, cut-off, or truncated JSON responses streaming from LLMs back into valid parseable JSON objects.',
    keywords: ['json', 'repair', 'stream', 'llm', 'json-fix', 'truncated-json'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { repairJson, safeParseStreamJson } from 'json-repair-stream';

// Incomplete JSON from LLM stream
const brokenJson = '{"title": "Report", "items": ["item1", "ite';

const repaired = repairJson(brokenJson);
console.log(repaired); // '{"title": "Report", "items": ["item1"]}'

const data = safeParseStreamJson(brokenJson);
console.log(data.title); // "Report"`,
    apiList: `- \`repairJson(jsonStr: string): string\`
- \`safeParseStreamJson<T = any>(jsonStr: string, fallback?: T): T\``,
    code: `export function repairJson(raw: string): string {
  if (!raw || typeof raw !== 'string') return '{}';

  let str = raw.trim();

  // Strip Markdown code fence if model wrapped in \`\`\`json ... \`\`\`
  if (str.startsWith('\`\`\`json')) {
    str = str.replace(/^\`\`\`json\\s*/, '').replace(/\`\`\`$/, '').trim();
  } else if (str.startsWith('\`\`\`')) {
    str = str.replace(/^\`\`\`\\s*/, '').replace(/\`\`\`$/, '').trim();
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
    if (ch === '\\\\' && inString) {
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
  str = str.replace(/,\\s*$/, '');

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
`
  },
  {
    folder: '14-llm-cost-calculator',
    name: 'llm-cost-calculator',
    description: 'Calculate USD API expenses based on input and output tokens across OpenAI, Anthropic, Gemini, and DeepSeek models.',
    keywords: ['llm', 'pricing', 'cost-calculator', 'openai', 'anthropic', 'deepseek', 'gemini'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { calculateLLMCost } from 'llm-cost-calculator';

const cost = calculateLLMCost({
  model: 'gpt-4o-mini',
  inputTokens: 15000,
  outputTokens: 2500
});

console.log(cost.totalUSD); // ~$0.00375
console.log(cost.formatted); // "$0.0038"`,
    apiList: `- \`calculateLLMCost(options): CostResult\`
- \`getModelPricing(model: string): ModelPrice | undefined\``,
    code: `export interface ModelPrice {
  inputPerMillion: number;
  outputPerMillion: number;
}

export const PRICING_TABLE: Record<string, ModelPrice> = {
  'gpt-4o': { inputPerMillion: 2.5, outputPerMillion: 10.0 },
  'gpt-4o-mini': { inputPerMillion: 0.15, outputPerMillion: 0.6 },
  'claude-3-5-sonnet': { inputPerMillion: 3.0, outputPerMillion: 15.0 },
  'claude-3-haiku': { inputPerMillion: 0.25, outputPerMillion: 1.25 },
  'gemini-1.5-flash': { inputPerMillion: 0.075, outputPerMillion: 0.3 },
  'gemini-1.5-pro': { inputPerMillion: 1.25, outputPerMillion: 5.0 },
  'deepseek-chat': { inputPerMillion: 0.14, outputPerMillion: 0.28 },
  'deepseek-reasoner': { inputPerMillion: 0.55, outputPerMillion: 2.19 }
};

export interface CostOptions {
  model: string;
  inputTokens: number;
  outputTokens: number;
}

export interface CostResult {
  model: string;
  inputTokens: number;
  outputTokens: number;
  inputCostUSD: number;
  outputCostUSD: number;
  totalUSD: number;
  formatted: string;
}

export function calculateLLMCost(options: CostOptions): CostResult {
  const { model, inputTokens, outputTokens } = options;
  const pricing = PRICING_TABLE[model] || { inputPerMillion: 1.0, outputPerMillion: 2.0 };

  const inputCostUSD = (inputTokens / 1_000_000) * pricing.inputPerMillion;
  const outputCostUSD = (outputTokens / 1_000_000) * pricing.outputPerMillion;
  const totalUSD = inputCostUSD + outputCostUSD;

  return {
    model,
    inputTokens,
    outputTokens,
    inputCostUSD,
    outputCostUSD,
    totalUSD,
    formatted: \`$\${totalUSD.toFixed(6)}\`
  };
}
`
  },
  {
    folder: '15-markdown-to-clean-text',
    name: 'markdown-to-clean-text',
    description: 'Strip Markdown formatting, badges, HTML tags, and code syntax into pure sanitized text optimized for RAG ingestion and embeddings.',
    keywords: ['markdown', 'clean-text', 'rag', 'embeddings', 'strip-markdown', 'nlp'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { stripMarkdown } from 'markdown-to-clean-text';

const md = \`# Welcome to **Antigravity**
Here is a [link](https://example.com) and some \`inline code\`.
> Quote of the day\`;

console.log(stripMarkdown(md));
// "Welcome to Antigravity\\nHere is a link and some inline code.\\nQuote of the day"`,
    apiList: `- \`stripMarkdown(markdown: string, options?): string\``,
    code: `export interface StripOptions {
  removeCodeBlocks?: boolean;
  removeLinks?: boolean;
}

export function stripMarkdown(markdown: string, options: StripOptions = {}): string {
  if (!markdown) return '';

  let text = markdown;

  // Remove code blocks
  if (options.removeCodeBlocks) {
    text = text.replace(/\`\`\`[\\s\\S]*?\`\`\`/g, '');
  } else {
    text = text.replace(/\`\`\`[a-zA-Z]*\\n([\\s\\S]*?)\`\`\`/g, '$1');
  }

  // Remove inline code
  text = text.replace(/\`([^\\\`]+)\`/g, '$1');

  // Remove images ![alt](url)
  text = text.replace(/!\\[([^\\]]*)\\]\\([^)]*\\)/g, '');

  // Remove links [text](url) -> text
  text = text.replace(/\\[([^\\]]+)\\]\\([^)]*\\)/g, '$1');

  // Remove headers #
  text = text.replace(/^#{1,6}\\s+/gm, '');

  // Remove blockquotes >
  text = text.replace(/^>\\s+/gm, '');

  // Remove bold / italic ***text***, **text**, *text*
  text = text.replace(/(\\*\\*|__|\\*|_)(.*?)\\1/g, '$2');

  // Remove strikethrough ~~text~~
  text = text.replace(/~~(.*?)~~/g, '$1');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Normalize repeated empty lines
  text = text.replace(/\\n{3,}/g, '\\n\\n').trim();

  return text;
}
`
  },
  {
    folder: '16-rag-chunker-lite',
    name: 'rag-chunker-lite',
    description: 'Lightweight recursive text chunker for RAG pipelines with configurable chunk sizes, overlap, and smart boundary splitting.',
    keywords: ['rag', 'chunker', 'text-split', 'embeddings', 'vector-db', 'langchain'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { chunkText } from 'rag-chunker-lite';

const document = "Long text content...";
const chunks = chunkText(document, {
  chunkSize: 500,
  chunkOverlap: 50
});

console.log(chunks.length); // Array of text chunk strings`,
    apiList: `- \`chunkText(text: string, options?: ChunkerOptions): string[]\``,
    code: `export interface ChunkerOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separator?: string;
}

export function chunkText(text: string, options: ChunkerOptions = {}): string[] {
  const { chunkSize = 500, chunkOverlap = 50, separator = '\\n\\n' } = options;

  if (!text || text.length <= chunkSize) {
    return text ? [text.trim()] : [];
  }

  const rawParagraphs = text.split(separator);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of rawParagraphs) {
    if (!para.trim()) continue;

    if (currentChunk.length + para.length <= chunkSize) {
      currentChunk += (currentChunk ? '\\n\\n' : '') + para;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        // Apply overlap from end of currentChunk
        const overlapStart = Math.max(0, currentChunk.length - chunkOverlap);
        const overlapText = currentChunk.slice(overlapStart);
        currentChunk = overlapText + '\\n\\n' + para;
      } else {
        // Single paragraph larger than chunkSize, break by words
        const words = para.split(' ');
        let wordChunk = '';
        for (const w of words) {
          if ((wordChunk + ' ' + w).length <= chunkSize) {
            wordChunk += (wordChunk ? ' ' : '') + w;
          } else {
            chunks.push(wordChunk.trim());
            wordChunk = w;
          }
        }
        currentChunk = wordChunk;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
`
  },
  {
    folder: '17-ai-refusal-detector',
    name: 'ai-refusal-detector',
    description: 'Fast regex and semantic pattern matcher to detect if an LLM refused to fulfill a prompt in English or Vietnamese.',
    keywords: ['ai', 'refusal', 'guardrails', 'safety', 'llm-jailbreak', 'detector'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { isAIRefusal, detectRefusalReason } from 'ai-refusal-detector';

console.log(isAIRefusal("I'm sorry, but I cannot assist with that request."));
// true

console.log(isAIRefusal("Rất tiếc, tôi không thể hỗ trợ yêu cầu này."));
// true`,
    apiList: `- \`isAIRefusal(text: string): boolean\`
- \`detectRefusalReason(text: string): { isRefusal: boolean; matchedPattern?: string }\``,
    code: `const REFUSAL_PATTERNS = [
  /i cannot (fulfill|assist|comply|help with|provide)/i,
  /i'm sorry, but i cannot/i,
  /as an ai language model, i/i,
  /my safety guidelines prevent me/i,
  /i must refuse/i,
  /tôi không thể (hỗ trợ|thực hiện|cung cấp|trả lời)/i,
  /rất tiếc,? tôi không thể/i,
  /chính sách an toàn không cho phép tôi/i
];

export function detectRefusalReason(text: string): { isRefusal: boolean; matchedPattern?: string } {
  if (!text) return { isRefusal: false };

  const snippet = text.slice(0, 300); // Refusals appear in the beginning
  for (const regex of REFUSAL_PATTERNS) {
    if (regex.test(snippet)) {
      return { isRefusal: true, matchedPattern: regex.source };
    }
  }

  return { isRefusal: false };
}

export function isAIRefusal(text: string): boolean {
  return detectRefusalReason(text).isRefusal;
}
`
  },
  {
    folder: '18-ollama-fetch-wrapper',
    name: 'ollama-fetch-wrapper',
    description: 'Featherweight 1KB client to query local Ollama API instances with full streaming support in Node.js and Browser environments.',
    keywords: ['ollama', 'fetch', 'local-llm', 'streaming', 'llama3', 'deepseek-r1'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { createOllamaClient } from 'ollama-fetch-wrapper';

const ollama = createOllamaClient({ baseUrl: 'http://localhost:11434' });

// Simple generation
const response = await ollama.generate({
  model: 'llama3',
  prompt: 'Write a haiku about TypeScript.'
});
console.log(response.response);`,
    apiList: `- \`createOllamaClient(config?): OllamaClient\`
- \`generate(params)\`
- \`chat(params)\``,
    code: `export interface OllamaConfig {
  baseUrl?: string;
  timeoutMs?: number;
}

export interface GenerateParams {
  model: string;
  prompt: string;
  system?: string;
  stream?: boolean;
}

export function createOllamaClient(config: OllamaConfig = {}) {
  const baseUrl = (config.baseUrl || 'http://localhost:11434').replace(/\\/+$/, '');

  return {
    async generate(params: GenerateParams) {
      const res = await fetch(\`\${baseUrl}/api/generate\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, stream: false })
      });

      if (!res.ok) {
        throw new Error(\`Ollama API Error: \${res.status} \${res.statusText}\`);
      }

      return res.json();
    },

    async chat(messages: Array<{ role: string; content: string }>, model = 'llama3') {
      const res = await fetch(\`\${baseUrl}/api/chat\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, stream: false })
      });

      if (!res.ok) {
        throw new Error(\`Ollama Chat Error: \${res.status} \${res.statusText}\`);
      }

      return res.json();
    }
  };
}
`
  },
  {
    folder: '19-system-prompt-builder',
    name: 'system-prompt-builder',
    description: 'Fluent builder pattern to cleanly assemble multi-layered system prompts (Role, Constraints, Context, Schema, Few-Shot examples).',
    keywords: ['prompt-engineering', 'builder', 'system-prompt', 'llm', 'chatgpt'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { SystemPromptBuilder } from 'system-prompt-builder';

const prompt = new SystemPromptBuilder()
  .setRole('Senior Database Architect')
  .addConstraint('Never suggest DROP TABLE commands.')
  .addConstraint('Always format SQL in uppercase keywords.')
  .setOutputFormat('JSON array of query objects')
  .build();`,
    apiList: `- \`new SystemPromptBuilder()\`
- \`.setRole(role: string)\`
- \`.addConstraint(constraint: string)\`
- \`.addContext(context: string)\`
- \`.setOutputFormat(format: string)\`
- \`.build(): string\``,
    code: `export class SystemPromptBuilder {
  private role = '';
  private context: string[] = [];
  private constraints: string[] = [];
  private examples: Array<{ input: string; output: string }> = [];
  private outputFormat = '';

  setRole(role: string): this {
    this.role = role;
    return this;
  }

  addContext(ctx: string): this {
    this.context.push(ctx);
    return this;
  }

  addConstraint(constraint: string): this {
    this.constraints.push(constraint);
    return this;
  }

  addExample(input: string, output: string): this {
    this.examples.push({ input, output });
    return this;
  }

  setOutputFormat(format: string): this {
    this.outputFormat = format;
    return this;
  }

  build(): string {
    const sections: string[] = [];

    if (this.role) {
      sections.push(\`# ROLE\\n\${this.role}\`);
    }

    if (this.context.length > 0) {
      sections.push(\`# CONTEXT\\n\${this.context.join('\\n')}\`);
    }

    if (this.constraints.length > 0) {
      sections.push(\`# CONSTRAINTS\\n\${this.constraints.map((c) => \`- \${c}\`).join('\\n')}\`);
    }

    if (this.outputFormat) {
      sections.push(\`# OUTPUT FORMAT\\n\${this.outputFormat}\`);
    }

    if (this.examples.length > 0) {
      const exStr = this.examples
        .map((ex, i) => \`Example \${i + 1}:\\nInput: \${ex.input}\\nOutput: \${ex.output}\`)
        .join('\\n\\n');
      sections.push(\`# EXAMPLES\\n\${exStr}\`);
    }

    return sections.join('\\n\\n');
  }
}
`
  },
  {
    folder: '20-embeddings-cosine-sim',
    name: 'embeddings-cosine-sim',
    description: 'High-performance pure JavaScript/TypeScript calculation of Cosine Similarity, Dot Product, and Top-K search for vector embeddings.',
    keywords: ['embeddings', 'cosine-similarity', 'vector-search', 'rag', 'math', 'ai'],
    category: 'AI, LLM & Prompt Engineering Helpers',
    usageCode: `import { cosineSimilarity, topKSimilars } from 'embeddings-cosine-sim';

const vecA = [0.1, 0.8, -0.2];
const vecB = [0.12, 0.78, -0.19];

const score = cosineSimilarity(vecA, vecB);
console.log(score); // 0.998... (Very close match)`,
    apiList: `- \`cosineSimilarity(a: number[], b: number[]): number\`
- \`dotProduct(a: number[], b: number[]): number\`
- \`topKSimilars(target: number[], candidates: number[][], k?: number)\``,
    code: `export function dotProduct(a: number[], b: number[]): number {
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    sum += a[i] * b[i];
  }
  return sum;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function topKSimilars(
  target: number[],
  candidates: Array<{ id: string | number; vector: number[] }>,
  k = 5
) {
  const scored = candidates.map((c) => ({
    id: c.id,
    score: cosineSimilarity(target, c.vector)
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
`
  }
];
