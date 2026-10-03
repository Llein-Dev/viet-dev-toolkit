export interface FramerOptions {
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
