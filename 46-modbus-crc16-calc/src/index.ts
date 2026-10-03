export function calculateModbusCRC16(buffer: Uint8Array | number[]): number {
  let crc = 0xffff;

  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x0001) !== 0) {
        crc = (crc >> 1) ^ 0xa001;
      } else {
        crc = crc >> 1;
      }
    }
  }

  return crc;
}

export function appendModbusCRC16(buffer: Uint8Array): Uint8Array {
  const crc = calculateModbusCRC16(buffer);
  const result = new Uint8Array(buffer.length + 2);
  result.set(buffer);
  result[buffer.length] = crc & 0xff; // Low byte first
  result[buffer.length + 1] = (crc >> 8) & 0xff; // High byte second
  return result;
}

export function verifyModbusCRC16(bufferWithCRC: Uint8Array): boolean {
  if (bufferWithCRC.length < 3) return false;
  const data = bufferWithCRC.slice(0, -2);
  const expectedCrc = calculateModbusCRC16(data);
  const actualLow = bufferWithCRC[bufferWithCRC.length - 2];
  const actualHigh = bufferWithCRC[bufferWithCRC.length - 1];
  const actualCrc = actualLow | (actualHigh << 8);
  return expectedCrc === actualCrc;
}
