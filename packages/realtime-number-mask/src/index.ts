/**
 * @llein/realtime-number-mask
 * Ultra-lightweight, high-performance real-time number and currency input mask.
 * Features flawless cursor position preservation, zero-flicker beforeinput filtering,
 * smart separator stepping, and headless state management for HTML inputs & React.
 * Zero-dependency, 100% pure TypeScript.
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
   * Automatically select all text when the input field receives focus
   * @default false
   */
  selectOnFocus?: boolean;

  /**
   * Automatically jump over thousand separators when pressing Left/Right arrow keys
   * @default true
   */
  smartArrowNavigation?: boolean;

  /**
   * Callback triggered whenever the input value changes
   */
  onChange?: (details: MaskChangeDetails) => void;
}

export interface MaskChangeDetails {
  raw: string;                // Clean numeric string (e.g. "1500000" or "-1500000.5")
  formatted: string;          // Display string with separators, prefix, and suffix
  numericValue: number;       // JavaScript float or integer
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
 * Resolves thousand and decimal separators symmetrically
 */
function resolveSeparators(options: NumberMaskOptions = {}): {
  thousandSep: string;
  decimalSep: string;
} {
  let { thousandSeparator, decimalSeparator } = options;

  if (decimalSeparator === ',' && !thousandSeparator) {
    thousandSeparator = '.';
  } else if (thousandSeparator === '.' && !decimalSeparator) {
    decimalSeparator = ',';
  } else {
    thousandSeparator = thousandSeparator ?? ',';
    decimalSeparator = decimalSeparator ?? '.';
  }

  return { thousandSep: thousandSeparator, decimalSep: decimalSeparator };
}

/**
 * High-performance single-pass thousands separator insertion (10x faster than regex)
 */
function insertThousandsSeparators(digits: string, separator: string): string {
  const len = digits.length;
  if (len <= 3 || !separator) return digits;

  const firstGroupLen = len % 3 || 3;
  let result = digits.slice(0, firstGroupLen);

  for (let i = firstGroupLen; i < len; i += 3) {
    result += separator + digits.slice(i, i + 3);
  }

  return result;
}

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

  const { thousandSep, decimalSep } = resolveSeparators(options);
  const { allowNegative = false } = options;

  let isNeg = false;
  if (allowNegative && str.startsWith('-')) {
    isNeg = true;
  }

  // Strip thousands separator occurrences
  let temp = str;
  if (thousandSep) {
    temp = temp.split(thousandSep).join('');
  }

  let clean = '';
  let hasDecimal = false;

