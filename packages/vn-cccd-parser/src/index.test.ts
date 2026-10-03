import { describe, it, expect } from 'vitest';
import {
  parseCCCD,
  isValidCCCD,
  parseCCCDQr,
  getRenewalMilestones,
  generateMockCCCD,
  PROVINCE_MAP
} from './index';

describe('vn-cccd-parser', () => {
  it('should parse valid male born in Hanoi in 1995', () => {
    const result = parseCCCD('001095012345');
    expect(result.isValid).toBe(true);
    expect(result.provinceCode).toBe('001');
    expect(result.province).toBe('Thành phố Hà Nội');
    expect(result.region).toBe('Miền Bắc');
    expect(result.isMunicipality).toBe(true);
    expect(result.gender).toBe('Nam');
    expect(result.birthYear).toBe(1995);
    expect(result.century).toContain('Thế kỷ 20');
    expect(result.randomCode).toBe('012345');
  });

  it('should parse valid female born in HCMC in 2002', () => {
    const result = parseCCCD('079302000001');
    expect(result.isValid).toBe(true);
    expect(result.provinceCode).toBe('079');
    expect(result.province).toBe('Thành phố Hồ Chí Minh');
    expect(result.region).toBe('Miền Nam');
    expect(result.isMunicipality).toBe(true);
    expect(result.gender).toBe('Nữ');
    expect(result.birthYear).toBe(2002);
    expect(result.century).toContain('Thế kỷ 21');
  });

  it('should calculate renewal milestones accurately (25, 40, 60)', () => {
    const milestones = getRenewalMilestones(2000, 2024);
    expect(milestones.age25Year).toBe(2025);
    expect(milestones.age40Year).toBe(2040);
    expect(milestones.age60Year).toBe(2060);
    expect(milestones.nextRenewalYear).toBe(2025);
  });

  it('should parse Chip CCCD QR Code string accurately', () => {
    const qrData = '001095012345|012345678|Nguyễn Văn An|25101995|Nam|123 Phố Huế, Hà Nội|10122021';
    const res = parseCCCDQr(qrData);

    expect(res.isValid).toBe(true);
    expect(res.cccd).toBe('001095012345');
    expect(res.oldCmnd).toBe('012345678');
    expect(res.fullName).toBe('Nguyễn Văn An');
    expect(res.dateOfBirth).toBe('1995-10-25');
    expect(res.gender).toBe('Nam');
    expect(res.address).toBe('123 Phố Huế, Hà Nội');
    expect(res.issueDate).toBe('2021-12-10');
    expect(res.isConsistent).toBe(true);
  });

  it('should detect inconsistency if QR data does not match CCCD', () => {
    // CCCD indicates male born in 1995, but QR says female
    const inconsistentQr = '001095012345||Trần Thị B|25101995|Nữ|Hà Nội|10122021';
    const res = parseCCCDQr(inconsistentQr);
    expect(res.isValid).toBe(true);
    expect(res.isConsistent).toBe(false);
  });

  it('should generate valid mock CCCD and parse it back successfully', () => {
    const mock = generateMockCCCD({ provinceCode: '048', gender: 'Nữ', birthYear: 2005 });
    expect(isValidCCCD(mock)).toBe(true);

    const parsed = parseCCCD(mock);
    expect(parsed.province).toBe('Thành phố Đà Nẵng');
    expect(parsed.gender).toBe('Nữ');
    expect(parsed.birthYear).toBe(2005);
  });

  it('should reject invalid formats and unknown provinces', () => {
    expect(isValidCCCD('12345')).toBe(false);
    expect(isValidCCCD('001095A12345')).toBe(false);
    expect(isValidCCCD('999095012345')).toBe(false);
  });
});
