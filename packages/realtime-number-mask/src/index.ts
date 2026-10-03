/**
 * @llein/realtime-number-mask
 * Zero-dependency real-time number and currency input mask with flawless
 * cursor position preservation for HTML inputs, web forms, and fintech apps.
 */

export interface NumberMaskOptions {
  /**
   * Separator for thousands grouping (e.g. ',' or '.' or ' ')
   * @default ','
   */
  thousandSeparator?: string;

  /**
   * Separator for decimal part (e.g. '.' or ',')
   * @default '.'
   */
  decimalSeparator?: string;

  /**
   * Maximum decimal places allowed (0 for integer / VND currency)
   * @default 0
   */
  precision?: number;

  /**
   * Allow negative numbers with leading minus sign
   * @default false
   */
  allowNegative?: boolean;

  /**
   * Prefix to display before the number (e.g. '$', 'US$ ', '')
   * @default ''
   */
  prefix?: string;

  /**
   * Suffix to display after the number (e.g. ' ₫', ' VND', '')
   * @default ''
   */
  suffix?: string;

  /**
   * Maximum numerical value allowed
   */
  max?: number | bigint;

  /**
   * Minimum numerical value allowed
   */
  min?: number | bigint;

  /**
   * Callback triggered whenever the input value changes
   */
  onChange?: (details: MaskChangeDetails) => void;
}

export interface MaskChangeDetails {
  raw: string;           // Clean numeric string (e.g. "1500000" or "-1500000.5")
  formatted: string;     // Display string with separators, prefix, and suffix
  numericValue: number;  // JavaScript float or integer
  bigIntValue: bigint | null; // BigInt (for integer values)
}

export interface MaskController {
  destroy: () => void;
  setValue: (val: string | number | bigint) => void;
  getRawValue: () => string;
  getNumericValue: () => number;
  getBigIntValue: () => bigint | null;
  getFormattedValue: () => string;
}

/** Standard preset for Vietnamese Dong (1.500.000 ₫) */
export const VIETNAM_VND_PRESET: NumberMaskOptions = {
  thousandSeparator: '.',
  decimalSeparator: ',',
  precision: 0,
  suffix: ' ₫'
};

/** Standard preset for International US Dollars ($1,500,000.00) */
export const INTERNATIONAL_USD_PRESET: NumberMaskOptions = {
  thousandSeparator: ',',
  decimalSeparator: '.',
  precision: 2,
  prefix: '$'
};

/**
 * Strips all formatting characters from a string, returning a clean numeric representation
 */
export function unformatNumber(
  value: string | number | bigint,
  options: NumberMaskOptions = {}
): string {
  if (value === null || value === undefined) return '';
  const str = String(value).trim();
  if (!str) return '';

  let {
    thousandSeparator,
    decimalSeparator,
    allowNegative = false
  } = options;

  if (decimalSeparator === ',' && !thousandSeparator) {
    thousandSeparator = '.';
  } else if (thousandSeparator === '.' && !decimalSeparator) {
    decimalSeparator = ',';
  } else {
    thousandSeparator = thousandSeparator ?? ',';
    decimalSeparator = decimalSeparator ?? '.';
  }

  let isNeg = false;
  if (allowNegative && str.startsWith('-')) {
    isNeg = true;
  }

  // First remove all occurrences of thousandSeparator
  let temp = str;
  if (thousandSeparator) {
    temp = temp.split(thousandSeparator).join('');
  }

  // Extract digits and decimal separator
  let clean = '';
  let hasDecimal = false;

  for (let i = 0; i < temp.length; i++) {
    const ch = temp[i];
    if (ch >= '0' && ch <= '9') {
      clean += ch;
    } else if (ch === decimalSeparator && !hasDecimal) {
      clean += '.'; // Standard JS float dot
      hasDecimal = true;
    }
  }

  if (!clean || clean === '.') return '';
  return isNeg ? `-${clean}` : clean;
}

/**
 * Returns numeric float or integer from unformatted or formatted string
 */
export function getNumericValue(
  value: string | number | bigint,
  options: NumberMaskOptions = {}
): number {
  const raw = unformatNumber(value, options);
  if (!raw) return 0;
  const num = parseFloat(raw);
  return isNaN(num) ? 0 : num;
}

/**
 * Returns BigInt value from integer part of string
 */
export function getBigIntValue(
  value: string | number | bigint,
  options: NumberMaskOptions = {}
): bigint | null {
  const raw = unformatNumber(value, options);
  if (!raw) return null;
  const intStr = raw.split('.')[0];
  try {
    return BigInt(intStr);
  } catch {
    return null;
  }
}

/**
 * Formats a raw number or string into a formatted display string
 */
