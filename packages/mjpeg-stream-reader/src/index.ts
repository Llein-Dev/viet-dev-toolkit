export interface MjpegOptions {
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
