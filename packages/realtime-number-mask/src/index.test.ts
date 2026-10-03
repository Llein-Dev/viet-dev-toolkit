import { describe, it, expect, vi } from 'vitest';
import {
  formatNumber,
  unformatNumber,
  getNumericValue,
  getBigIntValue,
  attachNumberMask,
  VIETNAM_VND_PRESET,
  INTERNATIONAL_USD_PRESET
} from './index';

describe('realtime-number-mask', () => {
  describe('formatNumber', () => {
    it('should format integer with commas (default)', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1000000)).toBe('1,000,000');
      expect(formatNumber('123456789')).toBe('123,456,789');
    });

    it('should format with Vietnamese VND preset (1.500.000 ₫)', () => {
      expect(formatNumber(1500000, VIETNAM_VND_PRESET)).toBe('1.500.000 ₫');
      expect(formatNumber('50000000', VIETNAM_VND_PRESET)).toBe('50.000.000 ₫');
    });

    it('should format with International USD preset ($1,500.50)', () => {
      expect(formatNumber('1500.50', INTERNATIONAL_USD_PRESET)).toBe('$1,500.50');
      expect(formatNumber('1000000', INTERNATIONAL_USD_PRESET)).toBe('$1,000,000');
    });

    it('should respect precision for decimals', () => {
      expect(formatNumber('1234.5678', { precision: 2 })).toBe('1,234.56');
      expect(formatNumber('1234.5', { precision: 2 })).toBe('1,234.5');
    });

    it('should format negative numbers when allowed', () => {
      expect(formatNumber(-50000, { allowNegative: true })).toBe('-50,000');
      expect(formatNumber(-50000, { allowNegative: false })).toBe('50,000');
    });

    it('should clamp value within min and max boundaries', () => {
      expect(formatNumber(1500, { max: 1000 })).toBe('1,000');
      expect(formatNumber(50, { min: 100 })).toBe('100');
    });
  });

  describe('unformatNumber & values', () => {
    it('should extract clean unformatted numeric string', () => {
      expect(unformatNumber('1,000,000')).toBe('1000000');
      expect(unformatNumber('$1,500,000.50')).toBe('1500000.50');
      expect(unformatNumber('1.500.000,50 ₫', { decimalSeparator: ',' })).toBe('1500000.50');
    });

    it('should return float or integer numeric value', () => {
      expect(getNumericValue('1,500,000')).toBe(1500000);
      expect(getNumericValue('$1,500.50')).toBe(1500.5);
    });

    it('should return BigInt for large amounts', () => {
      const big = getBigIntValue('1,000,000,000,000,000');
      expect(big).toBe(1000000000000000n);
    });
  });

  describe('attachNumberMask', () => {
    // Helper to create a lightweight mock HTMLInputElement
    function createMockInput(initialValue = '') {
      let val = initialValue;
      let selStart = initialValue.length;
      let selEnd = initialValue.length;
      const listeners: Record<string, ((e: any) => void)[]> = {};

      return {
        get value() {
          return val;
        },
        set value(v: string) {
          val = v;
        },
        selectionStart: selStart,
        selectionEnd: selEnd,
        setSelectionRange(start: number, end: number) {
          this.selectionStart = start;
          this.selectionEnd = end;
        },
        addEventListener(event: string, handler: (e: any) => void) {
          if (!listeners[event]) listeners[event] = [];
          listeners[event].push(handler);
        },
        removeEventListener(event: string, handler: (e: any) => void) {
          if (listeners[event]) {
            listeners[event] = listeners[event].filter((h) => h !== handler);
          }
        },
        dispatchEvent(event: any) {
          return true;
        },
        triggerInput(newVal: string, cursorAt?: number) {
          this.value = newVal;
          this.selectionStart = cursorAt ?? newVal.length;
          this.selectionEnd = cursorAt ?? newVal.length;
          listeners['input']?.forEach((cb) => cb(new Event('input')));
        }
      } as unknown as HTMLInputElement & { triggerInput: (v: string, c?: number) => void };
    }

    it('should format on real-time typing', () => {
      const input = createMockInput();
      const controller = attachNumberMask(input, { thousandSeparator: ',' });

      // User types '1'
      input.triggerInput('1');
      expect(input.value).toBe('1');

      // User types '1000'
      input.triggerInput('1000');
      expect(input.value).toBe('1,000');

      // User types '1000000'
      input.triggerInput('1000000');
      expect(input.value).toBe('1,000,000');

      expect(controller.getRawValue()).toBe('1000000');
      expect(controller.getNumericValue()).toBe(1000000);
    });

    it('should fire onChange callback with details', () => {
      const input = createMockInput();
      const onChange = vi.fn();
      attachNumberMask(input, { suffix: ' ₫', thousandSeparator: '.', onChange });

      input.triggerInput('2500000');
      expect(input.value).toBe('2.500.000 ₫');
      expect(onChange).toHaveBeenCalledWith({
        raw: '2500000',
        formatted: '2.500.000 ₫',
        numericValue: 2500000,
        bigIntValue: 2500000n
      });
    });

    it('should support controller.setValue and controller.destroy', () => {
      const input = createMockInput();
      const controller = attachNumberMask(input, { thousandSeparator: ',' });

      controller.setValue(9876543);
      expect(input.value).toBe('9,876,543');

      controller.destroy();
    });
  });
});