export function formatNumber(
  value: string | number | bigint,
  options: NumberMaskOptions = {}
): string {
  let {
    thousandSeparator,
    decimalSeparator,
    precision = 0,
    allowNegative = false,
    prefix = '',
    suffix = '',
    max,
    min
  } = options;

  if (decimalSeparator === ',' && !thousandSeparator) {
    thousandSeparator = '.';
  } else if (thousandSeparator === '.' && !decimalSeparator) {
    decimalSeparator = ',';
  } else {
    thousandSeparator = thousandSeparator ?? ',';
    decimalSeparator = decimalSeparator ?? '.';
  }

  let raw = unformatNumber(value, { decimalSeparator, allowNegative });
  if (!raw) return '';

  let isNeg = raw.startsWith('-');
  if (isNeg) {
    raw = raw.slice(1);
  }

  // Check bounds
  if (max !== undefined || min !== undefined) {
    const num = parseFloat(isNeg ? `-${raw}` : raw);
    if (!isNaN(num)) {
      if (max !== undefined && num > Number(max)) {
        raw = String(max);
        isNeg = raw.startsWith('-');
        if (isNeg) raw = raw.slice(1);
      }
      if (min !== undefined && num < Number(min)) {
        raw = String(min);
        isNeg = raw.startsWith('-');
        if (isNeg) raw = raw.slice(1);
      }
    }
  }

  const [intPartRaw, decPartRaw] = raw.split('.');
  // Remove leading zeros from integer part (keep single 0 if only zero)
  const intPart = intPartRaw.replace(/^0+(?=\d)/, '') || '0';

  // Format integer with thousand separator
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  let formatted = formattedInt;

  // Format decimal if precision > 0
  if (precision > 0 && decPartRaw !== undefined) {
    const cleanDec = decPartRaw.slice(0, precision);
    formatted += decimalSeparator + cleanDec;
  }

  const sign = isNeg && allowNegative ? '-' : '';
  return `${prefix}${sign}${formatted}${suffix}`;
}

/**
 * Attaches real-time number masking to an HTMLInputElement with flawless cursor preservation
 */
export function attachNumberMask(
  input: HTMLInputElement,
  options: NumberMaskOptions = {}
): MaskController {
  const {
    thousandSeparator = ',',
    decimalSeparator = '.',
    precision = 0,
    allowNegative = false,
    prefix = '',
    suffix = '',
    onChange
  } = options;

  function countSignificant(str: string): number {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if ((ch >= '0' && ch <= '9') || (allowNegative && ch === '-') || (precision > 0 && ch === decimalSeparator)) {
        count++;
      }
    }
    return count;
  }

  function findPositionForCount(str: string, targetCount: number): number {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if ((ch >= '0' && ch <= '9') || (allowNegative && ch === '-') || (precision > 0 && ch === decimalSeparator)) {
        count++;
      }
      if (count === targetCount) {
        return i + 1;
      }
    }
    return str.length - suffix.length;
  }

  function handleMask(targetCursorPos?: number) {
    const originalValue = input.value;
    const currentCursor = targetCursorPos ?? input.selectionStart ?? originalValue.length;

    // Count significant characters before the cursor
    const charsBeforeCursor = originalValue.slice(0, currentCursor);
    const countBefore = countSignificant(charsBeforeCursor);

    // Format new value
    const formatted = formatNumber(originalValue, options);
    input.value = formatted;

    // Calculate new cursor position
    let newCursor = prefix.length;
    if (countBefore > 0) {
      newCursor = findPositionForCount(formatted, countBefore);
    } else {
      newCursor = prefix.length;
    }

    // Keep cursor inside content boundaries (between prefix and suffix)
    const minPos = prefix.length;
    const maxPos = formatted.length - suffix.length;
    newCursor = Math.max(minPos, Math.min(newCursor, maxPos));

    try {
      input.setSelectionRange(newCursor, newCursor);
    } catch {
      // Input might not support selectionRange in some environments
    }

    // Trigger change callback
    if (onChange) {
      const raw = unformatNumber(formatted, options);
      const numericVal = getNumericValue(formatted, options);
      const bigIntVal = getBigIntValue(formatted, options);
      onChange({
        raw,
        formatted,
        numericValue: numericVal,
        bigIntValue: bigIntVal
      });
    }

    // Dispatch native custom event
    input.dispatchEvent(
      new CustomEvent('number-mask-change', {
        bubbles: true,
        detail: {
          raw: unformatNumber(formatted, options),
          formatted
        }
      })
    );
  }

  // Handle backspace when next to a thousand separator
  function onKeyDown(e: KeyboardEvent) {
    const curPos = input.selectionStart;
    if (curPos === null || curPos === undefined) return;

    if (e.key === 'Backspace') {
      const charBefore = input.value[curPos - 1];
      if (charBefore === thousandSeparator) {
        e.preventDefault();
        // Delete the digit before the separator
        const newVal = input.value.slice(0, curPos - 2) + input.value.slice(curPos);
        input.value = newVal;
        handleMask(curPos - 2);
      }
    } else if (e.key === 'Delete') {
      const charAfter = input.value[curPos];
      if (charAfter === thousandSeparator) {
        e.preventDefault();
        // Delete the digit after the separator
        const newVal = input.value.slice(0, curPos) + input.value.slice(curPos + 2);
        input.value = newVal;
        handleMask(curPos);
      }
    }
  }

  function onInput() {
    handleMask();
  }

  input.addEventListener('input', onInput);
  input.addEventListener('keydown', onKeyDown);

  // Initial format if input already has a value
  if (input.value) {
    handleMask();
  }

  return {
    destroy: () => {
      input.removeEventListener('input', onInput);
      input.removeEventListener('keydown', onKeyDown);
    },
    setValue: (val: string | number | bigint) => {
      input.value = String(val);
      handleMask();
    },
    getRawValue: () => unformatNumber(input.value, options),
    getNumericValue: () => getNumericValue(input.value, options),
    getBigIntValue: () => getBigIntValue(input.value, options),
    getFormattedValue: () => input.value
  };
}
