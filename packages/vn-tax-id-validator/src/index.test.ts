import { describe, it, expect } from 'vitest';
import {
  validateTaxId,
  isValidTaxId,
  formatTaxId,
  isEnterpriseTaxId,
  isBranchTaxId,
  generateMockTaxId,
  calculateTaxChecksum
} from './index';

describe('vn-tax-id-validator', () => {
  describe('Valid Enterprise Tax IDs (10 digits)', () => {
    it('should validate Vinamilk MST: 0300588569', () => {
      const res = validateTaxId('0300588569');
      expect(res.isValid).toBe(true);
      expect(res.type).toBe('enterprise');
      expect(res.provinceName).toBe('Thành phố Hồ Chí Minh');
      expect(res.checkDigit).toBe(9);
      expect(res.formatted).toBe('0300588569');
    });

    it('should validate Viettel Group MST: 0100109106', () => {
      const res = validateTaxId('0100109106');
      expect(res.isValid).toBe(true);
      expect(res.type).toBe('enterprise');
      expect(res.provinceName).toBe('Thành phố Hà Nội');
      expect(res.checkDigit).toBe(6);
    });

    it('should validate Vingroup MST: 0101245486', () => {
      const res = validateTaxId('0101245486');
      expect(res.isValid).toBe(true);
      expect(res.type).toBe('enterprise');
      expect(res.checkDigit).toBe(6);
    });

    it('should validate FPT Corporation MST: 0101248141', () => {
      const res = validateTaxId('0101248141');
      expect(res.isValid).toBe(true);
      expect(res.type).toBe('enterprise');
      expect(res.checkDigit).toBe(1);
    });
  });

  describe('Valid Branch Tax IDs (13 digits)', () => {
    it('should validate hyphenated 13-digit branch MST: 0100109106-001', () => {
      const res = validateTaxId('0100109106-001');
      expect(res.isValid).toBe(true);
      expect(res.type).toBe('branch');
      expect(res.baseTaxId).toBe('0100109106');
      expect(res.branchCode).toBe('001');
      expect(res.formatted).toBe('0100109106-001');
      expect(isBranchTaxId('0100109106-001')).toBe(true);
      expect(isEnterpriseTaxId('0100109106-001')).toBe(false);
    });

    it('should validate unhyphenated 13-digit MST and auto-format with hyphen', () => {
      const res = validateTaxId('0100109106001');
      expect(res.isValid).toBe(true);
      expect(res.type).toBe('branch');
      expect(res.formatted).toBe('0100109106-001');
    });
  });

  describe('12-digit CCCD Personal Tax Code', () => {
    it('should validate 12-digit personal identity number', () => {
      const res = validateTaxId('001095012345');
      expect(res.isValid).toBe(true);
      expect(res.type).toBe('personal_cccd');
      expect(res.formatted).toBe('001095012345');
    });

    it('should reject invalid CCCD province codes', () => {
      expect(isValidTaxId('000000000000')).toBe(false);
      expect(isValidTaxId('999095012345')).toBe(false);
    });
  });

  describe('Invalid Tax IDs', () => {
    it('should reject incorrect checksum digit', () => {
      // Correct for Viettel is 6, testing with 7
      const res = validateTaxId('0100109107');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('Invalid Modulo-11 checksum');
    });

    it('should reject unknown province codes', () => {
      // 99 is not a registered tax province code in Vietnam
      const res = validateTaxId('9900109106');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('Invalid tax province code');
    });

    it('should reject non-numeric characters', () => {
      const res = validateTaxId('010010910A');
      expect(res.isValid).toBe(false);
    });

    it('should reject invalid lengths', () => {
      expect(isValidTaxId('12345')).toBe(false);
      expect(isValidTaxId('0100109106123456')).toBe(false);
    });

    it('should reject empty or null inputs', () => {
      expect(isValidTaxId('')).toBe(false);
      expect(validateTaxId(null as unknown as string).isValid).toBe(false);
    });
  });

  describe('Helper & Utility functions', () => {
    it('should calculate Modulo-11 checksum directly', () => {
      // Viettel: first 9 digits '010010910' -> check digit 6
      expect(calculateTaxChecksum('010010910')).toBe(6);
      // FPT: first 9 digits '010124814' -> check digit 1
      expect(calculateTaxChecksum('010124814')).toBe(1);
    });

    it('should format raw tax IDs', () => {
      expect(formatTaxId('0100109106002')).toBe('0100109106-002');
      expect(formatTaxId('0300588569')).toBe('0300588569');
    });

    it('should generate valid mock tax IDs', () => {
      for (let i = 0; i < 10; i++) {
        const mock10 = generateMockTaxId();
        expect(isValidTaxId(mock10)).toBe(true);
        expect(isEnterpriseTaxId(mock10)).toBe(true);

        const mock13 = generateMockTaxId({ branch: true });
        expect(isValidTaxId(mock13)).toBe(true);
        expect(isBranchTaxId(mock13)).toBe(true);
      }
    });
  });
});
