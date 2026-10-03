export interface OllamaConfig {
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
  const baseUrl = (config.baseUrl || 'http://localhost:11434').replace(/\/+$/, '');

  return {
    async generate(params: GenerateParams) {
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...params, stream: false })
      });

      if (!res.ok) {
        throw new Error(`Ollama API Error: ${res.status} ${res.statusText}`);
      }

      return res.json();
    },

    async chat(messages: Array<{ role: string; content: string }>, model = 'llama3') {
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, stream: false })
      });

      if (!res.ok) {
        throw new Error(`Ollama Chat Error: ${res.status} ${res.statusText}`);
      }

      return res.json();
    }
  };
}
