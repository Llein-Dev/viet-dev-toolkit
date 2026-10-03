import { describe, it, expect } from 'vitest';
import {
  parseVNPhone,
  isVNPhoneValid,
  getCarrier,
  formatPhone,
  maskPhone
} from './index';

describe('vn-phone-carrier', () => {
  describe('Carrier Detection', () => {
    it('should detect Viettel numbers correctly', () => {
      const p1 = parseVNPhone('0987654321');
      expect(p1.isValid).toBe(true);
      expect(p1.carrier).toBe('Viettel');
      expect(p1.prefix).toBe('098');

      const p2 = parseVNPhone('0388889999');
      expect(p2.carrier).toBe('Viettel');
    });

    it('should detect VinaPhone numbers correctly', () => {
      const p = parseVNPhone('0912345678');
      expect(p.isValid).toBe(true);
      expect(p.carrier).toBe('VinaPhone');
      expect(p.prefix).toBe('091');
    });

    it('should detect MobiFone numbers correctly', () => {
      const p = parseVNPhone('0909090909');
      expect(p.isValid).toBe(true);
      expect(p.carrier).toBe('MobiFone');
      expect(p.prefix).toBe('090');
    });

    it('should detect Vietnamobile, Wintel, and ITel numbers', () => {
      expect(getCarrier('0921234567')).toBe('Vietnamobile');
      expect(getCarrier('0551234567')).toBe('Wintel');
      expect(getCarrier('0871234567')).toBe('I-Telecom');
      expect(getCarrier('0991234567')).toBe('Gmobile');
    });
  });

  describe('International E.164 and messy inputs', () => {
    it('should handle +84 international format', () => {
      const res = parseVNPhone('+84987654321');
      expect(res.isValid).toBe(true);
      expect(res.national).toBe('0987654321');
      expect(res.e164).toBe('+84987654321');
      expect(res.carrier).toBe('Viettel');
    });

    it('should handle 84 without plus sign', () => {
      const res = parseVNPhone('84909123456');
      expect(res.isValid).toBe(true);
      expect(res.national).toBe('0909123456');
      expect(res.carrier).toBe('MobiFone');
    });

    it('should strip spaces, dots, and hyphens', () => {
      const res = parseVNPhone('098.765.4321');
      expect(res.isValid).toBe(true);
      expect(res.national).toBe('0987654321');
    });
  });

  describe('Legacy 11-to-10 digit migration', () => {
    it('should automatically convert old Viettel 0168 to 038', () => {
      const res = parseVNPhone('01681234567');
      expect(res.isValid).toBe(true);
      expect(res.national).toBe('0381234567');
      expect(res.wasMigratedFrom11Digits).toBe(true);
      expect(res.carrier).toBe('Viettel');
    });

    it('should automatically convert old MobiFone 0120 to 070', () => {
      const res = parseVNPhone('01201234567');
      expect(res.isValid).toBe(true);
      expect(res.national).toBe('0701234567');
      expect(res.wasMigratedFrom11Digits).toBe(true);
      expect(res.carrier).toBe('MobiFone');
    });
  });

  describe('Formatting & Masking helpers', () => {
    it('should format into pretty, dots, and dashes', () => {
      expect(formatPhone('0987654321', 'pretty')).toBe('0987 654 321');
      expect(formatPhone('0987654321', 'dots')).toBe('0987.654.321');
      expect(formatPhone('0987654321', 'dashes')).toBe('0987-654-321');
      expect(formatPhone('0987654321', 'e164')).toBe('+84987654321');
    });

    it('should mask phone numbers for privacy', () => {
      expect(maskPhone('0987654321')).toBe('0987***321');
    });
  });

  describe('Invalid phone numbers', () => {
    it('should reject invalid length or invalid prefixes', () => {
      expect(isVNPhoneValid('012345')).toBe(false);
      expect(isVNPhoneValid('09876543210987')).toBe(false);
      expect(isVNPhoneValid('0111234567')).toBe(false); // nonexistent prefix
    });
  });
});
