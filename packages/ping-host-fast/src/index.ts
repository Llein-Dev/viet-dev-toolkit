import net from 'net';

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
