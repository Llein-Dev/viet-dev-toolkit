export type VNNumberFormatStyle = 'standard' | 'short' | 'compact';

export interface VNNumberHumanizeOptions {
  /**
   * Number of decimal places to retain
   * @default 1
   */
  precision?: number;

  /**
   * Style format:
   * - 'standard': "1,5 triệu", "2,3 tỷ"
   * - 'short': "1.5tr", "2.3tỷ", "10k"
   * - 'compact': "1.5M", "2.3B", "10K"
   * @default 'standard'
   */
  style?: VNNumberFormatStyle;

  /**
   * Decimal separator character
   * In Vietnamese standard accounting, ',' is the decimal separator.
   * If omitted, style 'standard' defaults to ',', while 'short' and 'compact' default to '.'.
   */
  decimalSeparator?: string;

  /**
   * Thousands separator character
   * @default '.'
   */
  thousandSeparator?: string;

  /**
   * Currency symbol or suffix to append (e.g. ' ₫', ' VND')
   * @default ''
   */
  currency?: string;

  /**
   * Space between number and unit (e.g. true => "1,5 triệu", false => "1,5triệu")
   * @default true
   */
  space?: boolean;

  /**
   * Whether to format numbers below 1,000 using standard thousand separators
   * @default false
   */
  formatRawSubThousand?: boolean;
}

export interface VNBytesHumanizeOptions {
  /**
   * Number of decimal places
   * @default 2
   */
  precision?: number;

  /**
   * Whether to use binary units (KiB, MiB, GiB: 1024 base) or decimal units (KB, MB, GB: 1000 base)
   * @default false (1000 base / metric standard)
   */
  binary?: boolean;

  /**
   * Decimal separator
   * @default ',' (Vietnamese format: 1,5 GB)
   */
  decimalSeparator?: string;

  /**
   * Space between number and unit (e.g. "1,5 GB" vs "1,5GB")
   * @default true
   */
  space?: boolean;
}

interface ScaleDefinition {
  threshold: number;
  bigThreshold: bigint;
  units: Record<VNNumberFormatStyle, string>;
}

// Vietnamese Numerical Scales (Hệ thống đọc số tự nhiên tiếng Việt chuẩn)
const SCALES: ScaleDefinition[] = [
  {
    threshold: 1e15,
    bigThreshold: 1000000000000000n,
    units: { standard: 'triệu tỷ', short: 'tr.tỷ', compact: 'Q' }
  },
  {
    threshold: 1e12,
    bigThreshold: 1000000000000n,
    units: { standard: 'nghìn tỷ', short: 'nghìn tỷ', compact: 'T' }
  },
  {
    threshold: 1e9,
    bigThreshold: 1000000000n,
    units: { standard: 'tỷ', short: 'tỷ', compact: 'B' }
  },
  {
    threshold: 1e6,
    bigThreshold: 1000000n,
    units: { standard: 'triệu', short: 'tr', compact: 'M' }
  },
  {
    threshold: 1e3,
    bigThreshold: 1000n,
    units: { standard: 'nghìn', short: 'k', compact: 'K' }
  }
];

const METRIC_BYTE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
const BINARY_BYTE_UNITS = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB'];

/**
 * Strips unnecessary trailing zeroes from decimal representation
 */
function trimTrailingZeros(val: string, decimalSep: string): string {
  if (!val.includes(decimalSep)) return val;
  const parts = val.split(decimalSep);
  const cleanDec = parts[1].replace(/0+$/, '');
  return cleanDec ? `${parts[0]}${decimalSep}${cleanDec}` : parts[0];
}

/**
 * Humanizes large numbers into Vietnamese natural words or compact notations.
 *
 * @example
 * humanizeVNNumber(1500000) => "1,5 triệu"
 * humanizeVNNumber(2300000000) => "2,3 tỷ"
 * humanizeVNNumber(50000000, { style: 'short' }) => "50tr"
 * humanizeVNNumber(1250000000000n) => "1,25 nghìn tỷ"
 * humanizeVNNumber(2500000, { currency: ' ₫' }) => "2,5 triệu ₫"
 */
