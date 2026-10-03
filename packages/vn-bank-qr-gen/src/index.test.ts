import { describe, it, expect } from 'vitest';
import {
  generateVietQR,
  parseVietQR,
  findBank,
  crc16CCITT,
  VIETNAM_BANKS
} from './index';

describe('vn-bank-qr-gen', () => {
  it('should find bank by BIN or Code', () => {
    const mb = findBank('970422');
    expect(mb?.shortName).toBe('MBBank');

    const vcb = findBank('VCB');
    expect(vcb?.bin).toBe('970436');

    const tcb = findBank('Techcombank');
    expect(tcb?.code).toBe('TCB');
  });

  it('should generate valid dynamic VietQR payload and parse it back accurately', () => {
    const qrResult = generateVietQR({
      bank: 'MB',
      accountNumber: '0981234567',
      amount: 150000,
      message: 'DH999'
    });

    expect(qrResult.qrContent).toBeDefined();
    expect(qrResult.qrContent.startsWith('000201010212')).toBe(true); // Tag 01 = 12 (Dynamic)
    expect(qrResult.qrImageUrl).toContain('img.vietqr.io');

    // Parse the generated QR content back
    const parsed = parseVietQR(qrResult.qrContent);
    expect(parsed.isValid).toBe(true);
    expect(parsed.crcValid).toBe(true);
    expect(parsed.bankBin).toBe('970422');
    expect(parsed.bank?.shortName).toBe('MBBank');
    expect(parsed.accountNumber).toBe('0981234567');
    expect(parsed.amount).toBe(150000);
    expect(parsed.message).toBe('DH999');
  });

  it('should generate valid static VietQR (no amount)', () => {
    const qrResult = generateVietQR({
      bank: '970436', // Vietcombank
      accountNumber: '1012345678'
    });

    expect(qrResult.qrContent).toBeDefined();
    expect(qrResult.qrContent.startsWith('000201010211')).toBe(true); // Tag 01 = 11 (Static)

    const parsed = parseVietQR(qrResult.qrContent);
    expect(parsed.isValid).toBe(true);
    expect(parsed.crcValid).toBe(true);
    expect(parsed.amount).toBeUndefined();
  });

  it('should detect checksum tampering when QR payload is modified', () => {
    const qrResult = generateVietQR({
      bank: 'TCB',
      accountNumber: '1903333333',
      amount: 50000
    });

    // Tamper with account number inside string
    const tampered = qrResult.qrContent.replace('1903333333', '1909999999');
    const parsed = parseVietQR(tampered);

    expect(parsed.crcValid).toBe(false); // Checksum must fail!
  });

  it('should throw error for unknown bank', () => {
    expect(() => {
      generateVietQR({
        bank: 'INVALID_BANK_CODE',
        accountNumber: '123'
      });
    }).toThrow('Bank not found');
  });
});
