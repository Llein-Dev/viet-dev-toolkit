/**
 * @llein/vn-currency-words
 * Enterprise-grade number to Vietnamese currency words converter
 * Zero-dependency, 100% TypeScript, BigInt & large number support
 */

export type Dialect = 'north' | 'south';

export interface CurrencyWordsOptions {
  /**
   * Suffix to append at the end (e.g. "đồng", "đồng chẵn", "USD", "việt nam đồng")
   * @default "đồng"
   */
  suffix?: string;

  /**
   * Regional dialect preference:
   * - 'north': uses "nghìn" and "linh" (e.g. một trăm linh một nghìn)
   * - 'south': uses "ngàn" and "lẻ" (e.g. một trăm lẻ một ngàn)
   * @default "north"
   */
  dialect?: Dialect;

  /**
   * Capitalize the very first character of the resulting sentence
   * @default true
   */
  capitalizeFirst?: boolean;

  /**
   * Use "tư" instead of "bốn" when after 20, 30, 40... (e.g. "hai mươi tư")
   * @default true
   */
  useTuInsteadOfBon?: boolean;

  /**
   * Prefix for negative numbers
   * @default "âm"
   */
  negativePrefix?: string;

  /**
   * How to read decimal fractional parts:
   * - 'point': "phẩy năm mươi"
   * - 'subunit': "và năm mươi xu"
   * @default "point"
   */
  decimalMode?: 'point' | 'subunit';

  /**
   * Subunit currency name when decimalMode is 'subunit' (e.g. "xu", "cent")
   * @default "xu"
   */
  subunitName?: string;
}

const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readThreeDigits(
  chunk: string,
  isBeginning: boolean,
  dialect: Dialect,
  useTu: boolean
): string {
  const [h, t, u] = chunk.split('').map(Number);
  const words: string[] = [];

  const linhWord = dialect === 'south' ? 'lẻ' : 'linh';

  // Hundreds
  if (h !== 0 || !isBeginning) {
    words.push(DIGITS[h], 'trăm');
  }

  // Tens
  if (t === 0) {
    if (u !== 0 && (h !== 0 || !isBeginning)) {
      words.push(linhWord);
    }
  } else if (t === 1) {
    words.push('mười');
  } else {
    words.push(DIGITS[t], 'mươi');
  }

  // Units
  if (u === 1) {
    if (t > 1) {
      words.push('mốt');
    } else {
      words.push(DIGITS[u]);
    }
  } else if (u === 4) {
    if (t > 1 && useTu) {
      words.push('tư');
    } else {
      words.push('bốn');
    }
  } else if (u === 5) {
    if (t > 0) {
      words.push('lăm');
    } else {
      words.push(DIGITS[u]);
    }
  } else if (u > 0) {
    words.push(DIGITS[u]);
  }

  return words.join(' ');
}

/**
 * Convert a numerical amount to standardized Vietnamese words
 */
export function numberToWords(
  amount: number | string | bigint,
  options: CurrencyWordsOptions = {}
): string {
  const {
    suffix = 'đồng',
    dialect = 'north',
    capitalizeFirst = true,
    useTuInsteadOfBon = true,
    negativePrefix = 'âm',
    decimalMode = 'point',
    subunitName = 'xu'
  } = options;

  const thousandsWord = dialect === 'south' ? 'ngàn' : 'nghìn';

  // Handle String / Number / BigInt conversion
  let rawStr = String(amount).trim().replace(/,/g, '');
  if (!rawStr) return 'không ' + suffix;

  let isNegative = false;
  if (rawStr.startsWith('-')) {
    isNegative = true;
    rawStr = rawStr.slice(1).trim();
  }

  // Split integer and decimal parts
  const [intPartRaw, decPartRaw] = rawStr.split('.');
  const intPart = (intPartRaw || '').replace(/^0+/, '') || '0';

  if (intPart === '0' && (!decPartRaw || /^0+$/.test(decPartRaw))) {
    const zeroStr = 'không ' + suffix;
    return capitalizeFirst ? zeroStr.charAt(0).toUpperCase() + zeroStr.slice(1) : zeroStr;
  }

  // Chunk integer part into groups of 3 digits from right to left
  const chunks: string[] = [];
  let temp = intPart;
  while (temp.length > 0) {
    chunks.unshift(temp.slice(-3));
    temp = temp.slice(0, -3);
  }

  const resultWords: string[] = [];
  const totalChunks = chunks.length;

  for (let i = 0; i < totalChunks; i++) {
    const chunk = chunks[i].padStart(3, '0');
    if (chunk === '000') continue;

    const isFirst = i === 0;
    const chunkWords = readThreeDigits(chunk, isFirst, dialect, useTuInsteadOfBon);

    // Scale naming based on powers of 1000:
    // k = 0: '', k = 1: nghìn, k = 2: triệu, k = 3: tỷ, k = 4: nghìn tỷ, k = 5: triệu tỷ, k = 6: tỷ tỷ...
    const k = totalChunks - 1 - i;
    const baseScaleIndex = k % 3;
    const tyCount = Math.floor(k / 3);

    let scale = '';
    if (baseScaleIndex === 1) scale = thousandsWord;
    else if (baseScaleIndex === 2) scale = 'triệu';

    if (tyCount > 0) {
      const tyStr = Array(tyCount).fill('tỷ').join(' ');
      scale = scale ? `${scale} ${tyStr}` : tyStr;
    }

    if (chunkWords) {
      resultWords.push(chunkWords + (scale ? ' ' + scale : ''));
    }
  }

  let finalStr = resultWords.join(' ').replace(/\s+/g, ' ').trim();

  // Handle decimal fraction
  if (decPartRaw && !/^0+$/.test(decPartRaw)) {
    const cleanDec = decPartRaw.slice(0, 2).padEnd(2, '0'); // Take up to 2 decimal places
    const decWords = readThreeDigits(cleanDec.padStart(3, '0'), false, dialect, useTuInsteadOfBon);

    if (decimalMode === 'subunit') {
      finalStr += ` ${suffix} và ${decWords} ${subunitName}`;
    } else {
      finalStr += ` phẩy ${decWords}`;
      if (suffix) finalStr += ` ${suffix}`;
    }
  } else if (suffix) {
    finalStr += ' ' + suffix;
  }

  if (isNegative) {
    finalStr = `${negativePrefix} ${finalStr}`;
  }

  finalStr = finalStr.trim().replace(/\s+/g, ' ');

  if (capitalizeFirst && finalStr.length > 0) {
    finalStr = finalStr.charAt(0).toUpperCase() + finalStr.slice(1);
  }

  return finalStr;
}

/**
 * Alias for numberToWords
 */
export const numberToVietnameseWords = numberToWords;
export const docSoThanhChu = numberToWords;

/**
 * Format a number into standard Vietnamese currency string (e.g. 1500000 -> "1.500.000 ₫")
 */
export function formatVND(
  amount: number | string | bigint,
  options: { showSymbol?: boolean; symbol?: string; spacer?: string } = {}
): string {
  const { showSymbol = true, symbol = '₫', spacer = ' ' } = options;

  const raw = String(amount).replace(/[^0-9-]/g, '');
  if (!raw) return `0${showSymbol ? spacer + symbol : ''}`;

  const isNeg = raw.startsWith('-');
  const abs = isNeg ? raw.slice(1) : raw;

  const formatted = abs.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const sign = isNeg ? '-' : '';

  return `${sign}${formatted}${showSymbol ? spacer + symbol : ''}`;
}