export function humanizeVNNumber(
  value: number | bigint | string,
  options: VNNumberHumanizeOptions = {}
): string {
  if (value === null || value === undefined || value === '') return '0';

  const {
    precision = 1,
    style = 'standard',
    currency = '',
    space = style === 'standard',
    formatRawSubThousand = false
  } = options;

  const defaultDecSep = style === 'standard' ? ',' : '.';
  const decimalSep = options.decimalSeparator ?? defaultDecSep;
  const thousandSep = options.thousandSeparator ?? (decimalSep === ',' ? '.' : ',');

  let isNegative = false;
  let numVal = 0;
  let isBig = false;
  let bigVal = 0n;

  if (typeof value === 'bigint') {
    isBig = true;
    bigVal = value;
    if (bigVal < 0n) {
      isNegative = true;
      bigVal = -bigVal;
    }
  } else {
    const rawStr = String(value).trim();
    if (rawStr.startsWith('-')) {
      isNegative = true;
      numVal = Math.abs(parseFloat(rawStr.slice(1)));
    } else {
      numVal = Math.abs(parseFloat(rawStr));
    }
    if (isNaN(numVal)) return '0';
  }

  // Handle zero
  if ((isBig && bigVal === 0n) || (!isBig && numVal === 0)) {
    return `0${currency}`;
  }

  // Find scale
  for (let i = 0; i < SCALES.length; i++) {
    const scale = SCALES[i];
    const thresholdReached = isBig ? bigVal >= scale.bigThreshold : numVal >= scale.threshold;

    if (thresholdReached) {
      let scaledStr = '';
      if (isBig) {
        // High-precision BigInt scaled calculation
        const factor = 10n ** BigInt(precision);
        const scaledBig = (bigVal * factor) / scale.bigThreshold;
        const whole = (scaledBig / factor).toString();
        const remainder = (scaledBig % factor).toString().padStart(precision, '0');
        scaledStr = precision > 0 ? `${whole}.${remainder}` : whole;
      } else {
        const scaled = numVal / scale.threshold;
        scaledStr = scaled.toFixed(precision);
      }

      const [wholePart, decPart] = scaledStr.split('.');
      let formattedNumber = wholePart;
      if (decPart && precision > 0) {
        formattedNumber += decimalSep + decPart;
        formattedNumber = trimTrailingZeros(formattedNumber, decimalSep);
      }

      const unit = scale.units[style];
      const spacing = space ? ' ' : '';
      const sign = isNegative ? '-' : '';

      return `${sign}${formattedNumber}${spacing}${unit}${currency}`;
    }
  }

  // Value < 1,000 (Sub-thousand)
  const sign = isNegative ? '-' : '';
  if (isBig) {
    return `${sign}${bigVal.toString()}${currency}`;
  }

  let finalRaw = precision > 0 && numVal % 1 !== 0 ? numVal.toFixed(precision) : numVal.toString();
  if (formatRawSubThousand && numVal >= 1000) {
    const [w, d] = finalRaw.split('.');
    finalRaw = w.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSep) + (d ? decimalSep + d : '');
  } else if (decimalSep !== '.') {
    finalRaw = finalRaw.replace('.', decimalSep);
  }

  finalRaw = trimTrailingZeros(finalRaw, decimalSep);
  return `${sign}${finalRaw}${currency}`;
}

/**
 * Humanizes computer bytes into Vietnamese natural localized unit strings.
 *
 * @example
 * humanizeVNBytes(1536000000) => "1,54 GB"
 * humanizeVNBytes(1048576, { binary: true }) => "1 MiB"
 * humanizeVNBytes(500) => "500 B"
 */
export function humanizeVNBytes(
  bytes: number | bigint | string,
  options: VNBytesHumanizeOptions = {}
): string {
  const {
    precision = 2,
    binary = false,
    decimalSeparator = ',',
    space = true
  } = options;

  let numBytes = typeof bytes === 'bigint' ? Number(bytes) : parseFloat(String(bytes));
  if (isNaN(numBytes) || numBytes <= 0) return `0${space ? ' ' : ''}B`;

  const k = binary ? 1024 : 1000;
  const units = binary ? BINARY_BYTE_UNITS : METRIC_BYTE_UNITS;

  const i = Math.min(Math.floor(Math.log(numBytes) / Math.log(k)), units.length - 1);
  const scaled = numBytes / Math.pow(k, i);

  let formatted = i === 0 ? scaled.toString() : scaled.toFixed(precision);
  if (decimalSeparator !== '.') {
    formatted = formatted.replace('.', decimalSeparator);
  }
  formatted = trimTrailingZeros(formatted, decimalSeparator);

  const spacing = space ? ' ' : '';
  return `${formatted}${spacing}${units[i]}`;
}
