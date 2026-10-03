/**
 * vn-cccd-parser
 * Comprehensive Vietnam Citizen Identity (CCCD / VNeID) Parser & Validator
 * Zero-dependency, 100% TypeScript, Dual ESM/CJS
 */

export type Gender = 'Nam' | 'Nữ';
export type Region = 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';

export interface ProvinceInfo {
  code: string;
  name: string;
  region: Region;
  isMunicipality: boolean; // Thành phố trực thuộc Trung ương
}

export interface RenewalMilestones {
  age25Year: number;
  age40Year: number;
  age60Year: number;
  nextRenewalYear: number | null;
  isExpired: boolean;
}

export interface CCCDParseResult {
  isValid: boolean;
  raw: string;
  error?: string;
  provinceCode?: string;
  province?: string;
  region?: Region;
  isMunicipality?: boolean;
  genderCode?: number;
  gender?: Gender;
  century?: string;
  birthYear?: number;
  age?: number;
  randomCode?: string;
  renewalMilestones?: RenewalMilestones;
}

export interface CCCDQrResult {
  isValid: boolean;
  raw: string;
  error?: string;
  cccd?: string;
  oldCmnd?: string;
  fullName?: string;
  dateOfBirth?: string; // YYYY-MM-DD
  gender?: Gender;
  address?: string;
  issueDate?: string; // YYYY-MM-DD
  parsedCCCD?: CCCDParseResult;
  isConsistent?: boolean; // Checks if CCCD matches DOB and Gender in QR
}

export interface CMNDParseResult {
  isValid: boolean;
  raw: string;
  provinceCode?: string;
  province?: string;
  error?: string;
}

