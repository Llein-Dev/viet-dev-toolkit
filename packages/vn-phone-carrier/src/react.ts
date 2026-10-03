import { useMemo } from 'react';
import { parseVNPhone, VNPhoneResult } from './index';

export interface UseVNPhoneResult extends VNPhoneResult {
  /** Suggested official brand hexadecimal color for UI badges/indicators */
  brandColor: string;
}

export const CARRIER_BRAND_COLORS: Record<string, string> = {
  Viettel: '#007A3D',
  VinaPhone: '#00A3E0',
  MobiFone: '#0055A5',
  Vietnamobile: '#FF6600',
  Wintel: '#E60000',
  'I-Telecom': '#E4002B',
  Gmobile: '#FFD100',
  VNPT: '#00A3E0',
  FPT: '#F37021',
  Unknown: '#64748B'
};

/**
 * React Custom Hook to validate and detect Vietnamese phone carriers in real-time.
 *
 * @param phoneNumber The raw phone string being typed into the input
 * @returns Real-time carrier detection, validation, formatting, and brand color
 *
 * @example
 * ```tsx
 * import { useVNPhone } from '@llein/vn-phone-carrier/react';
 *
 * function PhoneField() {
 *   const [phone, setPhone] = useState('');
 *   const { carrier, isValid, brandColor, formattedPretty, e164 } = useVNPhone(phone);
 *
 *   return (
 *     <div>
 *       <input value={phone} onChange={(e) => setPhone(e.target.value)} />
 *       {isValid && (
 *         <span style={{ color: brandColor }}>
 *           {carrier} ({formattedPretty})
 *         </span>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useVNPhone(phoneNumber: string): UseVNPhoneResult {
  return useMemo(() => {
    const result = parseVNPhone(phoneNumber);
    const brandColor = (result.carrier && CARRIER_BRAND_COLORS[result.carrier]) || '#64748B';
    return {
      ...result,
      brandColor
    };
  }, [phoneNumber]);
}

/** Alias for useVNPhone */
export const usePhoneCarrier = useVNPhone;
