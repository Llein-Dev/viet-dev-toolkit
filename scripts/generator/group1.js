module.exports = [
  {
    folder: '01-vn-cccd-parser',
    name: 'vn-cccd-parser',
    description: 'Parse 12-digit Vietnam National Citizen Identity (CCCD/VNeID) number into birth year, century, gender, and birth province.',
    keywords: ['vietnam', 'cccd', 'vneid', 'identity', 'parser', 'validation'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { parseCCCD, isValidCCCD } from 'vn-cccd-parser';

const result = parseCCCD('001095012345');

if (result.isValid) {
  console.log(result.province); // "Thành phố Hà Nội"
  console.log(result.gender);   // "Nam"
  console.log(result.birthYear);// 1995
  console.log(result.century);  // "Thế kỷ 20 (1900-1999)"
}`,
    apiList: `- \`parseCCCD(id: string): CCCDParseResult\`
- \`isValidCCCD(id: string): boolean\`
- \`getProvinceByCode(code: string): string | undefined\``,
    code: `export interface CCCDParseResult {
  isValid: boolean;
  raw: string;
  error?: string;
  provinceCode?: string;
  province?: string;
  genderCode?: number;
  gender?: 'Nam' | 'Nữ';
  century?: string;
  birthYear?: number;
  randomCode?: string;
}

export const PROVINCE_CODES: Record<string, string> = {
  '001': 'Thành phố Hà Nội',
  '002': 'Tỉnh Hà Giang',
  '004': 'Tỉnh Cao Bằng',
  '006': 'Tỉnh Bắc Kạn',
  '008': 'Tỉnh Tuyên Quang',
  '010': 'Tỉnh Lào Cai',
  '011': 'Tỉnh Điện Biên',
  '012': 'Tỉnh Lai Châu',
  '014': 'Tỉnh Sơn La',
  '015': 'Tỉnh Yên Bái',
  '017': 'Tỉnh Hoà Bình',
  '019': 'Tỉnh Thái Nguyên',
  '020': 'Tỉnh Lạng Sơn',
  '022': 'Tỉnh Quảng Ninh',
  '024': 'Tỉnh Bắc Giang',
  '025': 'Tỉnh Phú Thọ',
  '026': 'Tỉnh Vĩnh Phúc',
  '027': 'Tỉnh Bắc Ninh',
  '030': 'Tỉnh Hải Dương',
  '031': 'Thành phố Hải Phòng',
  '033': 'Tỉnh Hưng Yên',
  '034': 'Tỉnh Thái Bình',
  '035': 'Tỉnh Hà Nam',
  '036': 'Tỉnh Nam Định',
  '037': 'Tỉnh Ninh Bình',
  '038': 'Tỉnh Thanh Hoá',
  '040': 'Tỉnh Nghệ An',
  '042': 'Tỉnh Hà Tĩnh',
  '044': 'Tỉnh Quảng Bình',
  '045': 'Tỉnh Quảng Trị',
  '046': 'Tỉnh Thừa Thiên Huế',
  '048': 'Thành phố Đà Nẵng',
  '049': 'Tỉnh Quảng Nam',
  '051': 'Tỉnh Quảng Ngãi',
  '052': 'Tỉnh Bình Định',
  '054': 'Tỉnh Phú Yên',
  '056': 'Tỉnh Khánh Hoà',
  '058': 'Tỉnh Ninh Thuận',
  '060': 'Tỉnh Bình Thuận',
  '062': 'Tỉnh Kon Tum',
  '064': 'Tỉnh Gia Lai',
  '066': 'Tỉnh Đắk Lắk',
  '067': 'Tỉnh Đắk Nông',
  '068': 'Tỉnh Lâm Đồng',
  '070': 'Tỉnh Bình Phước',
  '072': 'Tỉnh Tây Ninh',
  '074': 'Tỉnh Bình Dương',
  '075': 'Tỉnh Đồng Nai',
  '077': 'Tỉnh Bà Rịa - Vũng Tàu',
  '079': 'Thành phố Hồ Chí Minh',
  '080': 'Tỉnh Long An',
  '082': 'Tỉnh Tiền Giang',
  '083': 'Tỉnh Bến Tre',
  '084': 'Tỉnh Trà Vinh',
  '086': 'Tỉnh Vĩnh Long',
  '087': 'Tỉnh Đồng Tháp',
  '089': 'Tỉnh An Giang',
  '091': 'Tỉnh Kiên Giang',
  '092': 'Thành phố Cần Thơ',
  '093': 'Tỉnh Hậu Giang',
  '094': 'Tỉnh Sóc Trăng',
  '095': 'Tỉnh Bạc Liêu',
  '096': 'Tỉnh Cà Mau'
};

export function getProvinceByCode(code: string): string | undefined {
  return PROVINCE_CODES[code];
}

export function parseCCCD(id: string): CCCDParseResult {
  const clean = String(id || '').trim();

  if (!/^\\d{12}$/.test(clean)) {
    return {
      isValid: false,
      raw: clean,
      error: 'CCCD must be exactly 12 numeric digits'
    };
  }

  const provinceCode = clean.slice(0, 3);
  const province = PROVINCE_CODES[provinceCode];
  if (!province) {
    return {
      isValid: false,
      raw: clean,
      error: \`Invalid province code: \${provinceCode}\`
    };
  }

  const genderDigit = parseInt(clean[3], 10);
  const birthYearSuffix = parseInt(clean.slice(4, 6), 10);
  const randomCode = clean.slice(6, 12);

  let century = '';
  let baseYear = 1900;
  let gender: 'Nam' | 'Nữ' = 'Nam';

  switch (genderDigit) {
    case 0:
      gender = 'Nam';
      baseYear = 1900;
      century = 'Thế kỷ 20 (1900-1999)';
      break;
    case 1:
      gender = 'Nữ';
      baseYear = 1900;
      century = 'Thế kỷ 20 (1900-1999)';
      break;
    case 2:
      gender = 'Nam';
      baseYear = 2000;
      century = 'Thế kỷ 21 (2000-2099)';
      break;
    case 3:
      gender = 'Nữ';
      baseYear = 2000;
      century = 'Thế kỷ 21 (2000-2099)';
      break;
    case 4:
      gender = 'Nam';
      baseYear = 2100;
      century = 'Thế kỷ 22 (2100-2199)';
      break;
    case 5:
      gender = 'Nữ';
      baseYear = 2100;
      century = 'Thế kỷ 22 (2100-2199)';
      break;
    case 6:
      gender = 'Nam';
      baseYear = 2200;
      century = 'Thế kỷ 23 (2200-2299)';
      break;
    case 7:
      gender = 'Nữ';
      baseYear = 2200;
      century = 'Thế kỷ 23 (2200-2299)';
      break;
    case 8:
      gender = 'Nam';
      baseYear = 2300;
      century = 'Thế kỷ 24 (2300-2399)';
      break;
    case 9:
      gender = 'Nữ';
      baseYear = 2300;
      century = 'Thế kỷ 24 (2300-2399)';
      break;
    default:
      return { isValid: false, raw: clean, error: 'Invalid gender digit' };
  }

  const birthYear = baseYear + birthYearSuffix;

  return {
    isValid: true,
    raw: clean,
    provinceCode,
    province,
    genderCode: genderDigit,
    gender,
    century,
    birthYear,
    randomCode
  };
}

export function isValidCCCD(id: string): boolean {
  return parseCCCD(id).isValid;
}
`
  },
  {
    folder: '02-vn-tax-id-validator',
    name: 'vn-tax-id-validator',
    description: 'Validate and format Vietnam Tax Identification Numbers (Mã số thuế - MST 10 and 13 digits) using official Checksum Modulo-11 algorithm.',
    keywords: ['vietnam', 'tax-id', 'mst', 'validator', 'checksum', 'accounting'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { validateTaxId, formatTaxId } from 'vn-tax-id-validator';

const result = validateTaxId('0100109106');
console.log(result.isValid); // true
console.log(result.type);    // "enterprise"

const branchResult = validateTaxId('0100109106-001');
console.log(branchResult.isValid); // true
console.log(branchResult.type);    // "branch"`,
    apiList: `- \`validateTaxId(taxId: string): TaxValidationResult\`
- \`formatTaxId(taxId: string): string\`
- \`isEnterpriseTaxId(taxId: string): boolean\``,
    code: `export interface TaxValidationResult {
  isValid: boolean;
  raw: string;
  formatted?: string;
  type?: 'enterprise' | 'personal' | 'branch';
  error?: string;
}

const WEIGHTS = [31, 29, 23, 19, 17, 13, 7, 5, 3];

export function validateTaxId(taxId: string): TaxValidationResult {
  if (!taxId) {
    return { isValid: false, raw: '', error: 'Tax ID is required' };
  }

  const clean = String(taxId).trim().replace(/\\s+/g, '');

  let base = '';
  let branch = '';

  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length !== 2) {
      return { isValid: false, raw: clean, error: 'Malformed hyphenated tax ID' };
    }
    base = parts[0];
    branch = parts[1];
  } else if (clean.length === 13) {
    base = clean.slice(0, 10);
    branch = clean.slice(10);
  } else {
    base = clean;
  }

  if (!/^\\d{10}$/.test(base)) {
    return { isValid: false, raw: clean, error: 'Base Tax ID must contain exactly 10 digits' };
  }

  if (branch && !/^\\d{3}$/.test(branch)) {
    return { isValid: false, raw: clean, error: 'Branch code must contain exactly 3 digits' };
  }

  // Modulo-11 Checksum calculation for the first 10 digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(base[i], 10) * WEIGHTS[i];
  }

  const remainder = sum % 11;
  const calculatedCheckDigit = 10 - remainder;
  const actualCheckDigit = parseInt(base[9], 10);

  // If remainder is 0 or 1, check digit rules in Vietnam standard
  let validCheckDigit = calculatedCheckDigit;
  if (calculatedCheckDigit === 10) validCheckDigit = 0;
  if (calculatedCheckDigit === 11) validCheckDigit = 0;

  if (actualCheckDigit !== validCheckDigit && actualCheckDigit !== (10 - remainder)) {
    return { isValid: false, raw: clean, error: 'Invalid Tax ID checksum' };
  }

  const formatted = branch ? \`\${base}-\${branch}\` : base;
  const type = branch ? 'branch' : 'enterprise';

  return {
    isValid: true,
    raw: clean,
    formatted,
    type
  };
}

export function formatTaxId(taxId: string): string {
  const result = validateTaxId(taxId);
  return result.formatted || taxId;
}

export function isEnterpriseTaxId(taxId: string): boolean {
  const res = validateTaxId(taxId);
  return res.isValid && res.type === 'enterprise';
}
`
  },
  {
    folder: '03-vn-plate-format',
    name: 'vn-plate-format',
    description: 'Format, standardize and parse Vietnam vehicle license plates according to Circular 24/2023/TT-BCA.',
    keywords: ['vietnam', 'license-plate', 'anpr', 'bien-so-xe', 'circular-24-2023'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { parseLicensePlate, formatLicensePlate } from 'vn-plate-format';

const plate = parseLicensePlate('51K99999');
console.log(plate.province);    // "Thành phố Hồ Chí Minh"
console.log(plate.vehicleType); // "car"
console.log(plate.formatted);   // "51K-999.99"`,
    apiList: `- \`parseLicensePlate(plate: string): PlateParseResult\`
- \`formatLicensePlate(plate: string): string\`
- \`getPlateProvince(plateCode: string): string | undefined\``,
    code: `export interface PlateParseResult {
  isValid: boolean;
  raw: string;
  formatted?: string;
  provinceCode?: string;
  province?: string;
  series?: string;
  numbers?: string;
  vehicleType?: 'car' | 'motorbike' | 'electric' | 'special';
  plateColor?: 'white' | 'yellow' | 'blue' | 'red';
}

export const PLATE_PROVINCES: Record<string, string> = {
  '11': 'Cao Bằng',
  '12': 'Lạng Sơn',
  '14': 'Quảng Ninh',
  '15': 'Hải Phòng',
  '16': 'Hải Phòng',
  '17': 'Thái Bình',
  '18': 'Nam Định',
  '19': 'Phú Thọ',
  '20': 'Thái Nguyên',
  '21': 'Yên Bái',
  '22': 'Tuyên Quang',
  '23': 'Hà Giang',
  '24': 'Lào Cai',
  '25': 'Lai Châu',
  '26': 'Sơn La',
  '27': 'Điện Biên',
  '28': 'Hòa Bình',
  '29': 'Hà Nội',
  '30': 'Hà Nội',
  '31': 'Hà Nội',
  '32': 'Hà Nội',
  '33': 'Hà Nội',
  '40': 'Hà Nội',
  '34': 'Hải Dương',
  '35': 'Ninh Bình',
  '36': 'Thanh Hóa',
  '37': 'Nghệ An',
  '38': 'Hà Tĩnh',
  '43': 'Đà Nẵng',
  '47': 'Đắk Lắk',
  '48': 'Đắk Nông',
  '49': 'Lâm Đồng',
  '50': 'TP. Hồ Chí Minh',
  '51': 'TP. Hồ Chí Minh',
  '52': 'TP. Hồ Chí Minh',
  '53': 'TP. Hồ Chí Minh',
  '54': 'TP. Hồ Chí Minh',
  '55': 'TP. Hồ Chí Minh',
  '56': 'TP. Hồ Chí Minh',
  '57': 'TP. Hồ Chí Minh',
  '58': 'TP. Hồ Chí Minh',
  '59': 'TP. Hồ Chí Minh',
  '60': 'Đồng Nai',
  '61': 'Bình Dương',
  '62': 'Long An',
  '63': 'Tiền Giang',
  '64': 'Vĩnh Long',
  '65': 'Cần Thơ',
  '66': 'Đồng Tháp',
  '67': 'An Giang',
  '68': 'Kiên Giang',
  '69': 'Cà Mau',
  '70': 'Tây Ninh',
  '71': 'Bến Tre',
  '72': 'Bà Rịa - Vũng Tàu',
  '73': 'Quảng Bình',
  '74': 'Quảng Trị',
  '75': 'Thừa Thiên Huế',
  '76': 'Quảng Ngãi',
  '77': 'Bình Định',
  '78': 'Phú Yên',
  '79': 'Khánh Hòa',
  '81': 'Gia Lai',
  '82': 'Kon Tum',
  '83': 'Sóc Trăng',
  '84': 'Trà Vinh',
  '85': 'Ninh Thuận',
  '86': 'Bình Thuận',
  '88': 'Vĩnh Phúc',
  '89': 'Hưng Yên',
  '90': 'Hà Nam',
  '92': 'Quảng Nam',
  '93': 'Bình Phước',
  '94': 'Bạc Liêu',
  '95': 'Hậu Giang',
  '97': 'Bắc Kạn',
  '98': 'Bắc Giang',
  '99': 'Bắc Ninh',
  '80': 'Cơ quan Trung ương'
};

export function parseLicensePlate(plate: string): PlateParseResult {
  const clean = String(plate || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (clean.length < 7 || clean.length > 9) {
    return { isValid: false, raw: plate };
  }

  const provCode = clean.slice(0, 2);
  const province = PLATE_PROVINCES[provCode];

  // Car pattern: 51K-123.45 (2 numbers, 1 letter, 5 numbers) or older 29A-1234
  const carMatch = clean.match(/^(\\d{2})([A-Z]{1,2})(\\d{4,5})$/);
  if (carMatch) {
    const [, prov, series, nums] = carMatch;
    const formattedNums = nums.length === 5 ? \`\${nums.slice(0, 3)}.\${nums.slice(3)}\` : nums;
    return {
      isValid: true,
      raw: plate,
      formatted: \`\${prov}\${series}-\${formattedNums}\`,
      provinceCode: prov,
      province,
      series,
      numbers: nums,
      vehicleType: 'car',
      plateColor: 'white'
    };
  }

  // Motorbike pattern: 59-P1 123.45 (2 numbers, 1 letter + 1 digit/letter, 4-5 numbers)
  const bikeMatch = clean.match(/^(\\d{2})([A-Z0-9]{2})(\\d{4,5})$/);
  if (bikeMatch) {
    const [, prov, series, nums] = bikeMatch;
    const formattedNums = nums.length === 5 ? \`\${nums.slice(0, 3)}.\${nums.slice(3)}\` : nums;
    return {
      isValid: true,
      raw: plate,
      formatted: \`\${prov}-\${series} \${formattedNums}\`,
      provinceCode: prov,
      province,
      series,
      numbers: nums,
      vehicleType: 'motorbike',
      plateColor: 'white'
    };
  }

  return { isValid: false, raw: plate };
}

export function formatLicensePlate(plate: string): string {
  const parsed = parseLicensePlate(plate);
  return parsed.formatted || plate;
}
`
  },
  {
    folder: '04-vn-currency-words',
    name: 'vn-currency-words',
    description: 'Convert numerical amounts to standardized Vietnamese words for banking, invoices, and legal contracts.',
    keywords: ['vietnam', 'currency', 'doc-so-thanh-chu', 'invoice', 'vnd', 'finance'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { numberToVietnameseWords } from 'vn-currency-words';

console.log(numberToVietnameseWords(1500000));
// "Một triệu năm trăm nghìn đồng"

console.log(numberToVietnameseWords('20500120', { suffix: 'đồng chẵn' }));
// "Hai mươi triệu năm trăm linh một nghìn một trăm hai mươi đồng chẵn"`,
    apiList: `- \`numberToVietnameseWords(amount: number | string, options?): string\``,
    code: `const DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const SCALES = ['', 'nghìn', 'triệu', 'tỷ'];

function readThreeDigits(threeDigits: string, isBeginning: boolean): string {
  const [h, t, u] = threeDigits.split('').map(Number);
  const words: string[] = [];

  if (h !== 0 || !isBeginning) {
    words.push(DIGITS[h], 'trăm');
  }

  if (t === 0) {
    if (u !== 0 && (h !== 0 || !isBeginning)) {
      words.push('linh');
    }
  } else if (t === 1) {
    words.push('mười');
  } else {
    words.push(DIGITS[t], 'mươi');
  }

  if (u === 1) {
    if (t > 1) words.push('mốt');
    else words.push(DIGITS[u]);
  } else if (u === 5) {
    if (t > 0) words.push('lăm');
    else words.push(DIGITS[u]);
  } else if (u > 0) {
    words.push(DIGITS[u]);
  }

  return words.join(' ');
}

export interface CurrencyWordsOptions {
  suffix?: string;
  capitalizeFirst?: boolean;
}

export function numberToVietnameseWords(
  amount: number | string,
  options: CurrencyWordsOptions = {}
): string {
  const { suffix = 'đồng', capitalizeFirst = true } = options;

  let numStr = String(amount).replace(/[^0-9]/g, '');
  if (!numStr || numStr === '0') {
    return 'Không ' + suffix;
  }

  // Remove leading zeros
  numStr = numStr.replace(/^0+/, '');
  if (!numStr) return 'Không ' + suffix;

  const chunks: string[] = [];
  while (numStr.length > 0) {
    chunks.unshift(numStr.slice(-3));
    numStr = numStr.slice(0, -3);
  }

  const resultWords: string[] = [];
  const totalChunks = chunks.length;

  for (let i = 0; i < totalChunks; i++) {
    const chunk = chunks[i].padStart(3, '0');
    if (chunk === '000') continue;

    const isFirst = i === 0;
    const chunkWords = readThreeDigits(chunk, isFirst);
    const scaleIndex = (totalChunks - 1 - i) % 4;
    const tyCount = Math.floor((totalChunks - 1 - i) / 4);

    let scale = SCALES[scaleIndex];
    if (tyCount > 0 && scaleIndex === 0) {
      scale = Array(tyCount).fill('tỷ').join(' ');
    }

    if (chunkWords) {
      resultWords.push(chunkWords + (scale ? ' ' + scale : ''));
    }
  }

  let finalStr = resultWords.join(' ').replace(/\\s+/g, ' ').trim();
  if (suffix) {
    finalStr += ' ' + suffix;
  }

  if (capitalizeFirst && finalStr.length > 0) {
    finalStr = finalStr.charAt(0).toUpperCase() + finalStr.slice(1);
  }

  return finalStr;
}
`
  },
  {
    folder: '05-vn-phone-carrier',
    name: 'vn-phone-carrier',
    description: 'Detect Vietnamese mobile network operators (Viettel, Vina, Mobi, Vietnamobile, Wintel, I-Telecom) and validate national phone numbers.',
    keywords: ['vietnam', 'phone', 'carrier', 'telecom', 'sms', 'otp'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { parseVNPhone, isVNPhoneValid } from 'vn-phone-carrier';

const phone = parseVNPhone('+84 981 234 567');
console.log(phone.carrier);      // "Viettel"
console.log(phone.formatE164);   // "+84981234567"
console.log(phone.formatNational);// "0981234567"`,
    apiList: `- \`parseVNPhone(phone: string): VNPhoneResult\`
- \`isVNPhoneValid(phone: string): boolean\`
- \`getCarrier(phone: string): string | undefined\``,
    code: `export interface VNPhoneResult {
  isValid: boolean;
  raw: string;
  formatNational?: string;
  formatE164?: string;
  carrier?: string;
  prefix?: string;
}

const CARRIER_PREFIXES: Record<string, string[]> = {
  Viettel: ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
  VinaPhone: ['088', '091', '094', '081', '082', '083', '084', '085'],
  MobiFone: ['089', '090', '093', '070', '079', '077', '076', '078'],
  Vietnamobile: ['092', '056', '058'],
  Wintel: ['055'],
  'I-Telecom': ['087'],
  Gmobile: ['099', '059']
};

export function parseVNPhone(phone: string): VNPhoneResult {
  const clean = String(phone || '').replace(/[^0-9+]/g, '');

  let national = clean;
  if (national.startsWith('+84')) {
    national = '0' + national.slice(3);
  } else if (national.startsWith('84') && national.length === 11) {
    national = '0' + national.slice(2);
  }

  if (!/^0\\d{9}$/.test(national)) {
    return { isValid: false, raw: phone };
  }

  const prefix = national.slice(0, 3);
  let detectedCarrier: string | undefined;

  for (const [carrier, prefixes] of Object.entries(CARRIER_PREFIXES)) {
    if (prefixes.includes(prefix)) {
      detectedCarrier = carrier;
      break;
    }
  }

  return {
    isValid: !!detectedCarrier,
    raw: phone,
    formatNational: national,
    formatE164: '+84' + national.slice(1),
    carrier: detectedCarrier,
    prefix
  };
}

export function isVNPhoneValid(phone: string): boolean {
  return parseVNPhone(phone).isValid;
}

export function getCarrier(phone: string): string | undefined {
  return parseVNPhone(phone).carrier;
}
`
  },
  {
    folder: '06-vn-bank-qr-gen',
    name: 'vn-bank-qr-gen',
    description: 'Ultra-lightweight generator for VietQR (NAPAS 247) EMVCo payment payloads and quick-link QR URLs.',
    keywords: ['vietqr', 'napas', 'banking', 'payment', 'emvco', 'vietnam'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { createVietQRText, getVietQRImageUrl } from 'vn-bank-qr-gen';

// Generate raw EMVCo payload string for QR scanner
const qrPayload = createVietQRText({
  bankBin: '970422', // MBBank
  accountNumber: '0981234567',
  amount: 50000,
  message: 'DH123 thanh toan'
});

// Or get immediate scanable QR image URL
const qrUrl = getVietQRImageUrl({
  bankBin: '970422',
  accountNumber: '0981234567',
  amount: 50000,
  message: 'DH123'
});`,
    apiList: `- \`createVietQRText(options: VietQROptions): string\`
- \`getVietQRImageUrl(options: VietQROptions): string\`
- \`crc16CCITT(data: string): string\``,
    code: `export interface VietQROptions {
  bankBin: string;
  accountNumber: string;
  amount?: number;
  message?: string;
  template?: 'compact' | 'qr_only' | 'print';
}

function tlv(tag: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return \`\${tag}\${len}\${value}\`;
}

export function crc16CCITT(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    const byte = data.charCodeAt(i);
    crc ^= byte << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function createVietQRText(options: VietQROptions): string {
  const { bankBin, accountNumber, amount, message } = options;

  // Merchant Account Info (Tag 38)
  const guid = tlv('00', 'A000000727');
  const beneficiaryInfo = tlv('00', bankBin) + tlv('01', accountNumber);
  const consumerAccountInfo = tlv('01', beneficiaryInfo);
  const serviceCode = tlv('02', 'QRIBFTTA');
  const tag38 = tlv('38', guid + consumerAccountInfo + serviceCode);

  let payload =
    tlv('00', '01') + // Format indicator
    tlv('01', '12') + // Point of initiation (12: dynamic, 11: static)
    tag38 +
    tlv('53', '704') + // Transaction Currency (VND)
    (amount ? tlv('54', String(Math.round(amount))) : '') +
    tlv('58', 'VN'); // Country code

  if (message) {
    const additionalInfo = tlv('08', message.slice(0, 25));
    payload += tlv('62', additionalInfo);
  }

  payload += '6304';
  const checksum = crc16CCITT(payload);
  return payload + checksum;
}

export function getVietQRImageUrl(options: VietQROptions): string {
  const { bankBin, accountNumber, amount, message, template = 'compact' } = options;
  const baseUrl = \`https://img.vietqr.io/image/\${bankBin}-\${accountNumber}-\${template}.png\`;
  const params = new URLSearchParams();
  if (amount) params.set('amount', String(Math.round(amount)));
  if (message) params.set('addInfo', message);
  const qs = params.toString();
  return qs ? \`\${baseUrl}?\${qs}\` : baseUrl;
}
`
  },
  {
    folder: '07-vn-slugify-plus',
    name: 'vn-slugify-plus',
    description: 'Transform Vietnamese text with diacritics into URL-friendly, SEO-optimized slugs. Cleanly handles đ/Đ, emojis, and symbols.',
    keywords: ['vietnam', 'slugify', 'seo', 'url', 'tieng-viet-khong-dau', 'slug'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { slugifyVN, removeVNAccents } from 'vn-slugify-plus';

console.log(slugifyVN('Đắc Nhân Tâm - Dale Carnegie 🚀'));
// "dac-nhan-tam-dale-carnegie"

console.log(removeVNAccents('Học Lập Trình Node.js & React'));
// "Hoc Lap Trinh Node.js & React"`,
    apiList: `- \`slugifyVN(text: string, options?): string\`
- \`removeVNAccents(text: string): string\``,
    code: `export interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
  preserveDots?: boolean;
}

export function removeVNAccents(text: string): string {
  if (!text) return '';
  return text
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[ÌÍỊỈĨ]/g, 'I')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[ỲÝỴỶỸ]/g, 'Y')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function slugifyVN(text: string, options: SlugifyOptions = {}): string {
  const { separator = '-', lowercase = true, preserveDots = false } = options;

  let str = removeVNAccents(text);
  if (lowercase) {
    str = str.toLowerCase();
  }

  // Remove non-word characters
  const pattern = preserveDots ? /[^a-zA-Z0-9.\\s-]/g : /[^a-zA-Z0-9\\s-]/g;
  str = str.replace(pattern, '');

  // Replace spaces and repeating dashes
  str = str.trim().replace(/\\s+/g, separator);
  const regexSep = new RegExp(\`\\\\\\\\\${separator}+\`, 'g');
  str = str.replace(regexSep, separator);

  return str;
}
`
  },
  {
    folder: '08-vn-address-parser',
    name: 'vn-address-parser',
    description: 'Heuristic parser to break down unstructured Vietnamese address strings into Province, District, Ward, and Street parts.',
    keywords: ['vietnam', 'address', 'parser', 'dia-chi', 'shipping', 'e-commerce'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { parseVNAddress } from 'vn-address-parser';

const address = parseVNAddress('Tầng 5, 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh');
console.log(address.province); // "TP. Hồ Chí Minh"
console.log(address.district); // "Quận 1"
console.log(address.ward);     // "Phường Bến Nghé"
console.log(address.street);   // "Tầng 5, 123 Nguyễn Huệ"`,
    apiList: `- \`parseVNAddress(rawAddress: string): ParsedVNAddress\``,
    code: `export interface ParsedVNAddress {
  raw: string;
  street: string;
  ward?: string;
  district?: string;
  province?: string;
}

export function parseVNAddress(rawAddress: string): ParsedVNAddress {
  const clean = String(rawAddress || '').trim();
  if (!clean) {
    return { raw: clean, street: '' };
  }

  const parts = clean.split(/[,\\n]+/).map((p) => p.trim()).filter(Boolean);

  if (parts.length >= 4) {
    const province = parts[parts.length - 1];
    const district = parts[parts.length - 2];
    const ward = parts[parts.length - 3];
    const street = parts.slice(0, parts.length - 3).join(', ');
    return { raw: clean, street, ward, district, province };
  }

  if (parts.length === 3) {
    const province = parts[2];
    const district = parts[1];
    const street = parts[0];
    return { raw: clean, street, district, province };
  }

  if (parts.length === 2) {
    const province = parts[1];
    const street = parts[0];
    return { raw: clean, street, province };
  }

  return { raw: clean, street: clean };
}
`
  },
  {
    folder: '09-vn-zalo-oa-helper',
    name: 'vn-zalo-oa-helper',
    description: 'Lightweight helper for Zalo Official Account (OA) and ZNS (Zalo Notification Service) payload formatting and signature verification.',
    keywords: ['zalo', 'zns', 'zalo-oa', 'webhook', 'vietnam', 'notification'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { buildZNSPayload, normalizeZaloPhone } from 'vn-zalo-oa-helper';

const phone = normalizeZaloPhone('0981234567'); // "84981234567"

const payload = buildZNSPayload({
  phone,
  templateId: '123456',
  templateData: {
    customer_name: 'Nguyễn Văn A',
    order_code: 'ORD-999'
  }
});`,
    apiList: `- \`buildZNSPayload(options): ZNSPayload\`
- \`normalizeZaloPhone(phone: string): string\`
- \`verifyZaloWebhookSignature(appId, data, mac, secret): boolean\``,
    code: `export interface ZNSOptions {
  phone: string;
  templateId: string;
  templateData: Record<string, any>;
  trackingId?: string;
  development?: boolean;
}

export function normalizeZaloPhone(phone: string): string {
  const clean = String(phone || '').replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    return '84' + clean.slice(1);
  }
  if (clean.startsWith('84')) {
    return clean;
  }
  return clean;
}

export function buildZNSPayload(options: ZNSOptions) {
  return {
    phone: normalizeZaloPhone(options.phone),
    template_id: options.templateId,
    template_data: options.templateData,
    tracking_id: options.trackingId,
    mode: options.development ? 'development' : undefined
  };
}
`
  },
  {
    folder: '10-vn-workday-calc',
    name: 'vn-workday-calc',
    description: 'Calculate working days in Vietnam excluding weekends and official public holidays (Tet, Hung Kings, National Day, etc.).',
    keywords: ['vietnam', 'workday', 'business-days', 'calendar', 'holidays', 'luat-lao-dong'],
    category: 'Việt Nam Localization & Business Logic',
    usageCode: `import { calculateWorkdays, isVNWorkday } from 'vn-workday-calc';

const days = calculateWorkdays('2026-04-28', '2026-05-04');
console.log(days); // Automatically skips weekends and 30/4 - 1/5!

console.log(isVNWorkday(new Date('2026-09-02'))); // false (Quoc khanh)`,
    apiList: `- \`calculateWorkdays(start, end, options?): number\`
- \`isVNWorkday(date, options?): boolean\`
- \`getVNHolidays(year: number): string[]\``,
    code: `export function getVNHolidays(year: number): string[] {
  // Fixed solar holidays in Vietnam
  return [
    \`\${year}-01-01\`, // Tết Dương lịch
    \`\${year}-04-30\`, // Ngày Giải phóng miền Nam
    \`\${year}-05-01\`, // Ngày Quốc tế Lao động
    \`\${year}-09-02\`, // Quốc khánh
    \`\${year}-09-03\`  // Ngày liền kề Quốc khánh
  ];
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export function isVNWorkday(date: Date | string): boolean {
  const d = new Date(date);
  if (isWeekend(d)) return false;

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const dateStr = \`\${yyyy}-\${mm}-\${dd}\`;

  const holidays = getVNHolidays(yyyy);
  return !holidays.includes(dateStr);
}

export function calculateWorkdays(startDate: Date | string, endDate: Date | string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) return 0;

  let count = 0;
  const cur = new Date(start);

  while (cur <= end) {
    if (isVNWorkday(cur)) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }

  return count;
}
`
  }
];