// 63 Provinces & Municipalities of Vietnam
export const PROVINCE_MAP: Record<string, { name: string; region: Region; isMunicipality: boolean }> = {
  '001': { name: 'Thành phố Hà Nội', region: 'Miền Bắc', isMunicipality: true },
  '002': { name: 'Tỉnh Hà Giang', region: 'Miền Bắc', isMunicipality: false },
  '004': { name: 'Tỉnh Cao Bằng', region: 'Miền Bắc', isMunicipality: false },
  '006': { name: 'Tỉnh Bắc Kạn', region: 'Miền Bắc', isMunicipality: false },
  '008': { name: 'Tỉnh Tuyên Quang', region: 'Miền Bắc', isMunicipality: false },
  '010': { name: 'Tỉnh Lào Cai', region: 'Miền Bắc', isMunicipality: false },
  '011': { name: 'Tỉnh Điện Biên', region: 'Miền Bắc', isMunicipality: false },
  '012': { name: 'Tỉnh Lai Châu', region: 'Miền Bắc', isMunicipality: false },
  '014': { name: 'Tỉnh Sơn La', region: 'Miền Bắc', isMunicipality: false },
  '015': { name: 'Tỉnh Yên Bái', region: 'Miền Bắc', isMunicipality: false },
  '017': { name: 'Tỉnh Hoà Bình', region: 'Miền Bắc', isMunicipality: false },
  '019': { name: 'Tỉnh Thái Nguyên', region: 'Miền Bắc', isMunicipality: false },
  '020': { name: 'Tỉnh Lạng Sơn', region: 'Miền Bắc', isMunicipality: false },
  '022': { name: 'Tỉnh Quảng Ninh', region: 'Miền Bắc', isMunicipality: false },
  '024': { name: 'Tỉnh Bắc Giang', region: 'Miền Bắc', isMunicipality: false },
  '025': { name: 'Tỉnh Phú Thọ', region: 'Miền Bắc', isMunicipality: false },
  '026': { name: 'Tỉnh Vĩnh Phúc', region: 'Miền Bắc', isMunicipality: false },
  '027': { name: 'Tỉnh Bắc Ninh', region: 'Miền Bắc', isMunicipality: false },
  '030': { name: 'Tỉnh Hải Dương', region: 'Miền Bắc', isMunicipality: false },
  '031': { name: 'Thành phố Hải Phòng', region: 'Miền Bắc', isMunicipality: true },
  '033': { name: 'Tỉnh Hưng Yên', region: 'Miền Bắc', isMunicipality: false },
  '034': { name: 'Tỉnh Thái Bình', region: 'Miền Bắc', isMunicipality: false },
  '035': { name: 'Tỉnh Hà Nam', region: 'Miền Bắc', isMunicipality: false },
  '036': { name: 'Tỉnh Nam Định', region: 'Miền Bắc', isMunicipality: false },
  '037': { name: 'Tỉnh Ninh Bình', region: 'Miền Bắc', isMunicipality: false },
  '038': { name: 'Tỉnh Thanh Hoá', region: 'Miền Bắc', isMunicipality: false },
  '040': { name: 'Tỉnh Nghệ An', region: 'Miền Bắc', isMunicipality: false },
  '042': { name: 'Tỉnh Hà Tĩnh', region: 'Miền Bắc', isMunicipality: false },
  '044': { name: 'Tỉnh Quảng Bình', region: 'Miền Trung', isMunicipality: false },
  '045': { name: 'Tỉnh Quảng Trị', region: 'Miền Trung', isMunicipality: false },
  '046': { name: 'Tỉnh Thừa Thiên Huế', region: 'Miền Trung', isMunicipality: false },
  '048': { name: 'Thành phố Đà Nẵng', region: 'Miền Trung', isMunicipality: true },
  '049': { name: 'Tỉnh Quảng Nam', region: 'Miền Trung', isMunicipality: false },
  '051': { name: 'Tỉnh Quảng Ngãi', region: 'Miền Trung', isMunicipality: false },
  '052': { name: 'Tỉnh Bình Định', region: 'Miền Trung', isMunicipality: false },
  '054': { name: 'Tỉnh Phú Yên', region: 'Miền Trung', isMunicipality: false },
  '056': { name: 'Tỉnh Khánh Hoà', region: 'Miền Trung', isMunicipality: false },
  '058': { name: 'Tỉnh Ninh Thuận', region: 'Miền Trung', isMunicipality: false },
  '060': { name: 'Tỉnh Bình Thuận', region: 'Miền Trung', isMunicipality: false },
  '062': { name: 'Tỉnh Kon Tum', region: 'Miền Trung', isMunicipality: false },
  '064': { name: 'Tỉnh Gia Lai', region: 'Miền Trung', isMunicipality: false },
  '066': { name: 'Tỉnh Đắk Lắk', region: 'Miền Trung', isMunicipality: false },
  '067': { name: 'Tỉnh Đắk Nông', region: 'Miền Trung', isMunicipality: false },
  '068': { name: 'Tỉnh Lâm Đồng', region: 'Miền Trung', isMunicipality: false },
  '070': { name: 'Tỉnh Bình Phước', region: 'Miền Nam', isMunicipality: false },
  '072': { name: 'Tỉnh Tây Ninh', region: 'Miền Nam', isMunicipality: false },
  '074': { name: 'Tỉnh Bình Dương', region: 'Miền Nam', isMunicipality: false },
  '075': { name: 'Tỉnh Đồng Nai', region: 'Miền Nam', isMunicipality: false },
  '077': { name: 'Tỉnh Bà Rịa - Vũng Tàu', region: 'Miền Nam', isMunicipality: false },
  '079': { name: 'Thành phố Hồ Chí Minh', region: 'Miền Nam', isMunicipality: true },
  '080': { name: 'Tỉnh Long An', region: 'Miền Nam', isMunicipality: false },
  '082': { name: 'Tỉnh Tiền Giang', region: 'Miền Nam', isMunicipality: false },
  '083': { name: 'Tỉnh Bến Tre', region: 'Miền Nam', isMunicipality: false },
  '084': { name: 'Tỉnh Trà Vinh', region: 'Miền Nam', isMunicipality: false },
  '086': { name: 'Tỉnh Vĩnh Long', region: 'Miền Nam', isMunicipality: false },
  '087': { name: 'Tỉnh Đồng Tháp', region: 'Miền Nam', isMunicipality: false },
  '089': { name: 'Tỉnh An Giang', region: 'Miền Nam', isMunicipality: false },
  '091': { name: 'Tỉnh Kiên Giang', region: 'Miền Nam', isMunicipality: false },
  '092': { name: 'Thành phố Cần Thơ', region: 'Miền Nam', isMunicipality: true },
  '093': { name: 'Tỉnh Hậu Giang', region: 'Miền Nam', isMunicipality: false },
  '094': { name: 'Tỉnh Sóc Trăng', region: 'Miền Nam', isMunicipality: false },
  '095': { name: 'Tỉnh Bạc Liêu', region: 'Miền Nam', isMunicipality: false },
  '096': { name: 'Tỉnh Cà Mau', region: 'Miền Nam', isMunicipality: false }
};

