export interface TaxValidationResult {
  isValid: boolean;
  raw: string;
  formatted?: string;
  type?: 'enterprise' | 'personal' | 'branch';
  error?: string;
}

const WEIGHTS = [31, 29, 23, 19, 17, 13, 7, 5, 3];

export function validateTaxId(taxId: string): TaxValidationResult {
  if (!taxId) {
    return { isValid: false, raw: '', error: 'Tax ID is required' };
  }

  const clean = String(taxId).trim().replace(/\s+/g, '');

  let base = '';
  let branch = '';

  if (clean.includes('-')) {
    const parts = clean.split('-');
    if (parts.length !== 2) {
      return { isValid: false, raw: clean, error: 'Malformed hyphenated tax ID' };
    }
    base = parts[0];
    branch = parts[1];
  } else if (clean.length === 13) {
    base = clean.slice(0, 10);
    branch = clean.slice(10);
  } else {
    base = clean;
  }

  if (!/^\d{10}$/.test(base)) {
    return { isValid: false, raw: clean, error: 'Base Tax ID must contain exactly 10 digits' };
  }

  if (branch && !/^\d{3}$/.test(branch)) {
    return { isValid: false, raw: clean, error: 'Branch code must contain exactly 3 digits' };
  }

  // Modulo-11 Checksum calculation for the first 10 digits
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(base[i], 10) * WEIGHTS[i];
  }

  const remainder = sum % 11;
  const calculatedCheckDigit = 10 - remainder;
  const actualCheckDigit = parseInt(base[9], 10);

  // If remainder is 0 or 1, check digit rules in Vietnam standard
  let validCheckDigit = calculatedCheckDigit;
  if (calculatedCheckDigit === 10) validCheckDigit = 0;
  if (calculatedCheckDigit === 11) validCheckDigit = 0;

  if (actualCheckDigit !== validCheckDigit && actualCheckDigit !== (10 - remainder)) {
    return { isValid: false, raw: clean, error: 'Invalid Tax ID checksum' };
  }

  const formatted = branch ? `${base}-${branch}` : base;
  const type = branch ? 'branch' : 'enterprise';

  return {
    isValid: true,
    raw: clean,
    formatted,
    type
  };
}

export function formatTaxId(taxId: string): string {
  const result = validateTaxId(taxId);
  return result.formatted || taxId;
}

export function isEnterpriseTaxId(taxId: string): boolean {
  const res = validateTaxId(taxId);
  return res.isValid && res.type === 'enterprise';
}
