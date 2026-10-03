module.exports = [
  {
    folder: '41-rtsp-url-builder',
    name: 'rtsp-url-builder',
    description: 'Construct standardized RTSP video streaming URLs for major IP camera brands (Hikvision, Dahua, KBVision, Imou, Uniview).',
    keywords: ['rtsp', 'ip-camera', 'hikvision', 'dahua', 'imou', 'streaming', 'cctv'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { buildRtspUrl } from 'rtsp-url-builder';

const url = buildRtspUrl({
  brand: 'hikvision',
  host: '192.168.1.100',
  username: 'admin',
  password: 'Password123',
  channel: 1,
  subtype: 'sub'
});
console.log(url);
// "rtsp://admin:Password123@192.168.1.100:554/Streaming/Channels/102"`,
    apiList: `- \`buildRtspUrl(options: RtspCameraOptions): string\``,
    code: `export interface RtspCameraOptions {
  brand: 'hikvision' | 'dahua' | 'kbvision' | 'imou' | 'uniview' | 'generic';
  host: string;
  port?: number;
  username?: string;
  password?: string;
  channel?: number;
  subtype?: 'main' | 'sub';
}

export function buildRtspUrl(options: RtspCameraOptions): string {
  const {
    brand,
    host,
    port = 554,
    username,
    password,
    channel = 1,
    subtype = 'main'
  } = options;

  const auth = username && password ? \`\${encodeURIComponent(username)}:\${encodeURIComponent(password)}@\` : '';
  const base = \`rtsp://\${auth}\${host}:\${port}\`;

  switch (brand) {
    case 'hikvision': {
      // 101: channel 1 main stream, 102: channel 1 sub stream
      const streamId = \`\${channel}0\${subtype === 'main' ? 1 : 2}\`;
      return \`\${base}/Streaming/Channels/\${streamId}\`;
    }
    case 'dahua':
    case 'kbvision':
    case 'imou': {
      const subtypeId = subtype === 'main' ? 0 : 1;
      return \`\${base}/cam/realmonitor?channel=\${channel}&subtype=\${subtypeId}\`;
    }
    case 'uniview': {
      const streamIndex = subtype === 'main' ? 1 : 2;
      return \`\${base}/unicast/c\${channel}/s\${streamIndex}/live\`;
    }
    default:
      return \`\${base}/live/ch\${channel}\`;
  }
}
`
  },
  {
    folder: '42-anpr-plate-cleaner',
    name: 'anpr-plate-cleaner',
    description: 'Post-processing text cleaner for License Plate OCR (ANPR) resolving character confusions like 0 vs O, 1 vs I, 8 vs B based on position rules.',
    keywords: ['anpr', 'alpr', 'ocr', 'license-plate', 'post-processing', 'cleaner'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { cleanANPRText } from 'anpr-plate-cleaner';

// OCR misread "51K" as "51|<" and "001" as "OO1"
const corrected = cleanANPRText('51K-OO1.23');
console.log(corrected); // "51K-001.23"`,
    apiList: `- \`cleanANPRText(rawOcr: string): string\`
- \`fixLetterConfusion(char: string): string\`
- \`fixDigitConfusion(char: string): string\``,
    code: `const DIGIT_TO_LETTER: Record<string, string> = {
  '0': 'O',
  '1': 'I',
  '2': 'Z',
  '5': 'S',
  '8': 'B'
};

const LETTER_TO_DIGIT: Record<string, string> = {
  O: '0',
  D: '0',
  Q: '0',
  I: '1',
  L: '1',
  Z: '2',
  S: '5',
  B: '8',
  G: '6'
};

export function cleanANPRText(raw: string): string {
  if (!raw) return '';

  let text = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (text.length < 6) return text;

  // Rule for Vietnam plate: First 2 chars MUST be numbers (Province)
  const p1 = LETTER_TO_DIGIT[text[0]] || text[0];
  const p2 = LETTER_TO_DIGIT[text[1]] || text[1];

  // 3rd char is usually a letter series (A-Z)
  const series = DIGIT_TO_LETTER[text[2]] || text[2];

  // Suffix numbers (usually digits)
  const rest = text.slice(3).split('').map((ch) => LETTER_TO_DIGIT[ch] || ch).join('');

  return \`\${p1}\${p2}\${series}\${rest}\`;
}
`
  },
  {
    folder: '43-serial-com-buffer-parser',
    name: 'serial-com-buffer-parser',
    description: 'Packet framer and buffer parser for Serial/COM/RS232/RS485 data streams using STX (0x02) and ETX (0x03) delimiters.',
    keywords: ['serial', 'rs232', 'rs485', 'com-port', 'buffer', 'packet-parser', 'iot'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { PacketFramer } from 'serial-com-buffer-parser';

const framer = new PacketFramer({
  onPacket: (packet) => {
    console.log('Received valid packet:', packet.toString('utf8'));
  }
});

// Pass streaming chunks from SerialPort.on('data')
framer.push(chunkBuffer);`,
    apiList: `- \`new PacketFramer(options)\`
- \`framer.push(chunk: Buffer | Uint8Array)\`
- \`framer.reset()\``,
    code: `export interface FramerOptions {
  stx?: number; // default: 0x02
  etx?: number; // default: 0x03
  onPacket: (packet: Uint8Array) => void;
  maxPacketSize?: number;
}

export class PacketFramer {
  private buffer: number[] = [];
  private inPacket = false;
  private stx: number;
  private etx: number;
  private maxPacketSize: number;
  private onPacket: (packet: Uint8Array) => void;

  constructor(options: FramerOptions) {
    this.stx = options.stx ?? 0x02;
    this.etx = options.etx ?? 0x03;
    this.maxPacketSize = options.maxPacketSize ?? 4096;
    this.onPacket = options.onPacket;
  }

  push(chunk: Uint8Array | number[]) {
    for (let i = 0; i < chunk.length; i++) {
      const byte = chunk[i];

      if (byte === this.stx) {
        this.inPacket = true;
        this.buffer = [];
        continue;
      }

      if (byte === this.etx && this.inPacket) {
        this.inPacket = false;
        this.onPacket(new Uint8Array(this.buffer));
        this.buffer = [];
        continue;
      }

      if (this.inPacket) {
        this.buffer.push(byte);
        if (this.buffer.length > this.maxPacketSize) {
          // Packet overflow, drop
          this.inPacket = false;
          this.buffer = [];
        }
      }
    }
  }

  reset() {
    this.buffer = [];
    this.inPacket = false;
  }
}
`
  },
  {
    folder: '44-bounding-box-scaler',
    name: 'bounding-box-scaler',
    description: 'Transform and scale bounding boxes between original video/camera resolution and browser canvas/screen display dimensions.',
    keywords: ['bounding-box', 'scaler', 'computer-vision', 'canvas', 'yolo', 'overlay'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { scaleBox, boxToXYWH, boxToXYXY } from 'bounding-box-scaler';

// Video is 1920x1080, Canvas is 960x540
const originalBox = { x: 100, y: 200, width: 300, height: 400 };
const scaled = scaleBox(originalBox, { srcWidth: 1920, srcHeight: 1080, destWidth: 960, destHeight: 540 });
console.log(scaled); // { x: 50, y: 100, width: 150, height: 200 }`,
    apiList: `- \`scaleBox(box, config): BoundingBoxXYWH\`
- \`boxToXYWH(xyxy: [number, number, number, number]): BoundingBoxXYWH\`
- \`boxToXYXY(box: BoundingBoxXYWH): [number, number, number, number]\``,
    code: `export interface BoundingBoxXYWH {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScaleConfig {
  srcWidth: number;
  srcHeight: number;
  destWidth: number;
  destHeight: number;
}

export function scaleBox(box: BoundingBoxXYWH, config: ScaleConfig): BoundingBoxXYWH {
  const scaleX = config.destWidth / config.srcWidth;
  const scaleY = config.destHeight / config.srcHeight;

  return {
    x: Math.round(box.x * scaleX),
    y: Math.round(box.y * scaleY),
    width: Math.round(box.width * scaleX),
    height: Math.round(box.height * scaleY)
  };
}

export function boxToXYWH(xyxy: [number, number, number, number]): BoundingBoxXYWH {
  const [x1, y1, x2, y2] = xyxy;
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1
  };
}

export function boxToXYXY(box: BoundingBoxXYWH): [number, number, number, number] {
  return [box.x, box.y, box.x + box.width, box.y + box.height];
}
`
  },
  {
    folder: '45-mjpeg-stream-reader',
    name: 'mjpeg-stream-reader',
    description: 'Micro-client to extract individual JPEG image frames from HTTP multipart/x-mixed-replace MJPEG camera streams.',
    keywords: ['mjpeg', 'stream', 'camera', 'ip-camera', 'jpeg', 'frame-extractor'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { createMjpegReader } from 'mjpeg-stream-reader';

const reader = createMjpegReader('http://192.168.1.50/mjpeg', {
  onFrame: (frameBuffer) => {
    console.log('Received JPEG frame of size:', frameBuffer.length);
  }
});

reader.start();`,
    apiList: `- \`createMjpegReader(url: string, options)\`
- \`reader.start()\`
- \`reader.stop()\``,
    code: `export interface MjpegOptions {
  onFrame: (jpegBuffer: Uint8Array) => void;
  onError?: (err: Error) => void;
}

export function createMjpegReader(url: string, options: MjpegOptions) {
  let controller: AbortController | null = null;

  return {
    async start() {
      controller = new AbortController();
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.body) throw new Error('No response body');

        const reader = response.body.getReader();
        let buffer = new Uint8Array(0);

        const JPEG_SOI = new Uint8Array([0xff, 0xd8]);
        const JPEG_EOI = new Uint8Array([0xff, 0xd9]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const merged = new Uint8Array(buffer.length + value.length);
          merged.set(buffer);
          merged.set(value, buffer.length);
          buffer = merged;

          // Find start and end of JPEG frame
          const soiIndex = findMarker(buffer, JPEG_SOI);
          if (soiIndex !== -1) {
            const eoiIndex = findMarker(buffer, JPEG_EOI, soiIndex + 2);
            if (eoiIndex !== -1) {
              const frame = buffer.slice(soiIndex, eoiIndex + 2);
              options.onFrame(frame);
              buffer = buffer.slice(eoiIndex + 2);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          options.onError?.(err);
        }
      }
    },

    stop() {
      if (controller) {
        controller.abort();
        controller = null;
      }
    }
  };
}

function findMarker(buffer: Uint8Array, marker: Uint8Array, start = 0): number {
  for (let i = start; i < buffer.length - 1; i++) {
    if (buffer[i] === marker[0] && buffer[i + 1] === marker[1]) {
      return i;
    }
  }
  return -1;
}
`
  },
  {
    folder: '46-modbus-crc16-calc',
    name: 'modbus-crc16-calc',
    description: 'High-speed pure JavaScript Modbus RTU CRC16 checksum calculation for industrial IoT and PLC communication packets.',
    keywords: ['modbus', 'crc16', 'rtu', 'plc', 'iot', 'checksum', 'industrial'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { calculateModbusCRC16, appendModbusCRC16 } from 'modbus-crc16-calc';

// Frame without CRC: [0x01, 0x03, 0x00, 0x00, 0x00, 0x0A]
const frame = new Uint8Array([0x01, 0x03, 0x00, 0x00, 0x00, 0x0a]);
const crc = calculateModbusCRC16(frame);
console.log(crc.toString(16)); // "c5cd"

const completePacket = appendModbusCRC16(frame);`,
    apiList: `- \`calculateModbusCRC16(buffer: Uint8Array | number[]): number\`
- \`appendModbusCRC16(buffer: Uint8Array): Uint8Array\`
- \`verifyModbusCRC16(buffer: Uint8Array): boolean\``,
    code: `export function calculateModbusCRC16(buffer: Uint8Array | number[]): number {
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
`
  },
  {
    folder: '47-hex-buffer-utils',
    name: 'hex-buffer-utils',
    description: 'Utility for fast zero-allocation conversions between Hex strings, Byte arrays, ASCII, and binary strings.',
    keywords: ['hex', 'buffer', 'byte-array', 'binary', 'ascii', 'encoder', 'decoder'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { hexToBytes, bytesToHex, stringToHex } from 'hex-buffer-utils';

const bytes = hexToBytes('01030000000AC5CD');
console.log(bytesToHex(bytes, ' ')); // "01 03 00 00 00 0A C5 CD"`,
    apiList: `- \`hexToBytes(hex: string): Uint8Array\`
- \`bytesToHex(bytes: Uint8Array | number[], delimiter?: string): string\`
- \`stringToHex(str: string): string\``,
    code: `export function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/\\s+/g, '');
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
`
  },
  {
    folder: '48-webcam-resolution-checker',
    name: 'webcam-resolution-checker',
    description: 'Probe and report all supported capture resolutions (4K, 1080p, 720p, 480p) of connected webcams via WebRTC.',
    keywords: ['webcam', 'resolution', 'webrtc', 'camera-checker', 'mediadevices'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { checkSupportedResolutions } from 'webcam-resolution-checker';

const report = await checkSupportedResolutions();
console.log('Highest supported resolution:', report.highest);
// { label: '1080p', width: 1920, height: 1080 }`,
    apiList: `- \`checkSupportedResolutions(deviceId?: string): Promise<ResolutionReport>\``,
    code: `export interface ResolutionCandidate {
  label: string;
  width: number;
  height: number;
}

const COMMON_RESOLUTIONS: ResolutionCandidate[] = [
  { label: '4K', width: 3840, height: 2160 },
  { label: '1440p', width: 2560, height: 1440 },
  { label: '1080p (FHD)', width: 1920, height: 1080 },
  { label: '720p (HD)', width: 1280, height: 720 },
  { label: '480p (VGA)', width: 640, height: 480 }
];

export async function checkSupportedResolutions(deviceId?: string) {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    throw new Error('WebRTC getUserMedia is not supported in this environment');
  }

  const supported: ResolutionCandidate[] = [];

  for (const res of COMMON_RESOLUTIONS) {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { exact: res.width },
          height: { exact: res.height }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      supported.push(res);
      stream.getTracks().forEach((track) => track.stop());
    } catch {}
  }

  return {
    supported,
    highest: supported[0] || null
  };
}
`
  },
  {
    folder: '49-cccd-qr-parser',
    name: 'cccd-qr-parser',
    description: 'Parse static QR Code strings printed on Vietnamese chip-based citizen identity cards into standardized citizen profile fields.',
    keywords: ['cccd-qr', 'vietnam', 'citizen-id', 'vneid', 'qr-code', 'identity'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { parseCCCDQr } from 'cccd-qr-parser';

// Format printed on CCCD: CCCD|OldCMND|FullName|DOB|Gender|Address|IssueDate
const qrData = '001095012345||Nguyễn Văn An|25101995|Nam|123 Phố Huế, Hà Nội|10122021';
const citizen = parseCCCDQr(qrData);

console.log(citizen.fullName); // "Nguyễn Văn An"
console.log(citizen.cccd);     // "001095012345"
console.log(citizen.gender);   // "Nam"`,
    apiList: `- \`parseCCCDQr(qrString: string): ParsedCitizenQr\``,
    code: `export interface ParsedCitizenQr {
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
  if (/^\\d{8}$/.test(dobRaw)) {
    const d = dobRaw.slice(0, 2);
    const m = dobRaw.slice(2, 4);
    const y = dobRaw.slice(4, 8);
    dateOfBirth = \`\${y}-\${m}-\${d}\`;
  }

  let issueDate = issueDateRaw;
  if (issueDateRaw && /^\\d{8}$/.test(issueDateRaw)) {
    const d = issueDateRaw.slice(0, 2);
    const m = issueDateRaw.slice(2, 4);
    const y = issueDateRaw.slice(4, 8);
    issueDate = \`\${y}-\${m}-\${d}\`;
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
`
  },
  {
    folder: '50-ping-host-fast',
    name: 'ping-host-fast',
    description: 'High-speed TCP/Socket port connectivity test to probe online status of LAN IPs, cameras, printers, and microservices.',
    keywords: ['ping', 'tcp-ping', 'port-checker', 'lan', 'iot', 'network', 'socket'],
    category: 'Computer Vision, IoT & Edge Streaming Helpers',
    usageCode: `import { pingHost } from 'ping-host-fast';

const status = await pingHost('192.168.1.1', 80, { timeoutMs: 1000 });
console.log(status.isAlive); // true
console.log(status.latencyMs); // 12`,
    apiList: `- \`pingHost(host: string, port: number, options?): Promise<PingResult>\``,
    code: `import net from 'net';

export interface PingOptions {
  timeoutMs?: number;
}

export interface PingResult {
  host: string;
  port: number;
  isAlive: boolean;
  latencyMs: number;
  error?: string;
}

export function pingHost(host: string, port = 80, options: PingOptions = {}): Promise<PingResult> {
  const { timeoutMs = 2000 } = options;
  const startTime = Date.now();

  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;

    socket.setTimeout(timeoutMs);

    socket.on('connect', () => {
      const latencyMs = Date.now() - startTime;
      socket.destroy();
      if (!resolved) {
        resolved = true;
        resolve({ host, port, isAlive: true, latencyMs });
      }
    });

    socket.on('timeout', () => {
      socket.destroy();
      if (!resolved) {
        resolved = true;
        resolve({ host, port, isAlive: false, latencyMs: timeoutMs, error: 'Connection timed out' });
      }
    });

    socket.on('error', (err) => {
      socket.destroy();
      if (!resolved) {
        resolved = true;
        resolve({ host, port, isAlive: false, latencyMs: Date.now() - startTime, error: err.message });
      }
    });

    socket.connect(port, host);
  });
}
`
  }
];
