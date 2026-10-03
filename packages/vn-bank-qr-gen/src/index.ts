/**
 * vn-bank-qr-gen
 * Comprehensive VietQR (NAPAS 247) EMVCo Payload Generator & Parser
 * Zero-dependency, 100% TypeScript, Dual ESM/CJS
 */

export interface BankInfo {
  bin: string;
  code: string;
  shortName: string;
  name: string;
  swiftCode?: string;
  supportNapas247: boolean;
}

export interface VietQROptions {
  bank: string; // BIN (e.g. '970422') or Code (e.g. 'MB', 'VCB', 'TCB', 'vietin', 'agri')
  accountNumber: string;
  accountName?: string; // Beneficiary name (Tag 59 in EMVCo)
  amount?: number;
  message?: string;
  serviceType?: 'by_account' | 'by_card';
  template?: 'compact' | 'qr_only' | 'print';
}

export interface VietQRResult {
  qrContent: string;
  qrImageUrl: string;
  bank: BankInfo;
  accountNumber: string;
  accountName?: string;
  amount?: number;
  message?: string;
}

export interface ParsedVietQR {
  isValid: boolean;
  crcValid: boolean;
  raw: string;
  bankBin?: string;
  bank?: BankInfo;
  accountNumber?: string;
  accountName?: string;
  amount?: number;
  message?: string;
  serviceCode?: string;
  error?: string;
}

