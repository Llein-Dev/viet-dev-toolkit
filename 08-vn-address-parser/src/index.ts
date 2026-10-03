export interface ParsedVNAddress {
  raw: string;
  street: string;
  ward?: string;
  district?: string;
  province?: string;
}

export function parseVNAddress(rawAddress: string): ParsedVNAddress {
  const clean = String(rawAddress || '').trim();
  if (!clean) {
    return { raw: clean, street: '' };
  }

  const parts = clean.split(/[,\n]+/).map((p) => p.trim()).filter(Boolean);

  if (parts.length >= 4) {
    const province = parts[parts.length - 1];
    const district = parts[parts.length - 2];
    const ward = parts[parts.length - 3];
    const street = parts.slice(0, parts.length - 3).join(', ');
    return { raw: clean, street, ward, district, province };
  }

  if (parts.length === 3) {
    const province = parts[2];
    const district = parts[1];
    const street = parts[0];
    return { raw: clean, street, district, province };
  }

  if (parts.length === 2) {
    const province = parts[1];
    const street = parts[0];
    return { raw: clean, street, province };
  }

  return { raw: clean, street: clean };
}
