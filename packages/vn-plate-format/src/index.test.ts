import { describe, it, expect } from 'vitest';
import {
  parseLicensePlate,
  isValidLicensePlate,
  formatLicensePlate,
  getPlateProvince
} from './index';

describe('vn-plate-format', () => {
  it('should parse 5-digit car plate accurately (e.g. 51K-999.99)', () => {
    const res = parseLicensePlate('51K99999');
    expect(res.isValid).toBe(true);
    expect(res.provinceCode).toBe('51');
    expect(res.province).toBe('Thành phố Hồ Chí Minh');
    expect(res.vehicleType).toBe('car');
    expect(res.plateColor).toBe('white');
    expect(res.formatted).toBe('51K-999.99');
    expect(res.compact).toBe('51K99999');
  });

  it('should parse 4-digit car plate (e.g. 29A-1234)', () => {
    const res = parseLicensePlate('29A-1234');
    expect(res.isValid).toBe(true);
    expect(res.province).toBe('Thành phố Hà Nội');
    expect(res.vehicleType).toBe('car');
    expect(res.formatted).toBe('29A-1234');
  });

  it('should parse traditional motorbike plate (e.g. 59-P1 123.45)', () => {
    const res = parseLicensePlate('59-P1 123.45');
    expect(res.isValid).toBe(true);
    expect(res.province).toBe('Thành phố Hồ Chí Minh');
    expect(res.vehicleType).toBe('motorbike');
    expect(res.formatted).toBe('59-P1 123.45');
  });

  it('should parse Circular 24/2023 dual-letter motorbike plate (e.g. 29-AA 123.45)', () => {
    const res = parseLicensePlate('29AA12345');
    expect(res.isValid).toBe(true);
    expect(res.province).toBe('Thành phố Hà Nội');
    expect(res.vehicleType).toBe('motorbike');
    expect(res.formatted).toBe('29-AA 123.45');
    expect(res.series).toBe('AA');
  });

  it('should parse joint-venture car LD plate (e.g. 29LD-123.45)', () => {
    const res = parseLicensePlate('29LD12345');
    expect(res.isValid).toBe(true);
    expect(res.vehicleType).toBe('car');
    expect(res.plateColor).toBe('yellow');
    expect(res.formatted).toBe('29LD-123.45');
  });

  it('should parse electric motorbike plate (e.g. 29-MD1 123.45)', () => {
    const res = parseLicensePlate('29MD112345');
    expect(res.isValid).toBe(true);
    expect(res.province).toBe('Thành phố Hà Nội');
    expect(res.vehicleType).toBe('electric_motorbike');
  });

  it('should identify commercial yellow plates', () => {
    const res = parseLicensePlate('51E-123.45');
    expect(res.isValid).toBe(true);
    expect(res.plateColor).toBe('yellow');
  });

  it('should parse military red plates', () => {
    const res = parseLicensePlate('TM1234');
    expect(res.isValid).toBe(true);
    expect(res.vehicleType).toBe('military');
    expect(res.plateColor).toBe('red');
    expect(res.province).toBe('Bộ Tổng tham mưu');
  });

  it('should parse diplomatic plates', () => {
    const res = parseLicensePlate('80NG12345');
    expect(res.isValid).toBe(true);
    expect(res.vehicleType).toBe('diplomatic');
  });

  it('should format messy input to clean standardized plate', () => {
    expect(formatLicensePlate('51k 12345')).toBe('51K-123.45');
  });

  it('should reject invalid province codes', () => {
    expect(isValidLicensePlate('05A12345')).toBe(false);
  });
});
