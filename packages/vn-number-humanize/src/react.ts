import { useMemo } from 'react';
import {
  humanizeVNNumber,
  humanizeVNBytes,
  VNNumberHumanizeOptions,
  VNBytesHumanizeOptions
} from './index';

/**
 * Official React Hook for real-time Vietnamese compact number formatting.
 * Memoizes formatted result to avoid redundant re-calculations on component re-renders.
 *
 * @example
 * ```tsx
 * import { useVNNumber } from '@llein/vn-number-humanize/react';
 *
 * function PriceDisplay({ amount }: { amount: number }) {
 *   const formatted = useVNNumber(amount, { currency: ' ₫' });
 *   return <span>{formatted}</span>; // e.g. "1,5 triệu ₫"
 * }
 * ```
 */
export function useVNNumber(
  value: number | bigint | string,
  options?: VNNumberHumanizeOptions
): string {
  return useMemo(() => {
    return humanizeVNNumber(value, options);
  }, [
    value,
    options?.precision,
    options?.style,
    options?.decimalSeparator,
    options?.thousandSeparator,
    options?.currency,
    options?.space,
    options?.formatRawSubThousand
  ]);
}

/**
 * Official React Hook for real-time Vietnamese byte size formatting.
 *
 * @example
 * ```tsx
 * import { useVNBytes } from '@llein/vn-number-humanize/react';
 *
 * function FileSize({ size }: { size: number }) {
 *   const readable = useVNBytes(size);
 *   return <span>{readable}</span>; // e.g. "1,53 GB"
 * }
 * ```
 */
export function useVNBytes(
  bytes: number | bigint | string,
  options?: VNBytesHumanizeOptions
): string {
  return useMemo(() => {
    return humanizeVNBytes(bytes, options);
  }, [
    bytes,
    options?.precision,
    options?.binary,
    options?.decimalSeparator,
    options?.space
  ]);
}
