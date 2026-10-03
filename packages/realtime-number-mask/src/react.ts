import { useRef, useState, useCallback } from 'react';
import {
  attachNumberMask,
  NumberMaskOptions,
  MaskController,
  formatNumber,
  unformatNumber,
  getNumericValue,
  getBigIntValue
} from './index';

export interface UseNumberMaskOptions extends NumberMaskOptions {
  /** Initial numeric or formatted value */
  defaultValue?: string | number | bigint;
}

export interface UseNumberMaskResult<T extends HTMLInputElement = HTMLInputElement> {
  /** Pass to input element: <input ref={ref} /> */
  ref: (node: T | null) => void;
  /** React reactive state: Formatted display string (e.g. "1.500.000 ₫") */
  formattedValue: string;
  /** React reactive state: Clean unformatted numeric digits (e.g. "1500000") */
  rawValue: string;
  /** React reactive state: Numeric JavaScript float/int (e.g. 1500000) */
  numericValue: number;
  /** React reactive state: BigInt for large currency amounts */
  bigIntValue: bigint | null;
  /** Programmatically set value and sync React state + DOM input */
  setValue: (value: string | number | bigint) => void;
  /** Clear input */
  clear: () => void;
  /** Direct access to MaskController */
  controller: MaskController | null;
}

/**
 * Modern React Custom Hook for real-time number and currency input masking.
 *
 * @example
 * ```tsx
 * import { useNumberMask } from '@llein/realtime-number-mask/react';
 * import { VIETNAM_VND_PRESET } from '@llein/realtime-number-mask';
 *
 * function Checkout() {
 *   const { ref, numericValue, formattedValue, setValue } = useNumberMask({
 *     ...VIETNAM_VND_PRESET,
 *     defaultValue: 1500000
 *   });
 *
 *   return (
 *     <div>
 *       <input ref={ref} placeholder="Nhập số tiền..." />
 *       <p>Số tiền: {numericValue} VND</p>
 *       <button onClick={() => setValue(5000000)}>Đặt 5.000.000 ₫</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useNumberMask<T extends HTMLInputElement = HTMLInputElement>(
  options: UseNumberMaskOptions = {}
): UseNumberMaskResult<T> {
  const initialRaw =
    options.defaultValue !== undefined && options.defaultValue !== null
      ? unformatNumber(options.defaultValue, options)
      : '';
  const initialFormatted =
    options.defaultValue !== undefined && options.defaultValue !== null
      ? formatNumber(options.defaultValue, options)
      : '';

  const [formattedValue, setFormattedValue] = useState<string>(initialFormatted);
  const [rawValue, setRawValue] = useState<string>(initialRaw);
  const [numericValue, setNumericValue] = useState<number>(() =>
    initialRaw ? getNumericValue(initialRaw, options) : 0
  );
  const [bigIntValue, setBigIntValue] = useState<bigint | null>(() =>
    initialRaw ? getBigIntValue(initialRaw, options) : null
  );

  const controllerRef = useRef<MaskController | null>(null);
  const inputRef = useRef<T | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const ref = useCallback((node: T | null) => {
    if (node) {
      inputRef.current = node;
      const opts = optionsRef.current;
      const mask = attachNumberMask(node, {
        ...opts,
        onChange: (details) => {
          setFormattedValue(details.formatted);
          setRawValue(details.raw);
          setNumericValue(details.numericValue);
          setBigIntValue(details.bigIntValue);
          opts.onChange?.(details);
        }
      });
      controllerRef.current = mask;

      if (opts.defaultValue !== undefined && opts.defaultValue !== null) {
        mask.setValue(opts.defaultValue);
      }
    } else {
      controllerRef.current?.destroy();
      controllerRef.current = null;
      inputRef.current = null;
    }
  }, []);

  const setValue = useCallback((val: string | number | bigint) => {
    if (controllerRef.current) {
      controllerRef.current.setValue(val);
    } else {
      const opts = optionsRef.current;
      const formatted = formatNumber(val, opts);
      const raw = unformatNumber(val, opts);
      setFormattedValue(formatted);
      setRawValue(raw);
      setNumericValue(getNumericValue(raw, opts));
      setBigIntValue(getBigIntValue(raw, opts));
    }
  }, []);

  const clear = useCallback(() => {
    setValue('');
  }, [setValue]);

  return {
    ref,
    formattedValue,
    rawValue,
    numericValue,
    bigIntValue,
    setValue,
    clear,
    controller: controllerRef.current
  };
}