// 54 Official Vietnamese Banks (State Bank of Vietnam & NAPAS Directory)
export const VIETNAM_BANKS: BankInfo[] = [
  { bin: '970422', code: 'MB', shortName: 'MBBank', name: 'Ngân hàng Quân đội', supportNapas247: true },
  { bin: '970436', code: 'VCB', shortName: 'Vietcombank', name: 'Ngân hàng TMCP Ngoại thương Việt Nam', supportNapas247: true },
  { bin: '970415', code: 'CTG', shortName: 'VietinBank', name: 'Ngân hàng TMCP Công thương Việt Nam', supportNapas247: true },
  { bin: '970418', code: 'BIDV', shortName: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', supportNapas247: true },
  { bin: '970407', code: 'TCB', shortName: 'Techcombank', name: 'Ngân hàng TMCP Kỹ thương Việt Nam', supportNapas247: true },
  { bin: '970432', code: 'VPB', shortName: 'VPBank', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', supportNapas247: true },
  { bin: '970416', code: 'ACB', shortName: 'ACB', name: 'Ngân hàng TMCP Á Châu', supportNapas247: true },
  { bin: '970423', code: 'TPB', shortName: 'TPBank', name: 'Ngân hàng TMCP Tiên Phong', supportNapas247: true },
  { bin: '970403', code: 'STB', shortName: 'Sacombank', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', supportNapas247: true },
  { bin: '970437', code: 'HDB', shortName: 'HDBank', name: 'Ngân hàng TMCP Phát triển TP.HCM', supportNapas247: true },
  { bin: '970441', code: 'VIB', shortName: 'VIB', name: 'Ngân hàng TMCP Quốc tế Việt Nam', supportNapas247: true },
  { bin: '970443', code: 'SHB', shortName: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội', supportNapas247: true },
  { bin: '970426', code: 'MSB', shortName: 'MSB', name: 'Ngân hàng TMCP Hàng hải Việt Nam', supportNapas247: true },
  { bin: '970448', code: 'OCB', shortName: 'OCB', name: 'Ngân hàng TMCP Phương Đông', supportNapas247: true },
  { bin: '970440', code: 'SEAB', shortName: 'SeABank', name: 'Ngân hàng TMCP Đông Nam Á', supportNapas247: true },
  { bin: '970449', code: 'LPB', shortName: 'LPBank', name: 'Ngân hàng TMCP Lộc Phát Việt Nam', supportNapas247: true },
  { bin: '970428', code: 'NAB', shortName: 'NamABank', name: 'Ngân hàng TMCP Nam Á', supportNapas247: true },
  { bin: '970409', code: 'BAB', shortName: 'BacABank', name: 'Ngân hàng TMCP Bắc Á', supportNapas247: true },
  { bin: '970454', code: 'BVB', shortName: 'BVBank', name: 'Ngân hàng TMCP Bản Việt', supportNapas247: true },
  { bin: '970438', code: 'BaoViet', shortName: 'BaoVietBank', name: 'Ngân hàng TMCP Bảo Việt', supportNapas247: true },
  { bin: '970452', code: 'KLB', shortName: 'Kienlongbank', name: 'Ngân hàng TMCP Kiên Long', supportNapas247: true },
  { bin: '970400', code: 'SGB', shortName: 'Saigonbank', name: 'Ngân hàng TMCP Sài Gòn Công thương', supportNapas247: true },
  { bin: '970430', code: 'PGB', shortName: 'PGBank', name: 'Ngân hàng TMCP Thịnh vượng và Phát triển', supportNapas247: true },
  { bin: '970405', code: 'VBA', shortName: 'Agribank', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam', supportNapas247: true },
  { bin: '970414', code: 'OceanBank', shortName: 'OceanBank', name: 'Ngân hàng Thương mại TNHH MTV Đại Dương', supportNapas247: true },
  { bin: '970408', code: 'GPB', shortName: 'GPBank', name: 'Ngân hàng Thương mại TNHH MTV Dầu khí Toàn Cầu', supportNapas247: true },
  { bin: '970444', code: 'CBB', shortName: 'CBBank', name: 'Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam', supportNapas247: true },
  { bin: '970412', code: 'PVcomBank', shortName: 'PVcomBank', name: 'Ngân hàng TMCP Đại chúng Việt Nam', supportNapas247: true },
  { bin: '970406', code: 'DongABank', shortName: 'DongABank', name: 'Ngân hàng TMCP Đông Á', supportNapas247: true },
  { bin: '970433', code: 'VIETBANK', shortName: 'VietBank', name: 'Ngân hàng TMCP Việt Nam Thương Tín', supportNapas247: true },
  { bin: '970425', code: 'ABB', shortName: 'ABBank', name: 'Ngân hàng TMCP An Bình', supportNapas247: true },
  { bin: '970439', code: 'PBVN', shortName: 'PublicBank', name: 'Ngân hàng TNHH MTV Public Việt Nam', supportNapas247: true },
  { bin: '970442', code: 'HLBVN', shortName: 'HongLeong', name: 'Ngân hàng TNHH MTV Hong Leong Việt Nam', supportNapas247: true },
  { bin: '422589', code: 'CIMB', shortName: 'CIMB', name: 'Ngân hàng TNHH MTV CIMB Việt Nam', supportNapas247: true },
  { bin: '970458', code: 'UOB', shortName: 'UOB', name: 'Ngân hàng TNHH MTV United Overseas Bank Việt Nam', supportNapas247: true },
  { bin: '970410', code: 'SCVN', shortName: 'StandardChartered', name: 'Ngân hàng TNHH MTV Standard Chartered Việt Nam', supportNapas247: true },
  { bin: '458761', code: 'HSBC', shortName: 'HSBC', name: 'Ngân hàng TNHH MTV HSBC Việt Nam', supportNapas247: true },
  { bin: '970434', code: 'IVB', shortName: 'IndovinaBank', name: 'Ngân hàng TNHH Indovina', supportNapas247: true },
  { bin: '970421', code: 'VRB', shortName: 'VRB', name: 'Ngân hàng Liên doanh Việt - Nga', supportNapas247: true },
  { bin: '970446', code: 'COOPBANK', shortName: 'Co-opBank', name: 'Ngân hàng Hợp tác xã Việt Nam', supportNapas247: true },
  { bin: '970424', code: 'SHBVN', shortName: 'ShinhanBank', name: 'Ngân hàng TNHH MTV Shinhan Việt Nam', supportNapas247: true },
  { bin: '970457', code: 'Wooribank', shortName: 'WooriBank', name: 'Ngân hàng TNHH MTV Woori Việt Nam', supportNapas247: true },
  { bin: '963388', code: 'Timo', shortName: 'Timo', name: 'Ngân hàng số Timo by BVBank', supportNapas247: true },
  { bin: '546034', code: 'Cake', shortName: 'Cake', name: 'Ngân hàng số Cake by VPBank', supportNapas247: true },
  { bin: '971005', code: 'ViettelMoney', shortName: 'ViettelMoney', name: 'Tổng Công ty Dịch vụ Số Viettel', supportNapas247: true },
  { bin: '971011', code: 'VNPTMoney', shortName: 'VNPTMoney', name: 'Tập đoàn Bưu chính Viễn thông Việt Nam', supportNapas247: true }
];

/**
 * Find a bank by BIN, Code, Short name, or partial keyword
 */
export function findBank(keyword: string): BankInfo | undefined {
  if (!keyword) return undefined;
  const clean = keyword.trim().toUpperCase();

  // 1. Exact match on BIN, Code, or ShortName
  const exact = VIETNAM_BANKS.find(
    (b) =>
      b.bin === clean ||
      b.code.toUpperCase() === clean ||
      b.shortName.toUpperCase() === clean
  );
  if (exact) return exact;

  // 2. Partial match on shortName, code, or name
  return VIETNAM_BANKS.find(
    (b) =>
      b.shortName.toUpperCase().includes(clean) ||
      b.code.toUpperCase().includes(clean) ||
      b.name.toUpperCase().includes(clean)
  );
}

/**
 * Calculates CRC16-CCITT checksum (Polynomial 0x1021, Initial 0xFFFF)
 */
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

function tlv(tag: string, value: string): string {
  const len = String(value.length).padStart(2, '0');
  return `${tag}${len}${value}`;
}

/**
 * Generate VietQR NAPAS 247 payload string and direct image URL
 */
export function generateVietQR(options: VietQROptions): VietQRResult {
  const {
    bank: bankQuery,
    accountNumber,
    accountName,
    amount,
    message,
    serviceType = 'by_account',
    template = 'compact'
  } = options;

  const bank = findBank(bankQuery);
  if (!bank) {
    throw new Error(`Bank not found for query: "${bankQuery}". Use a valid BIN or Bank Code (e.g. 'MB', 'VCB', 'TCB').`);
  }

  const cleanAcc = String(accountNumber || '').trim();
  if (!cleanAcc) {
    throw new Error('Account number is required');
  }

  // 1. Merchant Account Information (Tag 38)
  const guid = tlv('00', 'A000000727');
  const beneficiaryInfo = tlv('00', bank.bin) + tlv('01', cleanAcc);
  const consumerAccountInfo = tlv('01', beneficiaryInfo);
  const serviceCode = tlv('02', serviceType === 'by_account' ? 'QRIBFTTA' : 'QRIBFTTC');
  const tag38 = tlv('38', guid + consumerAccountInfo + serviceCode);

  // 2. Base payload
  const initiationMethod = amount && amount > 0 ? '12' : '11'; // 11: Static, 12: Dynamic
  let payload =
    tlv('00', '01') + // Format indicator
    tlv('01', initiationMethod) + // Point of initiation
    tag38 +
    tlv('53', '704') + // Transaction Currency (VND)
    (amount && amount > 0 ? tlv('54', String(Math.round(amount))) : '') +
    tlv('58', 'VN'); // Country code

  // 3. Optional Beneficiary Name (Tag 59)
  if (accountName && accountName.trim()) {
    const cleanName = accountName.trim().toUpperCase().slice(0, 25);
    payload += tlv('59', cleanName);
  }

  // 4. Additional Data (Tag 62)
  if (message) {
    const cleanMsg = message.slice(0, 25);
    const sub08 = tlv('08', cleanMsg);
    payload += tlv('62', sub08);
  }

  // 5. Append Tag 63 (CRC16)
  payload += '6304';
  const checksum = crc16CCITT(payload);
  const qrContent = payload + checksum;

  // 6. Image URL (VietQR CDN)
  const baseUrl = `https://img.vietqr.io/image/${bank.bin}-${cleanAcc}-${template}.png`;
  const params = new URLSearchParams();
  if (amount && amount > 0) params.set('amount', String(Math.round(amount)));
  if (message) params.set('addInfo', message);
  if (accountName) params.set('accountName', accountName.trim());
  const qs = params.toString();
  const qrImageUrl = qs ? `${baseUrl}?${qs}` : baseUrl;

  return {
    qrContent,
    qrImageUrl,
    bank,
    accountNumber: cleanAcc,
    accountName: accountName ? accountName.trim() : undefined,
    amount,
    message
  };
}

/**
 * Parse an EMVCo VietQR string and extract payment details
 */
export function parseVietQR(qrString: string): ParsedVietQR {
  const clean = String(qrString || '').trim();
  if (clean.length < 20) {
    return { isValid: false, crcValid: false, raw: clean, error: 'String too short to be a valid QR payload' };
  }

  // Check CRC16 (last 4 characters preceded by Tag 6304)
  const crcIndex = clean.lastIndexOf('6304');
  let crcValid = false;
  if (crcIndex !== -1 && crcIndex + 8 === clean.length) {
    const dataWithoutCrc = clean.slice(0, crcIndex + 4);
    const expectedCrc = clean.slice(crcIndex + 4).toUpperCase();
    const calculatedCrc = crc16CCITT(dataWithoutCrc);
    crcValid = expectedCrc === calculatedCrc;
  }

  let bankBin: string | undefined;
  let accountNumber: string | undefined;
  let accountName: string | undefined;
  let amount: number | undefined;
  let message: string | undefined;
  let serviceCode: string | undefined;

  let pos = 0;
  while (pos < clean.length - 4) {
    const tag = clean.slice(pos, pos + 2);
    const len = parseInt(clean.slice(pos + 2, pos + 4), 10);
    if (isNaN(len)) break;

    const val = clean.slice(pos + 4, pos + 4 + len);
    pos += 4 + len;

    if (tag === '38') {
      // Parse Nested Tag 38
      let innerPos = 0;
      while (innerPos < val.length) {
        const inTag = val.slice(innerPos, innerPos + 2);
        const inLen = parseInt(val.slice(innerPos + 2, innerPos + 4), 10);
        if (isNaN(inLen)) break;

        const inVal = val.slice(innerPos + 4, innerPos + 4 + inLen);
        innerPos += 4 + inLen;

        if (inTag === '01') {
          // Beneficiary info: Tag 00 = BIN, Tag 01 = Acc
          let bPos = 0;
          while (bPos < inVal.length) {
            const bTag = inVal.slice(bPos, bPos + 2);
            const bLen = parseInt(inVal.slice(bPos + 2, bPos + 4), 10);
            if (isNaN(bLen)) break;
            const bVal = inVal.slice(bPos + 4, bPos + 4 + bLen);
            bPos += 4 + bLen;

            if (bTag === '00') bankBin = bVal;
            if (bTag === '01') accountNumber = bVal;
          }
        }
        if (inTag === '02') serviceCode = inVal;
      }
    } else if (tag === '54') {
      amount = parseFloat(val);
    } else if (tag === '59') {
      accountName = val;
    } else if (tag === '62') {
      // Parse Nested Tag 62 (Additional Data)
      let innerPos = 0;
      while (innerPos < val.length) {
        const inTag = val.slice(innerPos, innerPos + 2);
        const inLen = parseInt(val.slice(innerPos + 2, innerPos + 4), 10);
        if (isNaN(inLen)) break;
        const inVal = val.slice(innerPos + 4, innerPos + 4 + inLen);
        innerPos += 4 + inLen;
        if (inTag === '08') message = inVal;
      }
    }
  }

  const bank = bankBin ? findBank(bankBin) : undefined;
  const isValid = !!(bankBin && accountNumber);

  return {
    isValid,
    crcValid,
    raw: clean,
    bankBin,
    bank,
    accountNumber,
    accountName,
    amount,
    message,
    serviceCode
  };
}
