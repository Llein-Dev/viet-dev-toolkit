import { describe, it, expect } from 'vitest';
import { numberToWords, formatVND, docSoThanhChu } from './index';

describe('vn-currency-words', () => {
  it('should convert 0 to "Không đồng"', () => {
    expect(numberToWords(0)).toBe('Không đồng');
    expect(numberToWords('0')).toBe('Không đồng');
  });

  it('should convert 15 to "Mười lăm đồng" and 25 to "Hai mươi lăm đồng"', () => {
    expect(numberToWords(15)).toBe('Mười lăm đồng');
    expect(numberToWords(25)).toBe('Hai mươi lăm đồng');
  });

  it('should convert 21 to "Hai mươi mốt đồng" (mốt rule)', () => {
    expect(numberToWords(21)).toBe('Hai mươi mốt đồng');
    expect(numberToWords(101)).toBe('Một trăm linh một đồng');
  });

  it('should convert 24 to "Hai mươi tư đồng" by default', () => {
    expect(numberToWords(24)).toBe('Hai mươi tư đồng');
    expect(numberToWords(24, { useTuInsteadOfBon: false })).toBe('Hai mươi bốn đồng');
  });

  it('should handle North vs South dialects accurately', () => {
    // North: nghìn, linh
    const north = numberToWords(101000, { dialect: 'north' });
    expect(north).toBe('Một trăm linh một nghìn đồng');

    // South: ngàn, lẻ
    const south = numberToWords(101000, { dialect: 'south' });
    expect(south).toBe('Một trăm lẻ một ngàn đồng');
  });

  it('should convert 1.500.000 to "Một triệu năm trăm nghìn đồng"', () => {
    expect(numberToWords(1500000)).toBe('Một triệu năm trăm nghìn đồng');
    expect(numberToWords(1500000, { suffix: 'đồng chẵn' })).toBe('Một triệu năm trăm nghìn đồng chẵn');
  });

  it('should handle large amounts in billions and trillions', () => {
    expect(numberToWords(1000000000)).toBe('Một tỷ đồng');
    expect(numberToWords('1000000000000')).toBe('Một nghìn tỷ đồng');
    expect(numberToWords('1000000000000', { dialect: 'south' })).toBe('Một ngàn tỷ đồng');
  });

  it('should handle negative numbers', () => {
    expect(numberToWords(-50000)).toBe('Âm năm mươi nghìn đồng');
  });

  it('should format VND with dots and currency symbol', () => {
    expect(formatVND(1500000)).toBe('1.500.000 ₫');
    expect(formatVND(-50000)).toBe('-50.000 ₫');
    expect(formatVND(0)).toBe('0 ₫');
  });

  it('should support alias docSoThanhChu', () => {
    expect(docSoThanhChu(2000000)).toBe('Hai triệu đồng');
  });
});
