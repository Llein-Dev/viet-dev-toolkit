const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const SCALES = ['', 'nghìn', 'triệu', 'tỷ'];

function readThreeDigits(threeDigits: string, isBeginning: boolean): string {
  const [h, t, u] = threeDigits.split('').map(Number);
  const words: string[] = [];

  if (h !== 0 || !isBeginning) {
    words.push(DIGITS[h], 'trăm');
  }

  if (t === 0) {
    if (u !== 0 && (h !== 0 || !isBeginning)) {
      words.push('linh');
    }
  } else if (t === 1) {
    words.push('mười');
  } else {
    words.push(DIGITS[t], 'mươi');
  }

  if (u === 1) {
    if (t > 1) words.push('mốt');
    else words.push(DIGITS[u]);
  } else if (u === 5) {
    if (t > 0) words.push('lăm');
    else words.push(DIGITS[u]);
  } else if (u > 0) {
    words.push(DIGITS[u]);
  }

  return words.join(' ');
}

export interface CurrencyWordsOptions {
  suffix?: string;
  capitalizeFirst?: boolean;
}

export function numberToVietnameseWords(
  amount: number | string,
  options: CurrencyWordsOptions = {}
): string {
  const { suffix = 'đồng', capitalizeFirst = true } = options;

  let numStr = String(amount).replace(/[^0-9]/g, '');
  if (!numStr || numStr === '0') {
    return 'Không ' + suffix;
  }

  // Remove leading zeros
  numStr = numStr.replace(/^0+/, '');
  if (!numStr) return 'Không ' + suffix;

  const chunks: string[] = [];
  while (numStr.length > 0) {
    chunks.unshift(numStr.slice(-3));
    numStr = numStr.slice(0, -3);
  }

  const resultWords: string[] = [];
  const totalChunks = chunks.length;

  for (let i = 0; i < totalChunks; i++) {
    const chunk = chunks[i].padStart(3, '0');
    if (chunk === '000') continue;

    const isFirst = i === 0;
    const chunkWords = readThreeDigits(chunk, isFirst);
    const scaleIndex = (totalChunks - 1 - i) % 4;
    const tyCount = Math.floor((totalChunks - 1 - i) / 4);

    let scale = SCALES[scaleIndex];
    if (tyCount > 0 && scaleIndex === 0) {
      scale = Array(tyCount).fill('tỷ').join(' ');
    }

    if (chunkWords) {
      resultWords.push(chunkWords + (scale ? ' ' + scale : ''));
    }
  }

  let finalStr = resultWords.join(' ').replace(/\s+/g, ' ').trim();
  if (suffix) {
    finalStr += ' ' + suffix;
  }

  if (capitalizeFirst && finalStr.length > 0) {
    finalStr = finalStr.charAt(0).toUpperCase() + finalStr.slice(1);
  }

  return finalStr;
}
