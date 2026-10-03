export interface ParsedCitizenQr {
  isValid: boolean;
  raw: string;
  cccd?: string;
  oldCmnd?: string;
  fullName?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  issueDate?: string;
}

export function parseCCCDQr(qrString: string): ParsedCitizenQr {
  const clean = String(qrString || '').trim();
  const parts = clean.split('|');

  if (parts.length < 6) {
    return { isValid: false, raw: qrString };
  }

  const [cccd, oldCmnd, fullName, dobRaw, gender, address, issueDateRaw] = parts;

  // Format DOB from DDMMYYYY to YYYY-MM-DD
  let dateOfBirth = dobRaw;
  if (/^\d{8}$/.test(dobRaw)) {
    const d = dobRaw.slice(0, 2);
    const m = dobRaw.slice(2, 4);
    const y = dobRaw.slice(4, 8);
    dateOfBirth = `${y}-${m}-${d}`;
  }

  let issueDate = issueDateRaw;
  if (issueDateRaw && /^\d{8}$/.test(issueDateRaw)) {
    const d = issueDateRaw.slice(0, 2);
    const m = issueDateRaw.slice(2, 4);
    const y = issueDateRaw.slice(4, 8);
    issueDate = `${y}-${m}-${d}`;
  }

  return {
    isValid: true,
    raw: qrString,
    cccd,
    oldCmnd: oldCmnd || undefined,
    fullName,
    dateOfBirth,
    gender,
    address,
    issueDate
  };
}
