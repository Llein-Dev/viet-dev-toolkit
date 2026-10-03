/**
 * Position-aware character confusion mappings for OCR / ANPR engines
 */
export const LETTER_TO_DIGIT: Record<string, string> = {
  O: '0',
  D: '0',
  Q: '0',
  I: '1',
  L: '1',
  J: '1',
  Z: '2',
  E: '3',
  A: '4',
  S: '5',
  G: '6',
  b: '6',
  T: '7',
  B: '8'
};

export const DIGIT_TO_LETTER: Record<string, string> = {
  '0': 'O',
  '1': 'I',
  '2': 'Z',
  '3': 'E',
  '4': 'A',
  '5': 'S',
  '6': 'G',
  '7': 'T',
  '8': 'B'
};

export function asDigit(ch: string): string {
  if (!ch) return '';
  if (ch >= '0' && ch <= '9') return ch;
  return LETTER_TO_DIGIT[ch] || ch;
}

export function asLetter(ch: string): string {
  if (!ch) return '';
  if (ch >= 'A' && ch <= 'Z') return ch;
  return DIGIT_TO_LETTER[ch] || ch;
}

/**
 * Weighted confusion pairs for OCR fuzzy matching
 */
const CONFUSION_PAIRS: Set<string> = new Set([
  '0-O', 'O-0', '0-D', 'D-0', '0-Q', 'Q-0',
  '1-I', 'I-1', '1-L', 'L-1', '1-T', 'T-1',
  '2-Z', 'Z-2',
  '3-E', 'E-3',
  '4-A', 'A-4',
  '5-S', 'S-5',
  '6-G', 'G-6', '6-C', 'C-6',
  '8-B', 'B-8'
]);

export interface CleanOptions {
  /** Expected vehicle type if known ahead of time */
  vehicleType?: 'car' | 'motorbike' | 'military' | 'auto';
  /** Whether to format output or return compact string */
  format?: boolean;
}

export interface PlateCleanResult {
  raw: string;
  compact: string;
  formatted: string;
  vehicleType: 'car' | 'motorbike' | 'electric_motorbike' | 'military' | 'unknown';
  isValid: boolean;
  score: number;
}

/**
 * Removes non-alphanumeric noise characters, newlines, and extraneous spaces
 */
export function sanitizeANPRRaw(text: string): string {
  if (!text) return '';
  return text
    .toUpperCase()
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/[^A-Z0-9\s]/g, '')
    .trim();
}

/**
 * Combines multi-line OCR plates (top line + bottom line) into a single compact sequence.
 * Examples:
 * - combinePlateLines("59-P1", "123.45") => "59P112345"
 * - combinePlateLines("51K", "999.99") => "51K99999"
 */
