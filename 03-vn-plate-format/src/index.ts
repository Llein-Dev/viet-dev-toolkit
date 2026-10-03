/**
 * @llein/vn-plate-format
 * Comprehensive Vietnam vehicle license plate parser, formatter, and classifier
 * According to Circular 24/2023/TT-BCA and Circular 58/2020/TT-BCA
 * Zero-dependency, 100% TypeScript, Dual ESM/CJS
 */

export type VehicleType =
  | 'car'
  | 'motorbike'
  | 'electric_motorbike'
  | 'military'
  | 'diplomatic'
  | 'trailer'
  | 'tractor';

export type PlateColor = 'white' | 'yellow' | 'blue' | 'red';

export interface PlateParseResult {
  isValid: boolean;
  raw: string;
  formatted?: string;
  compact?: string; // e.g. "51K99999"
  provinceCode?: string;
  province?: string;
  series?: string;
  numbers?: string;
  vehicleType?: VehicleType;
  plateColor?: PlateColor;
  isFiveDigits?: boolean;
  error?: string;
}

// 63 Provinces & Central Agencies mapping according to Circular 24/2023
export const PROVINCE_PLATE_MAP: Record<string, string> = {
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
  '29': 'Thành phố Hà Nội',
  '30': 'Thành phố Hà Nội',
  '31': 'Thành phố Hà Nội',
  '32': 'Thành phố Hà Nội',
  '33': 'Thành phố Hà Nội',
  '40': 'Thành phố Hà Nội',
  '34': 'Hải Dương',
  '35': 'Ninh Bình',
  '36': 'Thanh Hóa',
  '37': 'Nghệ An',
  '38': 'Hà Tĩnh',
  '43': 'Thành phố Đà Nẵng',
  '47': 'Đắk Lắk',
  '48': 'Đắk Nông',
  '49': 'Lâm Đồng',
  '50': 'Thành phố Hồ Chí Minh',
  '51': 'Thành phố Hồ Chí Minh',
  '52': 'Thành phố Hồ Chí Minh',
  '53': 'Thành phố Hồ Chí Minh',
  '54': 'Thành phố Hồ Chí Minh',
  '55': 'Thành phố Hồ Chí Minh',
  '56': 'Thành phố Hồ Chí Minh',
  '57': 'Thành phố Hồ Chí Minh',
  '58': 'Thành phố Hồ Chí Minh',
  '59': 'Thành phố Hồ Chí Minh',
  '60': 'Đồng Nai',
  '61': 'Bình Dương',
  '62': 'Long An',
  '63': 'Tiền Giang',
  '64': 'Vĩnh Long',
  '65': 'Thành phố Cần Thơ',
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

// Military symbols (Red plates)
const MILITARY_PREFIXES: Record<string, string> = {
  TM: 'Bộ Tổng tham mưu',
  TC: 'Tổng cục Chính trị',
  TH: 'Tổng cục Hậu cần',
  TK: 'Tổng cục Kỹ thuật',
  TT: 'Tổng cục Tình báo',
  CN: 'Tổng cục Công nghiệp quốc phòng',
  QA: 'Quân đoàn 1',
  QB: 'Quân đoàn 2',
  QC: 'Quân chủng Hải quân',
  QP: 'Quân chủng PK-KQ',
  HA: 'Học viện Quốc phòng',
  HB: 'Học viện Lục quân',
  HC: 'Học viện Chính trị'
};

/**
 * Parse and validate a Vietnamese vehicle license plate string
 */
export function parseLicensePlate(plate: string): PlateParseResult {
  const clean = String(plate || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');

  if (clean.length < 6 || clean.length > 10) {
    return { isValid: false, raw: plate, error: 'Độ dài ký tự biển số không hợp lệ' };
  }

  // 1. Check Red Military plate: e.g. TM-12-34
  const milMatch = clean.match(/^([A-Z]{2})(\d{4,5})$/);
  if (milMatch && MILITARY_PREFIXES[milMatch[1]]) {
    const [, prefix, nums] = milMatch;
    return {
      isValid: true,
      raw: plate,
      formatted: `${prefix}-${nums.slice(0, 2)}-${nums.slice(2)}`,
      compact: clean,
      province: MILITARY_PREFIXES[prefix],
      series: prefix,
      numbers: nums,
      vehicleType: 'military',
      plateColor: 'red',
      isFiveDigits: nums.length === 5
    };
  }

  // 2. Check Diplomatic / Foreign plate: e.g. 80-NG-123-45
  const dipMatch = clean.match(/^(\d{2})(NG|QT|NN)(\d{4,5})$/);
  if (dipMatch) {
    const [, prov, code, nums] = dipMatch;
    return {
      isValid: true,
      raw: plate,
      formatted: `${prov}-${code}-${nums}`,
      compact: clean,
      provinceCode: prov,
      province: PROVINCE_PLATE_MAP[prov] || 'Cơ quan Ngoại giao',
      series: code,
      numbers: nums,
      vehicleType: 'diplomatic',
      plateColor: 'white',
      isFiveDigits: nums.length === 5
    };
  }

  // 3. Normal civilian plates: Starts with 2 province digits
  const provCode = clean.slice(0, 2);
  const province = PROVINCE_PLATE_MAP[provCode];
  if (!province) {
    return { isValid: false, raw: plate, error: `Mã tỉnh thành "${provCode}" không hợp lệ` };
  }

  // Check Electric motorbike: e.g. 29-MD1 123.45 (clean: 29MD112345)
  const eleMatch = clean.match(/^(\d{2})(MD\d?|MĐ\d?)(\d{4,5})$/);
  if (eleMatch) {
    const [, prov, series, nums] = eleMatch;
    const formattedNums = nums.length === 5 ? `${nums.slice(0, 3)}.${nums.slice(3)}` : nums;
    return {
      isValid: true,
      raw: plate,
      formatted: `${prov}-${series} ${formattedNums}`,
      compact: clean,
      provinceCode: prov,
      province,
      series,
      numbers: nums,
      vehicleType: 'electric_motorbike',
      plateColor: 'white',
      isFiveDigits: nums.length === 5
    };
  }

  // Check Car plates: 29A-123.45, 51K-999.99, 30G-1234 (1 letter or 2 letters like LD, DA, R)
  // Car series: A, B, C, D, E, F, G, H, K, L, M, N, P, S, T, U, V, X, Y, Z or 2 letters LD, KT, DA
  const carMatch = clean.match(/^(\d{2})([A-Z]{1,2})(\d{4,5})$/);
  if (carMatch) {
    const [, prov, series, nums] = carMatch;
    const formattedNums = nums.length === 5 ? `${nums.slice(0, 3)}.${nums.slice(3)}` : nums;
    const isCommercial = series.endsWith('E') || series === 'LD';

    return {
      isValid: true,
      raw: plate,
      formatted: `${prov}${series}-${formattedNums}`,
      compact: clean,
      provinceCode: prov,
      province,
      series,
      numbers: nums,
      vehicleType: series === 'R' ? 'trailer' : 'car',
      plateColor: isCommercial ? 'yellow' : prov === '80' ? 'blue' : 'white',
      isFiveDigits: nums.length === 5
    };
  }

  // Check Motorbike plates: 59-P1 123.45 (clean: 59P112345), 29-B1 999.99
  const bikeMatch = clean.match(/^(\d{2})([A-Z0-9]{2})(\d{4,5})$/);
  if (bikeMatch) {
    const [, prov, series, nums] = bikeMatch;
    const formattedNums = nums.length === 5 ? `${nums.slice(0, 3)}.${nums.slice(3)}` : nums;

    return {
      isValid: true,
      raw: plate,
      formatted: `${prov}-${series} ${formattedNums}`,
      compact: clean,
      provinceCode: prov,
      province,
      series,
      numbers: nums,
      vehicleType: 'motorbike',
      plateColor: prov === '80' ? 'blue' : 'white',
      isFiveDigits: nums.length === 5
    };
  }

  return { isValid: false, raw: plate, error: 'Cấu trúc biển số không khớp chuẩn Bộ Công An' };
}

/**
 * Quick boolean validator for license plate
 */
export function isValidLicensePlate(plate: string): boolean {
  return parseLicensePlate(plate).isValid;
}

/**
 * Standardize license plate string into clean display format (e.g. "51k99999" -> "51K-999.99")
 */
export function formatLicensePlate(plate: string): string {
  const res = parseLicensePlate(plate);
  return res.formatted || plate.toUpperCase();
}

/**
 * Get province name from 2-digit plate code
 */
export function getPlateProvince(plateCode: string): string | undefined {
  return PROVINCE_PLATE_MAP[plateCode];
}
