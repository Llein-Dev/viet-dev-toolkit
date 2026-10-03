export type CarrierName =
  | 'Viettel'
  | 'VinaPhone'
  | 'MobiFone'
  | 'Vietnamobile'
  | 'Wintel'
  | 'I-Telecom'
  | 'Gmobile'
  | 'VNPT'
  | 'FPT'
  | 'Unknown';

export type LineType = 'mobile' | 'landline' | 'hotline';

export interface VNPhoneResult {
  isValid: boolean;
  raw: string;
  national?: string; // e.g. "0987654321"
  e164?: string; // e.g. "+84987654321"
  carrier?: CarrierName;
  lineType?: LineType;
  prefix?: string;
  areaName?: string; // For landlines (e.g. "Hà Nội", "TP. Hồ Chí Minh")
  formattedPretty?: string; // e.g. "098 765 4321"
  formattedMasked?: string; // e.g. "0987***321"
  wasMigratedFrom11Digits?: boolean;
}

export const CARRIER_PREFIXES: Record<
  'Viettel' | 'VinaPhone' | 'MobiFone' | 'Vietnamobile' | 'Wintel' | 'I-Telecom' | 'Gmobile',
  string[]
> = {
  Viettel: ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
  VinaPhone: ['088', '091', '094', '081', '082', '083', '084', '085'],
  MobiFone: ['089', '090', '093', '070', '079', '077', '076', '078'],
  Vietnamobile: ['092', '056', '058', '052'],
  Wintel: ['055'],
  'I-Telecom': ['087'],
  Gmobile: ['099', '059']
};

/**
 * Vietnam Landline Area Codes (Mã vùng cố định sau quy hoạch 2017)
 */
export const LANDLINE_PREFIXES: Record<string, string> = {
  '024': 'Hà Nội',
  '028': 'TP. Hồ Chí Minh',
  '0236': 'Đà Nẵng',
  '0225': 'Hải Phòng',
  '0292': 'Cần Thơ',
  '0222': 'Bắc Ninh',
  '0204': 'Bắc Giang',
  '0220': 'Hải Dương',
  '0221': 'Hưng Yên',
  '0227': 'Thái Bình',
  '0226': 'Hà Nam',
  '0228': 'Nam Định',
  '0229': 'Ninh Bình',
  '0210': 'Phú Thọ',
  '0211': 'Vĩnh Phúc',
  '0203': 'Quảng Ninh',
  '0208': 'Thái Nguyên',
  '0274': 'Bình Dương',
  '0251': 'Đồng Nai',
  '0254': 'Bà Rịa - Vũng Tàu',
  '0272': 'Long An',
  '0273': 'Tiền Giang',
  '0275': 'Bến Tre',
  '0270': 'Vĩnh Long',
  '0277': 'Đồng Tháp',
  '0296': 'An Giang',
  '0297': 'Kiên Giang',
  '0258': 'Khánh Hòa',
  '0263': 'Lâm Đồng',
  '0262': 'Đắk Lắk'
};

/**
 * Migration table for legacy 11-digit prefixes converted to 10 digits in 2018
 */
export const LEGACY_11_PREFIXES: Record<string, string> = {
  // Viettel: 016x -> 03x
  '0162': '032',
  '0163': '033',
  '0164': '034',
  '0165': '035',
  '0166': '036',
  '0167': '037',
  '0168': '038',
  '0169': '039',
  // MobiFone: 012x -> 07x
  '0120': '070',
  '0121': '079',
  '0122': '077',
  '0126': '076',
  '0128': '078',
  // VinaPhone: 012x -> 08x
  '0123': '083',
  '0124': '084',
  '0125': '085',
  '0127': '081',
  '0129': '082',
  // Vietnamobile: 018x -> 05x
  '0186': '056',
  '0188': '058',
  // Gmobile: 0199 -> 059
  '0199': '059'
};

/**
 * Parse and validate a Vietnamese telephone number, detecting carrier and format variants.
 * Supports mobile, landline (cố định), and hotline numbers.
 */
