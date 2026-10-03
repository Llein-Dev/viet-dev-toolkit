/**
 * Official Modulo-11 weight multipliers for Vietnam Tax Identification Number (MST)
 * According to Circular 105/2020/TT-BTC and General Department of Taxation.
 */
export const TAX_WEIGHTS = [31, 29, 23, 19, 17, 13, 7, 5, 3] as const;

/**
 * Mapping of 2-digit province codes used in Vietnam Tax Codes
 */
export const TAX_PROVINCE_MAP: Record<string, string> = {
  '01': 'Thành phố Hà Nội',
  '02': 'Thành phố Hồ Chí Minh',
  '03': 'Thành phố Hồ Chí Minh',
  '04': 'Thành phố Đà Nẵng',
  '05': 'Thành phố Hải Phòng',
  '06': 'Tỉnh Nam Định',
  '07': 'Tỉnh Hà Nam',
  '08': 'Tỉnh Hải Dương',
  '09': 'Tỉnh Hưng Yên',
  '10': 'Tỉnh Thái Bình',
  '11': 'Tỉnh Ninh Bình',
  '12': 'Tỉnh Vĩnh Phúc',
  '13': 'Tỉnh Bắc Ninh',
  '14': 'Tỉnh Phú Thọ',
  '15': 'Tỉnh Bắc Giang',
  '16': 'Tỉnh Lạng Sơn',
  '17': 'Tỉnh Quảng Ninh',
  '18': 'Tỉnh Thái Nguyên',
  '19': 'Tỉnh Bắc Kạn',
  '20': 'Tỉnh Cao Bằng',
  '21': 'Tỉnh Tuyên Quang',
  '22': 'Tỉnh Hà Giang',
  '23': 'Tỉnh Yên Bái',
  '24': 'Tỉnh Lào Cai',
  '25': 'Tỉnh Hòa Bình',
  '26': 'Tỉnh Sơn La',
  '27': 'Tỉnh Điện Biên',
  '28': 'Tỉnh Lai Châu',
  '29': 'Tỉnh Thanh Hóa',
  '30': 'Tỉnh Nghệ An',
  '31': 'Tỉnh Hà Tĩnh',
  '32': 'Tỉnh Quảng Bình',
  '33': 'Tỉnh Quảng Trị',
  '34': 'Tỉnh Thừa Thiên Huế',
  '35': 'Tỉnh Quảng Nam',
  '36': 'Tỉnh Quảng Ngãi',
  '37': 'Tỉnh Bình Định',
  '38': 'Tỉnh Phú Yên',
  '39': 'Tỉnh Khánh Hòa',
  '40': 'Tỉnh Ninh Thuận',
  '41': 'Tỉnh Bình Thuận',
  '42': 'Tỉnh Kon Tum',
  '43': 'Tỉnh Gia Lai',
  '44': 'Tỉnh Đắk Lắk',
  '45': 'Tỉnh Lâm Đồng',
  '46': 'Tỉnh Tây Ninh',
  '47': 'Tỉnh Bình Dương',
  '48': 'Tỉnh Đồng Nai',
  '49': 'Tỉnh Bà Rịa - Vũng Tàu',
  '50': 'Tỉnh Long An',
  '51': 'Tỉnh Tiền Giang',
  '52': 'Tỉnh Bến Tre',
  '53': 'Tỉnh Trà Vinh',
  '54': 'Tỉnh Vĩnh Long',
  '55': 'Tỉnh Đồng Tháp',
  '56': 'Tỉnh An Giang',
  '57': 'Tỉnh Kiên Giang',
  '58': 'Thành phố Cần Thơ',
  '59': 'Tỉnh Hậu Giang',
  '60': 'Tỉnh Sóc Trăng',
  '61': 'Tỉnh Bạc Liêu',
  '62': 'Tỉnh Cà Mau',
  '63': 'Tỉnh Đắk Nông',
  '64': 'Tỉnh Bình Phước'
};

export interface TaxValidationResult {
  isValid: boolean;
  raw: string;
  formatted: string;
  type?: 'enterprise' | 'branch' | 'personal_10' | 'personal_cccd';
  baseTaxId?: string;
  branchCode?: string;
  provinceCode?: string;
  provinceName?: string;
  checkDigit?: number;
  expectedCheckDigit?: number;
  error?: string;
}

/**
 * Calculates the Modulo-11 check digit for the first 9 digits of a Vietnamese Tax ID
 */
