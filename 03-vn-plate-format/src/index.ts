export interface PlateParseResult {
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
  const carMatch = clean.match(/^(\d{2})([A-Z]{1,2})(\d{4,5})$/);
  if (carMatch) {
    const [, prov, series, nums] = carMatch;
    const formattedNums = nums.length === 5 ? `${nums.slice(0, 3)}.${nums.slice(3)}` : nums;
    return {
      isValid: true,
      raw: plate,
      formatted: `${prov}${series}-${formattedNums}`,
      provinceCode: prov,
      province,
      series,
      numbers: nums,
      vehicleType: 'car',
      plateColor: 'white'
    };
  }

  // Motorbike pattern: 59-P1 123.45 (2 numbers, 1 letter + 1 digit/letter, 4-5 numbers)
  const bikeMatch = clean.match(/^(\d{2})([A-Z0-9]{2})(\d{4,5})$/);
  if (bikeMatch) {
    const [, prov, series, nums] = bikeMatch;
    const formattedNums = nums.length === 5 ? `${nums.slice(0, 3)}.${nums.slice(3)}` : nums;
    return {
      isValid: true,
      raw: plate,
      formatted: `${prov}-${series} ${formattedNums}`,
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
