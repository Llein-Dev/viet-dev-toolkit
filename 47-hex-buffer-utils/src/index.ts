export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\s+/g, '');
  if (clean.length % 2 !== 0) {
    throw new Error('Hex string must have an even length');
  }

  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return bytes;
}

export function bytesToHex(bytes: Uint8Array | number[], delimiter = ''): string {
  const hexParts: string[] = [];
  for (let i = 0; i < bytes.length; i++) {
    hexParts.push(bytes[i].toString(16).padStart(2, '0').toUpperCase());
  }
  return hexParts.join(delimiter);
}

export function stringToHex(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return bytesToHex(bytes);
}

export function hexToString(hex: string): string {
  const bytes = hexToBytes(hex);
  return new TextDecoder().decode(bytes);
}
