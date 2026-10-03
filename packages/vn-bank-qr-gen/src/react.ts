import { useMemo } from 'react';
import { generateVietQR, VietQROptions, VietQRResult } from './index';

export interface UseVietQRResult {
  /** Generated VietQR result object, or null if required fields are missing */
  result: VietQRResult | null;
  /** Direct CDN URL to the QR image */
  qrImageUrl: string;
  /** Raw EMVCo payload string with CRC16-CCITT checksum */
  qrContent: string;
  /** Whether the minimum required parameters (bank & accountNumber) are present */
  isReady: boolean;
  /** Any validation error message */
  error: string | null;
}

/**
 * React Custom Hook to reactively generate official VietQR (NAPAS 247) payment payloads and QR images.
 *
 * @param options VietQR generation options (bank, accountNumber, amount, message, etc.)
 * @returns Reactive QR image URL, EMVCo content string, and readiness state
 *
 * @example
 * ```tsx
 * import { useVietQR } from '@llein/vn-bank-qr-gen/react';
 *
 * function PaymentModal({ amount, orderId }) {
 *   const { qrImageUrl, isReady, error } = useVietQR({
 *     bank: 'MB',
 *     accountNumber: '0987654321',
 *     accountName: 'NGUYEN VAN A',
 *     amount,
 *     message: `DH ${orderId}`
 *   });
 *
 *   if (!isReady) return <p>Vui lòng chọn ngân hàng và số tài khoản...</p>;
 *   if (error) return <p className="text-red-500">{error}</p>;
 *
 *   return <img src={qrImageUrl} alt="Mã VietQR" />;
 * }
 * ```
 */
export function useVietQR(options: Partial<VietQROptions>): UseVietQRResult {
  return useMemo(() => {
    if (!options.bank || !options.accountNumber) {
      return {
        result: null,
        qrImageUrl: '',
        qrContent: '',
        isReady: false,
        error: null
      };
    }

    try {
      const result = generateVietQR(options as VietQROptions);
      return {
        result,
        qrImageUrl: result.qrImageUrl,
        qrContent: result.qrContent,
        isReady: true,
        error: null
      };
    } catch (err: any) {
      return {
        result: null,
        qrImageUrl: '',
        qrContent: '',
        isReady: false,
        error: err?.message || 'Lỗi tạo mã VietQR'
      };
    }
  }, [
    options.bank,
    options.accountNumber,
    options.accountName,
    options.amount,
    options.message,
    options.serviceType,
    options.template
  ]);
}
