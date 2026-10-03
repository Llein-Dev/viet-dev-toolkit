export interface EstimatorOptions {
  model?: 'gpt-4o' | 'claude' | 'gemini' | 'deepseek' | 'generic';
}

export function estimateTokens(text: string, options: EstimatorOptions = {}): number {
  if (!text || typeof text !== 'string') return 0;

  // Average rules:
  // English words ~ 1.3 tokens per word
  // CJK / Vietnamese accented characters ~ 0.8 - 1.2 tokens per character / syllable
  // Code / symbols ~ 1 token per 3-4 chars
  const words = text.trim().split(/\s+/);
  let count = 0;

  for (const word of words) {
    if (/^[\x00-\x7F]+$/.test(word)) {
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