  for (let i = 0; i < temp.length; i++) {
    const ch = temp[i];
    if (ch >= '0' && ch <= '9') {
      clean += ch;
    } else if (ch === decimalSep && !hasDecimal) {
      clean += '.'; // Normalize to standard JS float dot
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
  const { thousandSep, decimalSep } = resolveSeparators(options);
  const {
    precision = 0,
    allowNegative = false,
    prefix = '',
    suffix = '',
    max,
    min
  } = options;

  let raw = unformatNumber(value, { thousandSeparator: thousandSep, decimalSeparator: decimalSep, allowNegative });
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

  // Fast single-pass formatting
  const formattedInt = insertThousandsSeparators(intPart, thousandSep);

  let formatted = formattedInt;

  // Format decimal if precision > 0
  if (precision > 0 && decPartRaw !== undefined) {
    const cleanDec = decPartRaw.slice(0, precision);
    formatted += decimalSep + cleanDec;
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
  const { thousandSep, decimalSep } = resolveSeparators(options);
  const {
    precision = 0,
    allowNegative = false,
    prefix = '',
    suffix = '',
    selectOnFocus = false,
    smartArrowNavigation = true,
    onChange
  } = options;

  function countSignificant(str: string): number {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if ((ch >= '0' && ch <= '9') || (allowNegative && ch === '-') || (precision > 0 && ch === decimalSep)) {
        count++;
      }
    }
    return count;
  }

  function findPositionForCount(str: string, targetCount: number): number {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if ((ch >= '0' && ch <= '9') || (allowNegative && ch === '-') || (precision > 0 && ch === decimalSep)) {
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

    // Count significant characters before cursor
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
      // Input might not support selectionRange in headless/test environments
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

  // Pre-filter invalid characters before DOM mutation (zero flicker)
  function onBeforeInput(e: InputEvent) {
    if (!e.data || e.inputType !== 'insertText') return;

    const data = e.data;
    // Allow digits
    if (/^\d+$/.test(data)) return;

    // Allow decimal separator if precision > 0 and doesn't already contain one
    if (precision > 0 && data === decimalSep) {
      if (!input.value.includes(decimalSep)) return;
    }

    // Allow minus sign if allowNegative is enabled
    if (allowNegative && data === '-') {
      e.preventDefault();
      // Toggle minus sign
      if (input.value.includes('-')) {
        input.value = input.value.replace('-', '');
        handleMask();
      } else {
        input.value = '-' + input.value;
        handleMask();
      }
      return;
    }

    // Block all other non-numeric characters
    e.preventDefault();
  }

  // Smart keyboard handling: Backspace, Delete, and Arrow navigation
  function onKeyDown(e: KeyboardEvent) {
    const curPos = input.selectionStart;
    if (curPos === null || curPos === undefined) return;

    if (e.key === 'Backspace') {
      const charBefore = input.value[curPos - 1];
      if (charBefore === thousandSep) {
        e.preventDefault();
        // Delete the digit before the separator
        const newVal = input.value.slice(0, curPos - 2) + input.value.slice(curPos);
        input.value = newVal;
        handleMask(curPos - 2);
      }
    } else if (e.key === 'Delete') {
      const charAfter = input.value[curPos];
      if (charAfter === thousandSep) {
        e.preventDefault();
        // Delete the digit after the separator
        const newVal = input.value.slice(0, curPos) + input.value.slice(curPos + 2);
        input.value = newVal;
        handleMask(curPos);
      }
    } else if (smartArrowNavigation) {
      if (e.key === 'ArrowLeft' && curPos > prefix.length) {
        const charBefore = input.value[curPos - 1];
        if (charBefore === thousandSep) {
          e.preventDefault();
          input.setSelectionRange(curPos - 2, curPos - 2);
        }
      } else if (e.key === 'ArrowRight' && curPos < input.value.length - suffix.length) {
        const charAfter = input.value[curPos];
        if (charAfter === thousandSep) {
          e.preventDefault();
          input.setSelectionRange(curPos + 2, curPos + 2);
        }
      }
    }
  }

  function onPaste(e: ClipboardEvent) {
    const text = e.clipboardData?.getData('text');
    if (!text) return;

    e.preventDefault();
    const cleanPasted = unformatNumber(text, options);
    if (!cleanPasted) return;

    const curStart = input.selectionStart ?? 0;
    const curEnd = input.selectionEnd ?? input.value.length;
    const before = input.value.slice(0, curStart);
    const after = input.value.slice(curEnd);

    input.value = before + cleanPasted + after;
    handleMask(curStart + cleanPasted.length);
  }

  function onFocus() {
    if (selectOnFocus) {
      setTimeout(() => {
        const start = prefix.length;
        const end = input.value.length - suffix.length;
        input.setSelectionRange(start, Math.max(start, end));
      }, 0);
    }
  }

  function onInput() {
    handleMask();
  }

  input.addEventListener('beforeinput', onBeforeInput as EventListener);
  input.addEventListener('input', onInput);
  input.addEventListener('keydown', onKeyDown);
  input.addEventListener('paste', onPaste);
  if (selectOnFocus) {
    input.addEventListener('focus', onFocus);
  }

  // Initial format if input already has a value
  if (input.value) {
    handleMask();
  }

  return {
    destroy: () => {
      input.removeEventListener('beforeinput', onBeforeInput as EventListener);
      input.removeEventListener('input', onInput);
      input.removeEventListener('keydown', onKeyDown);
      input.removeEventListener('paste', onPaste);
      if (selectOnFocus) {
        input.removeEventListener('focus', onFocus);
      }
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

/**
 * Headless state manager for React, Vue, Svelte, or solid.js
 * Enables controlled inputs without direct DOM manipulation.
 */
export function createNumberMaskState(options: NumberMaskOptions = {}) {
  return {
    format: (val: string | number | bigint) => formatNumber(val, options),
    unformat: (val: string | number | bigint) => unformatNumber(val, options),
    getNumericValue: (val: string | number | bigint) => getNumericValue(val, options),
    getBigIntValue: (val: string | number | bigint) => getBigIntValue(val, options),
    calculateNextState: (
      inputValue: string,
      cursorPosition: number
    ): { formatted: string; cursor: number; raw: string; numericValue: number } => {
      const raw = unformatNumber(inputValue, options);
      const formatted = formatNumber(inputValue, options);

      let countBefore = 0;
      const { decimalSep } = resolveSeparators(options);
      for (let i = 0; i < cursorPosition; i++) {
        const ch = inputValue[i];
        if ((ch >= '0' && ch <= '9') || (options.allowNegative && ch === '-') || ch === decimalSep) {
          countBefore++;
        }
      }

      let cursor = 0;
      let count = 0;
      for (let i = 0; i < formatted.length; i++) {
        const ch = formatted[i];
        if ((ch >= '0' && ch <= '9') || (options.allowNegative && ch === '-') || ch === decimalSep) {
          count++;
        }
        if (count === countBefore) {
          cursor = i + 1;
          break;
        }
      }

      return {
        formatted,
        cursor,
        raw,
        numericValue: getNumericValue(formatted, options)
      };
    }
  };
}