export function combinePlateLines(topLine: string, bottomLine: string): string {
  const top = (topLine || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const bottom = (bottomLine || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${top}${bottom}`;
}

/**
 * Disambiguates OCR characters based on character position rules for Vietnamese plates.
 * Converts letters to digits where digits are required (province codes, plate numbers)
 * and digits to letters where series letters are expected.
 */
export function cleanANPRText(raw: string, options?: CleanOptions): string {
  if (!raw) return '';

  const clean = cleanVietnamPlate(raw);
  if (options?.format) {
    return clean.formatted || clean.compact;
  }
  return clean.compact;
}

/**
 * Comprehensive parser & cleaner for Vietnamese ANPR plates
 */
export function cleanVietnamPlate(raw: string): PlateCleanResult {
  const result: PlateCleanResult = {
    raw,
    compact: '',
    formatted: '',
    vehicleType: 'unknown',
    isValid: false,
    score: 0
  };

  if (!raw) return result;

  // Split lines if multiline input
  const lines = raw.split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean);
  let text = '';
  let isMultiLine = lines.length >= 2;
  let topLineClean = '';

  if (isMultiLine) {
    topLineClean = lines[0].toUpperCase().replace(/[^A-Z0-9]/g, '');
    text = combinePlateLines(lines[0], lines.slice(1).join(''));
  } else {
    text = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  }

  if (text.length < 5) {
    result.compact = text;
    return result;
  }

  // Check military first (starts with 2 letters, followed by 4 digits, e.g. TM, TC, TH, QP, AA...)
  const isPotentialMilitary = /^[A-Z]{2}[0-9A-Z]{4}$/.test(text.slice(0, 6));
  if (isPotentialMilitary && !/^[0-9]/.test(text[0])) {
    const p1 = text[0];
    const p2 = text[1];
    const digits = text.slice(2).split('').map(asDigit).join('');
    if (/^[0-9]{4}$/.test(digits)) {
      result.compact = `${p1}${p2}${digits}`;
      result.formatted = `${p1}${p2}-${digits.slice(0, 2)}.${digits.slice(2)}`;
      result.vehicleType = 'military';
      result.isValid = true;
      result.score = 0.95;
      return result;
    }
  }

  // Vietnam civilian plates: 1st 2 chars are province digits (11 - 99)
  const provCode = `${asDigit(text[0])}${asDigit(text[1])}`;

  // Electric motorbike: e.g. 29MD1-123.45 (MD followed by digit)
  if (text.slice(2, 4) === 'MD' || text.slice(2, 4) === 'MĐ') {
    const mSeries = 'MD';
    const subDigit = asDigit(text[4]);
    const numPart = text.slice(5).split('').map(asDigit).join('');
    result.compact = `${provCode}${mSeries}${subDigit}${numPart}`;
    result.formatted = `${provCode}-${mSeries}${subDigit} ${formatPlateNumbers(numPart)}`;
    result.vehicleType = 'electric_motorbike';
    result.isValid = /^[0-9]{2}MD[0-9]{5,6}$/.test(result.compact);
    result.score = result.isValid ? 0.95 : 0.7;
    return result;
  }

  const char2 = text[2];
  const char3 = text[3];
  const char2AsLetter = asLetter(char2);

  // Check clues from raw separators:
  // e.g. "SIK-999.9B" has '-' right after the 3rd char (char2)
  const hasSepAfterChar2 = /^[A-Z0-9]{3}[-\s]/i.test(raw.trim());
  // e.g. "59-P1 123.45" or "59P1-123.45" has separator after 4th char (char3)
  const hasSepAfterChar3 = /^[A-Z0-9]{2}[-\s]?[A-Z0-9]{2}[-\s]/i.test(raw.trim());

  // In multi-line plate, motorbike top line is 4 characters (e.g. 59-P1 -> 59P1)
  // Car top line is 3 characters (e.g. 51K)
  const isMotorbikeFromMultiLine = isMultiLine && topLineClean.length === 4;
  const isCarFromMultiLine = isMultiLine && topLineClean.length === 3;

  // Determine if motorbike:
  // 1. Explicit multi-line with 4-char top line (59P1)
  // 2. Or separator after 4th char (59P1-)
  // 3. Or total length 9 and char3 is digit (and not explicit car separator)
  const isChar3Digit = (char3 >= '0' && char3 <= '9') || char3 === 'I' || char3 === 'L';
  const isMotorbike =
    !hasSepAfterChar2 &&
    !isCarFromMultiLine &&
    (isMotorbikeFromMultiLine ||
      hasSepAfterChar3 ||
      (text.length === 9 && isChar3Digit && !/[A-Z]/.test(text[3])));

  if (isMotorbike) {
    const series = `${char2AsLetter}${asDigit(char3)}`;
    const numbers = text.slice(4).split('').map(asDigit).join('');
    result.compact = `${provCode}${series}${numbers}`;
    result.formatted = `${provCode}-${series} ${formatPlateNumbers(numbers)}`;
    result.vehicleType = 'motorbike';
    result.isValid = /^[0-9]{2}[A-Z][0-9]{5,6}$/.test(result.compact);
    result.score = result.isValid ? 0.9 : 0.65;
    return result;
  }

  // Check 2-letter car series (e.g. 51AB 12345 or 51LD 12345)
  const isChar3GenuineLetter = /[A-Z]/.test(char3) && char3 !== 'I' && char3 !== 'O' && char3 !== 'L';
  if (isChar3GenuineLetter && text.length >= 8 && !hasSepAfterChar2) {
    const series = `${char2AsLetter}${char3}`;
    const numbers = text.slice(4).split('').map(asDigit).join('');
    result.compact = `${provCode}${series}${numbers}`;
    result.formatted = `${provCode}${series}-${formatPlateNumbers(numbers)}`;
    result.vehicleType = 'car';
    result.isValid = /^[0-9]{2}[A-Z]{2}[0-9]{4,5}$/.test(result.compact);
    result.score = result.isValid ? 0.9 : 0.65;
    return result;
  }

  // Standard car with 1 letter series (e.g. 51K 99999 or 29A 1234)
  const series = char2AsLetter;
  const numbers = text.slice(3).split('').map(asDigit).join('');
  result.compact = `${provCode}${series}${numbers}`;
  result.formatted = `${provCode}${series}-${formatPlateNumbers(numbers)}`;
  result.vehicleType = 'car';
  result.isValid = /^[0-9]{2}[A-Z][0-9]{4,5}$/.test(result.compact);
  result.score = result.isValid ? 0.9 : 0.6;
  return result;
}

/**
 * Format 4-digit or 5-digit number block
 * 1234 -> 1234
 * 12345 -> 123.45
 */
function formatPlateNumbers(num: string): string {
  if (num.length === 5) {
    return `${num.slice(0, 3)}.${num.slice(3)}`;
  }
  return num;
}

/**
 * Calculate similarity between 2 license plates (0.0 to 1.0)
 * Uses OCR confusion matrix discounts so that mistaking '8' for 'B' or '0' for 'O'
 * incurs only a fractional penalty rather than full mismatch.
 */
export function calculatePlateSimilarity(a: string, b: string): number {
  const s1 = (a || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const s2 = (b || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const m = s1.length;
  const n = s2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const c1 = s1[i - 1];
      const c2 = s2[j - 1];

      if (c1 === c2) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        const isConfusion = CONFUSION_PAIRS.has(`${c1}-${c2}`);
        const cost = isConfusion ? 0.25 : 1.0;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1, // deletion
          dp[i][j - 1] + 1, // insertion
          dp[i - 1][j - 1] + cost // substitution with confusion discount
        );
      }
    }
  }

  const maxLen = Math.max(m, n);
  const distance = dp[m][n];
  const similarity = Math.max(0, 1 - distance / maxLen);
  return Math.round(similarity * 100) / 100;
}

/**
 * Find the best matching registered license plate in a database / whitelist.
 * Useful for automated parking barrier systems when plates have minor OCR artifacts.
 */
export function findBestPlateMatch(
  query: string,
  candidates: string[],
  threshold = 0.75
): { match: string; score: number; index: number } | null {
  if (!query || !candidates || candidates.length === 0) return null;

  const cleanedQuery = cleanANPRText(query);
  let bestMatch = '';
  let highestScore = -1;
  let bestIndex = -1;

  for (let i = 0; i < candidates.length; i++) {
    const candidate = candidates[i];
    const score = calculatePlateSimilarity(cleanedQuery, candidate);
    if (score > highestScore) {
      highestScore = score;
      bestMatch = candidate;
      bestIndex = i;
    }
  }

  if (highestScore >= threshold) {
    return {
      match: bestMatch,
      score: highestScore,
      index: bestIndex
    };
  }

  return null;
}