export function calculateTaxChecksum(first9Digits: string): number {
  if (!/^\d{9}$/.test(first9Digits)) {
    throw new Error('First 9 digits must be numeric characters');
  }

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(first9Digits[i], 10) * TAX_WEIGHTS[i];
  }

  const remainder = sum % 11;
  const check = 10 - remainder;

  if (check === 10) return 0;
  if (check === 11) return 0;
  return check;
}

/**
 * Validates a Vietnamese Tax Identification Number (MST)
 * Supports:
 * - 10-digit primary enterprise / organization / personal tax ID
 * - 13-digit branch / dependent unit tax ID (with or without hyphen: `0100109106-001` or `0100109106001`)
 * - 12-digit CCCD used as personal tax ID
 */
export function validateTaxId(taxId: string): TaxValidationResult {
  const result: TaxValidationResult = {
    isValid: false,
    raw: taxId || '',
    formatted: ''
  };

  if (!taxId || typeof taxId !== 'string') {
    result.error = 'Tax ID must be a non-empty string';
    return result;
  }

  const clean = taxId.trim().replace(/\s+/g, '');

  // Case 1: 12-digit CCCD used as personal tax ID under Law on Identification 2023
  if (/^\d{12}$/.test(clean)) {
    result.isValid = true;
    result.raw = clean;
    result.formatted = clean;
    result.type = 'personal_cccd';
    result.baseTaxId = clean;
    return result;
  }

  let base = '';
  let branch = '';

  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length !== 2) {
      result.error = 'Tax ID has invalid hyphen format (expected XXXXXXXXXX-YYY)';
      return result;
    }
    base = parts[0];
    branch = parts[1];
  } else if (clean.length === 13) {
    base = clean.slice(0, 10);
    branch = clean.slice(10);
  } else {
    base = clean;
  }

  if (!/^\d{10}$/.test(base)) {
    result.error = 'Base Tax ID must contain exactly 10 numeric digits';
    return result;
  }

  if (branch && !/^\d{3}$/.test(branch)) {
    result.error = 'Branch suffix must contain exactly 3 numeric digits';
    return result;
  }

  const provCode = base.slice(0, 2);
  const actualCheckDigit = parseInt(base[9], 10);
  const expectedCheckDigit = calculateTaxChecksum(base.slice(0, 9));

  result.baseTaxId = base;
  result.provinceCode = provCode;
  result.provinceName = TAX_PROVINCE_MAP[provCode];
  result.checkDigit = actualCheckDigit;
  result.expectedCheckDigit = expectedCheckDigit;

  if (actualCheckDigit !== expectedCheckDigit) {
    result.error = `Invalid Modulo-11 checksum digit (got ${actualCheckDigit}, expected ${expectedCheckDigit})`;
    return result;
  }

  result.isValid = true;
  if (branch) {
    result.branchCode = branch;
    result.formatted = `${base}-${branch}`;
    result.type = 'branch';
  } else {
    result.formatted = base;
    result.type = 'enterprise';
  }

  return result;
}

/**
 * Formats a Tax ID into official representation (`XXXXXXXXXX` or `XXXXXXXXXX-YYY`)
 */
export function formatTaxId(taxId: string): string {
  const res = validateTaxId(taxId);
  return res.formatted || taxId;
}

/**
 * Returns true if the given tax ID is a valid enterprise or branch tax code
 */
export function isValidTaxId(taxId: string): boolean {
  return validateTaxId(taxId).isValid;
}

/**
 * Returns true if the tax ID is for an independent enterprise (10 digits)
 */
export function isEnterpriseTaxId(taxId: string): boolean {
  const res = validateTaxId(taxId);
  return res.isValid && res.type === 'enterprise';
}

/**
 * Returns true if the tax ID is for a branch or dependent unit (13 digits)
 */
export function isBranchTaxId(taxId: string): boolean {
  const res = validateTaxId(taxId);
  return res.isValid && res.type === 'branch';
}

/**
 * Generates a valid mock Vietnamese Tax ID for testing and fixture data
 */
export function generateMockTaxId(options?: { province?: string; branch?: boolean | string }): string {
  const prov = options?.province || '01'; // Default Hanoi
  const middle = String(Math.floor(Math.random() * 9000000) + 1000000);
  const first9 = `${prov.padStart(2, '0')}${middle.slice(0, 7)}`;
  const check = calculateTaxChecksum(first9);
  const base = `${first9}${check}`;

  if (options?.branch) {
    const branchCode = typeof options.branch === 'string' ? options.branch : '001';
    return `${base}-${branchCode.padStart(3, '0')}`;
  }

  return base;
}
