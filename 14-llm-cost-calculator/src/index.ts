export interface ModelPrice {
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
    formatted: `$${totalUSD.toFixed(6)}`
  };
}
