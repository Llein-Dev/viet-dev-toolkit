const REFUSAL_PATTERNS = [
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