export const PROVINCE_CODES: Record<string, string> = Object.fromEntries(
  Object.entries(PROVINCE_MAP).map(([code, info]) => [code, info.name])
);

/**
 * Calculates identity card renewal milestones based on Article 21, Vietnam Citizen Identity Law
 * (Required renewals at ages 25, 40, and 60).
 */
export function getRenewalMilestones(birthYear: number, currentYear = new Date().getFullYear()): RenewalMilestones {
  const age25Year = birthYear + 25;
  const age40Year = birthYear + 40;
  const age60Year = birthYear + 60;

  let nextRenewalYear: number | null = null;
  let isExpired = false;

  if (currentYear < age25Year) {
    nextRenewalYear = age25Year;
  } else if (currentYear < age40Year) {
    nextRenewalYear = age40Year;
  } else if (currentYear < age60Year) {
    nextRenewalYear = age60Year;
  } else {
    // Over 60: permanent validity, no more renewals required
    nextRenewalYear = null;
  }

  // Check if citizen missed a required renewal milestone
  const currentAge = currentYear - birthYear;
  if (
    (currentAge > 25 && currentAge < 40 && currentYear > age25Year + 2) ||
    (currentAge > 40 && currentAge < 60 && currentYear > age40Year + 2)
  ) {
    isExpired = true;
  }

  return {
    age25Year,
    age40Year,
    age60Year,
    nextRenewalYear,
    isExpired
  };
}

/**
 * Parse a 12-digit Vietnam National Identity Card (CCCD) number
 */
export function parseCCCD(id: string): CCCDParseResult {
  const clean = String(id || '').trim();

  if (!/^\d{12}$/.test(clean)) {
    return {
      isValid: false,
      raw: clean,
      error: 'Số CCCD phải bao gồm đúng 12 chữ số'
    };
  }

  const provinceCode = clean.slice(0, 3);
  const provinceInfo = PROVINCE_MAP[provinceCode];
  if (!provinceInfo) {
    return {
      isValid: false,
      raw: clean,
      error: `Mã tỉnh/thành phố không hợp lệ: "${provinceCode}"`
    };
  }

  const genderDigit = parseInt(clean[3], 10);
  const birthYearSuffix = parseInt(clean.slice(4, 6), 10);
  const randomCode = clean.slice(6, 12);

  let century = '';
  let baseYear = 1900;
  let gender: Gender = 'Nam';

  switch (genderDigit) {
    case 0:
      gender = 'Nam';
      baseYear = 1900;
      century = 'Thế kỷ 20 (1900 - 1999)';
      break;
    case 1:
      gender = 'Nữ';
      baseYear = 1900;
      century = 'Thế kỷ 20 (1900 - 1999)';
      break;
    case 2:
      gender = 'Nam';
      baseYear = 2000;
      century = 'Thế kỷ 21 (2000 - 2099)';
      break;
    case 3:
      gender = 'Nữ';
      baseYear = 2000;
      century = 'Thế kỷ 21 (2000 - 2099)';
      break;
    case 4:
      gender = 'Nam';
      baseYear = 2100;
      century = 'Thế kỷ 22 (2100 - 2199)';
      break;
    case 5:
      gender = 'Nữ';
      baseYear = 2100;
      century = 'Thế kỷ 22 (2100 - 2199)';
      break;
    case 6:
      gender = 'Nam';
      baseYear = 2200;
      century = 'Thế kỷ 23 (2200 - 2299)';
      break;
    case 7:
      gender = 'Nữ';
      baseYear = 2200;
      century = 'Thế kỷ 23 (2200 - 2299)';
      break;
    case 8:
      gender = 'Nam';
      baseYear = 2300;
      century = 'Thế kỷ 24 (2300 - 2399)';
      break;
    case 9:
      gender = 'Nữ';
      baseYear = 2300;
      century = 'Thế kỷ 24 (2300 - 2399)';
      break;
    default:
      return { isValid: false, raw: clean, error: 'Chữ số giới tính/thế kỷ không hợp lệ' };
  }

  const birthYear = baseYear + birthYearSuffix;
  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - birthYear);
  const renewalMilestones = getRenewalMilestones(birthYear, currentYear);

  return {
    isValid: true,
    raw: clean,
    provinceCode,
    province: provinceInfo.name,
    region: provinceInfo.region,
    isMunicipality: provinceInfo.isMunicipality,
    genderCode: genderDigit,
    gender,
    century,
    birthYear,
    age,
    randomCode,
    renewalMilestones
  };
}

