import { describe, it, expect } from 'vitest';
import {
  cleanANPRText,
  cleanVietnamPlate,
  combinePlateLines,
  calculatePlateSimilarity,
  findBestPlateMatch,
  sanitizeANPRRaw
} from './index';

describe('anpr-plate-cleaner', () => {
  describe('cleanANPRText & cleanVietnamPlate', () => {
    it('should correct OCR digit/letter confusion for car plates', () => {
      // S instead of 5, I instead of 1, B instead of 8
      const raw = 'SIK-999.9B';
      const res = cleanVietnamPlate(raw);

      expect(res.isValid).toBe(true);
      expect(res.compact).toBe('51K99998');
      expect(res.formatted).toBe('51K-999.98');
      expect(res.vehicleType).toBe('car');
    });

    it('should handle multi-line OCR output for motorbike plates', () => {
      // 2 lines: top row "59-P1", bottom row "123.45"
      const raw = '59-P1\n123.45';
      const res = cleanVietnamPlate(raw);

      expect(res.isValid).toBe(true);
      expect(res.compact).toBe('59P112345');
      expect(res.formatted).toBe('59-P1 123.45');
      expect(res.vehicleType).toBe('motorbike');
    });

    it('should fix letters misread in province and series positions for motorbike', () => {
      // S9 -> 59, PI -> P1, I23.45 -> 123.45
      const raw = 'S9-PI\nI23.45';
      const res = cleanVietnamPlate(raw);

      expect(res.compact).toBe('59P112345');
      expect(res.vehicleType).toBe('motorbike');
    });

    it('should clean electric motorbike plates with MD series', () => {
      const raw = '29-MDl-123.45'; // l instead of 1
      const res = cleanVietnamPlate(raw);

      expect(res.vehicleType).toBe('electric_motorbike');
      expect(res.compact).toBe('29MD112345');
    });

    it('should clean military plates', () => {
      const raw = 'TM-I2.34'; // I instead of 1
      const res = cleanVietnamPlate(raw);

      expect(res.vehicleType).toBe('military');
      expect(res.compact).toBe('TM1234');
      expect(res.formatted).toBe('TM-12.34');
    });
  });

  describe('combinePlateLines', () => {
    it('should merge top and bottom plate lines cleanly', () => {
      expect(combinePlateLines('59-P1', '123.45')).toBe('59P112345');
      expect(combinePlateLines('51K', '999.99')).toBe('51K99999');
    });
  });

  describe('calculatePlateSimilarity', () => {
    it('should yield 1.0 for identical plates', () => {
      expect(calculatePlateSimilarity('51K99999', '51K-999.99')).toBe(1.0);
    });

    it('should apply OCR confusion discounts for 8 vs B or 0 vs O', () => {
      // Mistaking 8 for B has minimal penalty
      const simConfusion = calculatePlateSimilarity('51K99998', '51K9999B');
      // Mistaking 8 for X has full penalty
      const simDifferent = calculatePlateSimilarity('51K99998', '51K9999X');

      expect(simConfusion).toBeGreaterThan(0.95);
      expect(simConfusion).toBeGreaterThan(simDifferent);
    });

    it('should yield low similarity for completely distinct plates', () => {
      const sim = calculatePlateSimilarity('51K12345', '29A98765');
      expect(sim).toBeLessThan(0.4);
    });
  });

  describe('findBestPlateMatch', () => {
    const registered = [
      '51K99999',
      '29A12345',
      '59P167890',
      '30E55555'
    ];

    it('should find exact or near-match in resident whitelist', () => {
      // OCR misread 8 instead of B or 0 instead of O or extra dash
      const match = findBestPlateMatch('51K-999.99', registered);
      expect(match).not.toBeNull();
      expect(match?.match).toBe('51K99999');
      expect(match?.score).toBe(1.0);
      expect(match?.index).toBe(0);
    });

    it('should find closest match when 1 character has OCR confusion', () => {
      // OCR read 'O' or 'D' instead of '0' in 59P167890
      const match = findBestPlateMatch('59P16789O', registered);
      expect(match).not.toBeNull();
      expect(match?.match).toBe('59P167890');
      expect(match?.score).toBeGreaterThan(0.95);
    });

    it('should return null when no plate matches threshold', () => {
      const match = findBestPlateMatch('43A99999', registered);
      expect(match).toBeNull();
    });
  });

  describe('sanitizeANPRRaw', () => {
    it('should remove special characters and retain valid tokens', () => {
      expect(sanitizeANPRRaw('*** 51K-999.99 ***')).toBe('51K99999');
      expect(sanitizeANPRRaw('59-P1\n123.45')).toBe('59P1 12345');
    });
  });
});
