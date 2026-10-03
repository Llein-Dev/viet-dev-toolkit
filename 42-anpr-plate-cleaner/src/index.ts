const DIGIT_TO_LETTER: Record<string, string> = {
  '0': 'O',
  '1': 'I',
  '2': 'Z',
  '5': 'S',
  '8': 'B'
};

const LETTER_TO_DIGIT: Record<string, string> = {
  O: '0',
  D: '0',
  Q: '0',
  I: '1',
  L: '1',
  Z: '2',
  S: '5',
  B: '8',
  G: '6'
};

export function cleanANPRText(raw: string): string {
  if (!raw) return '';

  let text = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (text.length < 6) return text;

  // Rule for Vietnam plate: First 2 chars MUST be numbers (Province)
  const p1 = LETTER_TO_DIGIT[text[0]] || text[0];
  const p2 = LETTER_TO_DIGIT[text[1]] || text[1];

  // 3rd char is usually a letter series (A-Z)
  const series = DIGIT_TO_LETTER[text[2]] || text[2];

  // Suffix numbers (usually digits)
  const rest = text.slice(3).split('').map((ch) => LETTER_TO_DIGIT[ch] || ch).join('');

  return `${p1}${p2}${series}${rest}`;
}
