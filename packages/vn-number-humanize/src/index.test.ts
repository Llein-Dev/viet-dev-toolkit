import { describe, it, expect } from 'vitest';
import { humanizeVNNumber, humanizeVNBytes } from './index';

describe('@llein/vn-number-humanize', () => {
  describe('humanizeVNNumber', () => {
    it('should format millions (triệu) in standard Vietnamese style', () => {
      expect(humanizeVNNumber(1500000)).toBe('1,5 triệu');
      expect(humanizeVNNumber(2000000)).toBe('2 triệu');
      expect(humanizeVNNumber(50000000)).toBe('50 triệu');
      expect(humanizeVNNumber(999000000)).toBe('999 triệu');
    });

    it('should format billions (tỷ) in standard Vietnamese style', () => {
      expect(humanizeVNNumber(1000000000)).toBe('1 tỷ');
      expect(humanizeVNNumber(2300000000)).toBe('2,3 tỷ');
      expect(humanizeVNNumber(15500000000)).toBe('15,5 tỷ');
    });

    it('should format thousands (nghìn) in standard Vietnamese style', () => {
      expect(humanizeVNNumber(1000)).toBe('1 nghìn');
      expect(humanizeVNNumber(15000)).toBe('15 nghìn');
      expect(humanizeVNNumber(12500)).toBe('12,5 nghìn');
    });

    it('should format huge BigInt values (nghìn tỷ, triệu tỷ)', () => {
      expect(humanizeVNNumber(1000000000000n)).toBe('1 nghìn tỷ');
      expect(humanizeVNNumber(1500000000000000n)).toBe('1,5 triệu tỷ');
    });

    it('should support short style (tr, tỷ, k)', () => {
      expect(humanizeVNNumber(1500000, { style: 'short' })).toBe('1.5tr');
      expect(humanizeVNNumber(2300000000, { style: 'short' })).toBe('2.3tỷ');
      expect(humanizeVNNumber(50000, { style: 'short' })).toBe('50k');
    });

    it('should support compact style (M, B, K)', () => {
      expect(humanizeVNNumber(1500000, { style: 'compact' })).toBe('1.5M');
      expect(humanizeVNNumber(2300000000, { style: 'compact' })).toBe('2.3B');
      expect(humanizeVNNumber(50000, { style: 'compact' })).toBe('50K');
    });

    it('should append currency symbols correctly', () => {
      expect(humanizeVNNumber(1500000, { currency: ' ₫' })).toBe('1,5 triệu ₫');
      expect(humanizeVNNumber(2000000000, { currency: ' VND' })).toBe('2 tỷ VND');
    });

    it('should handle negative numbers gracefully', () => {
      expect(humanizeVNNumber(-1500000)).toBe('-1,5 triệu');
      expect(humanizeVNNumber(-2300000000)).toBe('-2,3 tỷ');
    });

    it('should handle small numbers and edge cases', () => {
      expect(humanizeVNNumber(0)).toBe('0');
      expect(humanizeVNNumber(500)).toBe('500');
      expect(humanizeVNNumber(999)).toBe('999');
      expect(humanizeVNNumber('')).toBe('0');
      expect(humanizeVNNumber('invalid')).toBe('0');
    });
  });

  describe('humanizeVNBytes', () => {
    it('should format byte sizes in Vietnamese style with comma decimals', () => {
      expect(humanizeVNBytes(500)).toBe('500 B');
      expect(humanizeVNBytes(1000)).toBe('1 KB');
      expect(humanizeVNBytes(1500000)).toBe('1,5 MB');
      expect(humanizeVNBytes(1536000000)).toBe('1,54 GB');
    });

    it('should support binary units (KiB, MiB, GiB)', () => {
      expect(humanizeVNBytes(1024, { binary: true })).toBe('1 KiB');
      expect(humanizeVNBytes(1048576, { binary: true })).toBe('1 MiB');
      expect(humanizeVNBytes(1073741824, { binary: true })).toBe('1 GiB');
    });

    it('should respect custom precision and space settings', () => {
      expect(humanizeVNBytes(1536000000, { precision: 1 })).toBe('1,5 GB');
      expect(humanizeVNBytes(1536000000, { space: false })).toBe('1,54GB');
    });
  });
});