export function parseVNPhone(phone: string): VNPhoneResult {
  const result: VNPhoneResult = {
    isValid: false,
    raw: phone || ''
  };

  if (!phone || typeof phone !== 'string') return result;

  // Clean formatting characters, spaces, parentheses
  let clean = phone.trim().replace(/[\s().,-]+/g, '');

  // Check hotline (1800, 1900)
  if (/^(1800|1900)\d{4,6}$/.test(clean)) {
    return {
      isValid: true,
      raw: phone,
      national: clean,
      lineType: 'hotline',
      prefix: clean.slice(0, 4),
      formattedPretty: `${clean.slice(0, 4)} ${clean.slice(4)}`,
      formattedMasked: `${clean.slice(0, 4)}***${clean.slice(-2)}`
    };
  }

  // Normalize international prefixes (+84, 0084, 84) to national (0)
  if (clean.startsWith('+84')) {
    clean = '0' + clean.slice(3);
  } else if (clean.startsWith('0084')) {
    clean = '0' + clean.slice(4);
  } else if (clean.startsWith('84') && clean.length >= 11) {
    clean = '0' + clean.slice(2);
  }

  // Remove any remaining non-digit characters
  clean = clean.replace(/\D/g, '');

  let wasMigrated = false;

  // Handle legacy 11-digit mobile numbers (0168xxxxxxx -> 038xxxxxxx)
  if (clean.length === 11 && clean.startsWith('01')) {
    const oldPrefix = clean.slice(0, 4);
    const newPrefix = LEGACY_11_PREFIXES[oldPrefix];
    if (newPrefix) {
      clean = newPrefix + clean.slice(4);
      wasMigrated = true;
    }
  }

  // 1. Mobile phone check: exactly 10 digits starting with 0
  if (/^0\d{9}$/.test(clean)) {
    const prefix = clean.slice(0, 3);
    let detectedCarrier: CarrierName | undefined;

    for (const [carrier, prefixes] of Object.entries(CARRIER_PREFIXES)) {
      if (prefixes.includes(prefix)) {
        detectedCarrier = carrier as CarrierName;
        break;
      }
    }

    if (detectedCarrier) {
      const e164 = '+84' + clean.slice(1);
      const pretty = `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
      const masked = `${clean.slice(0, 4)}***${clean.slice(7)}`;

      return {
        isValid: true,
        raw: phone,
        national: clean,
        e164,
        carrier: detectedCarrier,
        lineType: 'mobile',
        prefix,
        formattedPretty: pretty,
        formattedMasked: masked,
        wasMigratedFrom11Digits: wasMigrated
      };
    }
  }

  // 2. Landline phone check: 11 digits starting with 02
  if (/^02\d{9}$/.test(clean)) {
    // Check 3-digit area code (e.g. 024 Hà Nội, 028 TP.HCM)
    const code3 = clean.slice(0, 3);
    const code4 = clean.slice(0, 4);
    const areaName = LANDLINE_PREFIXES[code3] || LANDLINE_PREFIXES[code4];

    if (areaName) {
      const pLen = LANDLINE_PREFIXES[code3] ? 3 : 4;
      const pref = clean.slice(0, pLen);
      const rest = clean.slice(pLen);
      const pretty = `${pref} ${rest.slice(0, 4)} ${rest.slice(4)}`;
      const masked = `${pref} *** ${rest.slice(-4)}`;

      return {
        isValid: true,
        raw: phone,
        national: clean,
        e164: '+84' + clean.slice(1),
        carrier: 'VNPT', // Default public telecom provider for landline
        lineType: 'landline',
        prefix: pref,
        areaName,
        formattedPretty: pretty,
        formattedMasked: masked
      };
    }
  }

  return result;
}

/**
 * Returns true if the phone number is a valid active Vietnamese phone number
 */
export function isVNPhoneValid(phone: string): boolean {
  return parseVNPhone(phone).isValid;
}

/**
 * Get carrier name from a phone number
 */
export function getCarrier(phone: string): CarrierName | undefined {
  return parseVNPhone(phone).carrier;
}

/**
 * Format phone number into specified style
 */
export function formatPhone(
  phone: string,
  style: 'national' | 'e164' | 'pretty' | 'dots' | 'dashes' = 'pretty'
): string {
  const parsed = parseVNPhone(phone);
  if (!parsed.isValid || !parsed.national) return phone;

  const n = parsed.national;
  switch (style) {
    case 'national':
      return n;
    case 'e164':
      return parsed.e164 || phone;
    case 'pretty':
      return parsed.formattedPretty || `${n.slice(0, 4)} ${n.slice(4, 7)} ${n.slice(7)}`;
    case 'dots':
      return `${n.slice(0, 4)}.${n.slice(4, 7)}.${n.slice(7)}`;
    case 'dashes':
      return `${n.slice(0, 4)}-${n.slice(4, 7)}-${n.slice(7)}`;
    default:
      return n;
  }
}

/**
 * Masks the middle 3 digits of a phone number for privacy display (e.g. 0987***321)
 */
export function maskPhone(phone: string): string {
  const parsed = parseVNPhone(phone);
  if (!parsed.isValid || !parsed.national) return phone;
  return parsed.formattedMasked || `${parsed.national.slice(0, 4)}***${parsed.national.slice(7)}`;
}