/**
 * Check if a string is a valid 12-digit CCCD
 */
export function isValidCCCD(id: string): boolean {
  return parseCCCD(id).isValid;
}

/**
 * Parse QR Code data string printed on chip-based CCCD
 * Format: CCCD|OldCMND|FullName|DOB(DDMMYYYY)|Gender|Address|IssueDate(DDMMYYYY)
 */
export function parseCCCDQr(qrString: string): CCCDQrResult {
  const clean = String(qrString || '').trim();
  const parts = clean.split('|');

  if (parts.length < 6) {
    return {
      isValid: false,
      raw: clean,
      error: 'Chuỗi QR không đúng định dạng CCCD gắn chip (ít hơn 6 trường thông tin)'
    };
  }

  const [cccd, oldCmnd, fullName, dobRaw, genderRaw, address, issueDateRaw] = parts;

  // Format DOB from DDMMYYYY to ISO YYYY-MM-DD
  let dateOfBirth = dobRaw;
  let birthYearFromDob: number | undefined;
  if (/^\d{8}$/.test(dobRaw)) {
    const d = dobRaw.slice(0, 2);
    const m = dobRaw.slice(2, 4);
    const y = dobRaw.slice(4, 8);
    dateOfBirth = `${y}-${m}-${d}`;
    birthYearFromDob = parseInt(y, 10);
  }

  // Format IssueDate from DDMMYYYY to ISO YYYY-MM-DD
  let issueDate = issueDateRaw;
  if (issueDateRaw && /^\d{8}$/.test(issueDateRaw)) {
    const d = issueDateRaw.slice(0, 2);
    const m = issueDateRaw.slice(2, 4);
    const y = issueDateRaw.slice(4, 8);
    issueDate = `${y}-${m}-${d}`;
  }

  const gender = genderRaw === 'Nam' ? 'Nam' : genderRaw === 'Nữ' ? 'Nữ' : undefined;
  const parsedCCCD = parseCCCD(cccd);

  // Consistency cross-check between QR fields and CCCD numbers
  let isConsistent = true;
  if (parsedCCCD.isValid) {
    if (gender && parsedCCCD.gender !== gender) isConsistent = false;
    if (birthYearFromDob && parsedCCCD.birthYear !== birthYearFromDob) isConsistent = false;
  } else {
    isConsistent = false;
  }

  return {
    isValid: true,
    raw: clean,
    cccd,
    oldCmnd: oldCmnd ? oldCmnd.trim() : undefined,
    fullName: fullName ? fullName.trim() : undefined,
    dateOfBirth,
    gender,
    address: address ? address.trim() : undefined,
    issueDate,
    parsedCCCD,
    isConsistent
  };
}

/**
 * Generate a mock CCCD number for unit testing and fixtures
 */
export function generateMockCCCD(options: {
  provinceCode?: string;
  gender?: Gender;
  birthYear?: number;
} = {}): string {
  const validProvinceCodes = Object.keys(PROVINCE_MAP);
  const prov = options.provinceCode || validProvinceCodes[Math.floor(Math.random() * validProvinceCodes.length)];

  const year = options.birthYear || Math.floor(Math.random() * 50) + 1970;
  const isFemale = options.gender ? options.gender === 'Nữ' : Math.random() > 0.5;

  let genderDigit = 0;
  if (year >= 1900 && year <= 1999) {
    genderDigit = isFemale ? 1 : 0;
  } else if (year >= 2000 && year <= 2099) {
    genderDigit = isFemale ? 3 : 2;
  } else if (year >= 2100 && year <= 2199) {
    genderDigit = isFemale ? 5 : 4;
  }

  const yearSuffix = String(year % 100).padStart(2, '0');
  const randomSuffix = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

  return `${prov}${genderDigit}${yearSuffix}${randomSuffix}`;
}
