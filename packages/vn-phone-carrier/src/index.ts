export interface VNPhoneResult {
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

  if (!/^0\d{9}$/.test(national)) {
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
