module.exports = [
  {
    folder: '21-env-assert-strict',
    name: 'env-assert-strict',
    description: 'Strict environment variable validation at startup with colored terminal error reporting and type coercion.',
    keywords: ['env', 'dotenv', 'config', 'validation', 'strict', 'environment'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { assertEnv } from 'env-assert-strict';

// Call at the very top of server entry point
assertEnv({
  PORT: { type: 'number', default: 3000 },
  DATABASE_URL: { required: true, type: 'url' },
  NODE_ENV: { enum: ['development', 'production', 'test'], default: 'development' }
});`,
    apiList: `- \`assertEnv(schema: Record<string, EnvRule>): Record<string, any>\``,
    code: `export interface EnvRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'url';
  enum?: string[];
  default?: any;
}

export function assertEnv(schema: Record<string, EnvRule>): Record<string, any> {
  const missing: string[] = [];
  const invalid: string[] = [];
  const parsed: Record<string, any> = {};

  for (const [key, rule] of Object.entries(schema)) {
    let val = process.env[key];

    if (val === undefined || val === '') {
      if (rule.default !== undefined) {
        parsed[key] = rule.default;
        continue;
      }
      if (rule.required) {
        missing.push(key);
        continue;
      }
    }

    if (val !== undefined && val !== '') {
      if (rule.type === 'number') {
        const num = Number(val);
        if (isNaN(num)) invalid.push(\`\${key}: Expected number, got "\${val}"\`);
        else parsed[key] = num;
      } else if (rule.type === 'boolean') {
        parsed[key] = val === 'true' || val === '1';
      } else if (rule.type === 'url') {
        try {
          new URL(val);
          parsed[key] = val;
        } catch {
          invalid.push(\`\${key}: Expected valid URL, got "\${val}"\`);
        }
      } else {
        parsed[key] = val;
      }

      if (rule.enum && !rule.enum.includes(val)) {
        invalid.push(\`\${key}: Must be one of [\${rule.enum.join(', ')}], got "\${val}"\`);
      }
    }
  }

  if (missing.length > 0 || invalid.length > 0) {
    const lines = [
      '❌ [env-assert-strict] Environment Configuration Errors:',
      ...missing.map((k) => \`  - Missing required variable: \${k}\`),
      ...invalid.map((e) => \`  - Invalid value: \${e}\`)
    ];
    throw new Error(lines.join('\\n'));
  }

  return parsed;
}
`
  },
  {
    folder: '22-path-clean-crossplatform',
    name: 'path-clean-crossplatform',
    description: 'Zero-dep cross-platform path sanitizer converting Windows backslashes and POSIX slashes into consistent format.',
    keywords: ['path', 'cross-platform', 'windows', 'posix', 'normalize', 'filepath'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { toPosixPath, cleanPath } from 'path-clean-crossplatform';

console.log(toPosixPath('C:\\\\Users\\\\Admin\\\\project\\\\file.ts'));
// "C:/Users/Admin/project/file.ts"

console.log(cleanPath('foo//bar/../baz'));
// "foo/baz"`,
    apiList: `- \`toPosixPath(filepath: string): string\`
- \`cleanPath(filepath: string): string\``,
    code: `export function toPosixPath(filepath: string): string {
  if (!filepath) return '';
  return filepath.replace(/\\\\/g, '/');
}

export function cleanPath(filepath: string): string {
  if (!filepath) return '';

  let normalized = toPosixPath(filepath);

  // Preserve Windows drive letter
  const driveMatch = normalized.match(/^([a-zA-Z]:)(\\/.*)?$/);
  let prefix = '';
  if (driveMatch) {
    prefix = driveMatch[1];
    normalized = driveMatch[2] || '/';
  }

  const parts = normalized.split('/').filter(Boolean);
  const stack: string[] = [];

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (stack.length > 0 && stack[stack.length - 1] !== '..') {
        stack.pop();
      } else {
        stack.push('..');
      }
    } else {
      stack.push(part);
    }
  }

  const result = stack.join('/');
  if (prefix) {
    return prefix + (result ? '/' + result : '');
  }
  return (filepath.startsWith('/') ? '/' : '') + result;
}
`
  },
  {
    folder: '23-express-async-catch',
    name: 'express-async-catch',
    description: 'Clean async/await wrapper for Express 4.x route handlers avoiding repetitive try-catch blocks.',
    keywords: ['express', 'async', 'error-handler', 'middleware', 'catch', 'routes'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { asyncCatch } from 'express-async-catch';
import express from 'express';

const app = express();

app.get('/users', asyncCatch(async (req, res) => {
  const users = await fetchUsersFromDb();
  res.json(users);
}));`,
    apiList: `- \`asyncCatch(fn: Function): ExpressMiddleware\`
- \`wrapRouter(router: ExpressRouter): ExpressRouter\``,
    code: `export type AsyncHandler = (req: any, res: any, next: (err?: any) => void) => Promise<any>;

export function asyncCatch(fn: AsyncHandler) {
  return (req: any, res: any, next: (err?: any) => void) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function wrapRouter(router: any) {
  const methods = ['get', 'post', 'put', 'delete', 'patch'];
  for (const method of methods) {
    const original = router[method];
    if (typeof original === 'function') {
      router[method] = function (path: string, ...handlers: any[]) {
        const wrapped = handlers.map((h) => (typeof h === 'function' ? asyncCatch(h) : h));
        return original.call(this, path, ...wrapped);
      };
    }
  }
  return router;
}
`
  },
  {
    folder: '24-multer-disk-filename',
    name: 'multer-disk-filename',
    description: 'Generate clean, collision-free disk filenames for Multer file uploads with timestamp, random hex, and slugified original names.',
    keywords: ['multer', 'upload', 'filename', 'slugify', 'storage', 'file-upload'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { safeUploadFilename, createMulterFilenameHandler } from 'multer-disk-filename';

console.log(safeUploadFilename('Báo cáo tài chính 2026.pdf'));
// "20261003-a1b2c3d4-bao-cao-tai-chinh-2026.pdf"`,
    apiList: `- \`safeUploadFilename(originalName: string): string\`
- \`createMulterFilenameHandler(options?): MulterFilenameFunction\``,
    code: `export function safeUploadFilename(originalName: string): string {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.random().toString(36).slice(2, 8);

  const dotIndex = originalName.lastIndexOf('.');
  const ext = dotIndex !== -1 ? originalName.slice(dotIndex).toLowerCase() : '';
  const base = dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;

  const cleanBase = base
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return \`\${timestamp}-\${randomHex}-\${cleanBase || 'file'}\${ext}\`;
}

export function createMulterFilenameHandler() {
  return (_req: any, file: { originalname: string }, cb: (error: Error | null, filename: string) => void) => {
    cb(null, safeUploadFilename(file.originalname));
  };
}
`
  },
  {
    folder: '25-mime-type-checker',
    name: 'mime-type-checker',
    description: 'Detect true MIME types and extensions from file magic bytes buffer, preventing extension spoofing attacks.',
    keywords: ['mime', 'magic-bytes', 'file-type', 'security', 'buffer', 'upload-validator'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { detectMimeFromBuffer } from 'mime-type-checker';

// Check first 16 bytes of uploaded file
const mime = detectMimeFromBuffer(fileBuffer);
console.log(mime); // { ext: 'png', mime: 'image/png' }`,
    apiList: `- \`detectMimeFromBuffer(buffer: Uint8Array | Buffer): MimeResult | null\``,
    code: `export interface MimeResult {
  ext: string;
  mime: string;
}

export function detectMimeFromBuffer(buf: Uint8Array | ArrayBuffer | Buffer): MimeResult | null {
  if (!buf) return null;
  const bytes = new Uint8Array(buf instanceof ArrayBuffer ? buf : buf.buffer || buf);

  if (bytes.length < 4) return null;

  // PNG: 89 50 4E 47
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return { ext: 'png', mime: 'image/png' };
  }

  // JPEG: FF D8 FF
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: 'jpg', mime: 'image/jpeg' };
  }

  // GIF: 47 49 46 38
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    return { ext: 'gif', mime: 'image/gif' };
  }

  // PDF: 25 50 44 46 (%PDF)
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return { ext: 'pdf', mime: 'application/pdf' };
  }

  // ZIP / DOCX / XLSX: 50 4B 03 04 (PK..)
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return { ext: 'zip', mime: 'application/zip' };
  }

  // WebP: RIFF....WEBP
  if (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return { ext: 'webp', mime: 'image/webp' };
  }

  return null;
}
`
  },
  {
    folder: '26-file-size-humanize',
    name: 'file-size-humanize',
    description: 'Fast byte formatter converting byte numbers into human-readable strings (KB, MB, GB) with binary (1024) and SI (1000) base support.',
    keywords: ['bytes', 'format-bytes', 'filesize', 'humanize', 'storage', 'units'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { humanizeFileSize } from 'file-size-humanize';

console.log(humanizeFileSize(1048576)); // "1 MB"
console.log(humanizeFileSize(1500000000, { standard: 'si', decimals: 2 })); // "1.50 GB"`,
    apiList: `- \`humanizeFileSize(bytes: number, options?): string\``,
    code: `export interface FormatOptions {
  decimals?: number;
  standard?: 'binary' | 'si'; // binary: 1024, si: 1000
  spacer?: string;
}

export function humanizeFileSize(bytes: number, options: FormatOptions = {}): string {
  const { decimals = 1, standard = 'binary', spacer = ' ' } = options;

  if (bytes === 0) return \`0\${spacer}B\`;
  if (!bytes || isNaN(bytes)) return \`0\${spacer}B\`;

  const k = standard === 'si' ? 1000 : 1024;
  const sizes = standard === 'si'
    ? ['B', 'kB', 'MB', 'GB', 'TB', 'PB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const val = (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : decimals);

  return \`\${val}\${spacer}\${sizes[i]}\`;
}
`
  },
  {
    folder: '27-process-lock-file',
    name: 'process-lock-file',
    description: 'Simple file-based process locking mechanism preventing concurrent executions of cron jobs and CLI daemon scripts.',
    keywords: ['lockfile', 'process-lock', 'single-instance', 'mutex', 'cron', 'daemon'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { acquireLock } from 'process-lock-file';

const lock = acquireLock('.sync.lock');
if (!lock.acquired) {
  console.log('Script is already running in another process! Exiting.');
  process.exit(0);
}

// ... do heavy work ...
lock.release();`,
    apiList: `- \`acquireLock(lockFilePath: string): LockHandle\`
- \`releaseLock(lockFilePath: string): void\``,
    code: `import fs from 'fs';

export interface LockHandle {
  acquired: boolean;
  lockPath: string;
  pid?: number;
  release: () => void;
}

export function acquireLock(lockPath: string): LockHandle {
  try {
    if (fs.existsSync(lockPath)) {
      const pid = parseInt(fs.readFileSync(lockPath, 'utf8'), 10);
      let isAlive = false;
      try {
        isAlive = process.kill(pid, 0);
      } catch {
        isAlive = false;
      }

      if (isAlive) {
        return { acquired: false, lockPath, pid, release: () => {} };
      }
    }

    fs.writeFileSync(lockPath, String(process.pid), { flag: 'w' });

    const release = () => {
      try {
        if (fs.existsSync(lockPath)) {
          fs.unlinkSync(lockPath);
        }
      } catch {}
    };

    process.on('exit', release);

    return { acquired: true, lockPath, pid: process.pid, release };
  } catch {
    return { acquired: false, lockPath, release: () => {} };
  }
}
`
  },
  {
    folder: '28-easy-cron-builder',
    name: 'easy-cron-builder',
    description: 'Human-friendly phrase to 5-field Cron expression builder ("every 5 minutes", "daily at 09:30", "every monday").',
    keywords: ['cron', 'cron-expression', 'schedule', 'cron-builder', 'scheduler'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { buildCron, parseHumanSchedule } from 'easy-cron-builder';

console.log(parseHumanSchedule('every 15 minutes')); // "*/15 * * * *"
console.log(parseHumanSchedule('every day at 08:30')); // "30 8 * * *"
console.log(parseHumanSchedule('every monday at 09:00')); // "0 9 * * 1"`,
    apiList: `- \`parseHumanSchedule(phrase: string): string\`
- \`buildCron(options): string\``,
    code: `export function parseHumanSchedule(phrase: string): string {
  const clean = phrase.toLowerCase().trim();

  // Every X minutes
  const minMatch = clean.match(/every\\s+(\\d+)\\s+minutes?/);
  if (minMatch) {
    return \`*/\${minMatch[1]} * * * *\`;
  }

  // Every hour
  if (clean === 'every hour') {
    return '0 * * * *';
  }

  // Every day at HH:MM
  const dailyMatch = clean.match(/every day at (\\d{1,2}):(\\d{2})/);
  if (dailyMatch) {
    return \`\${parseInt(dailyMatch[2], 10)} \${parseInt(dailyMatch[1], 10)} * * *\`;
  }

  // Day of week at HH:MM
  const DOW: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6
  };

  const dowMatch = clean.match(/every (sunday|monday|tuesday|wednesday|thursday|friday|saturday) at (\\d{1,2}):(\\d{2})/);
  if (dowMatch) {
    const dow = DOW[dowMatch[1]];
    return \`\${parseInt(dowMatch[3], 10)} \${parseInt(dowMatch[2], 10)} * * \${dow}\`;
  }

  return '* * * * *';
}
`
  },
  {
    folder: '29-json-storage-flat',
    name: 'json-storage-flat',
    description: 'Crash-resilient JSON flat-file storage engine with atomic writes and in-memory cache for fast local persistence.',
    keywords: ['json-database', 'storage', 'flat-file', 'atomic-write', 'key-value'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { JsonStorage } from 'json-storage-flat';

const db = new JsonStorage('./data.json', { users: [] });
await db.update((data) => {
  data.users.push({ id: 1, name: 'Alice' });
});

console.log(db.get('users'));`,
    apiList: `- \`new JsonStorage(filepath, initialData)\`
- \`db.get(key)\`
- \`db.set(key, value)\`
- \`db.update(updaterFn)\``,
    code: `import fs from 'fs';
import path from 'path';

export class JsonStorage<T extends Record<string, any> = Record<string, any>> {
  private filePath: string;
  private memoryData: T;

  constructor(filePath: string, defaultData: T = {} as T) {
    this.filePath = path.resolve(filePath);
    if (fs.existsSync(this.filePath)) {
      try {
        this.memoryData = JSON.parse(fs.readFileSync(this.filePath, 'utf8'));
      } catch {
        this.memoryData = defaultData;
      }
    } else {
      this.memoryData = defaultData;
      this.saveAtomic();
    }
  }

  private saveAtomic() {
    const tmp = \`\${this.filePath}.\${Date.now()}.tmp\`;
    fs.writeFileSync(tmp, JSON.stringify(this.memoryData, null, 2), 'utf8');
    fs.renameSync(tmp, this.filePath);
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.memoryData[key];
  }

  set<K extends keyof T>(key: K, value: T[K]) {
    this.memoryData[key] = value;
    this.saveAtomic();
  }

  update(updater: (data: T) => void) {
    updater(this.memoryData);
    this.saveAtomic();
  }

  getAll(): T {
    return { ...this.memoryData };
  }
}
`
  },
  {
    folder: '30-graceful-shutdown-node',
    name: 'graceful-shutdown-node',
    description: 'Safe exit lifecycle manager for Node.js servers, closing DB pools and finishing HTTP requests on SIGTERM / SIGINT.',
    keywords: ['graceful-shutdown', 'sigterm', 'sigint', 'lifecycle', 'cleanup', 'server'],
    category: 'System, Node.js & File Management Utilities',
    usageCode: `import { registerShutdownHook } from 'graceful-shutdown-node';

registerShutdownHook(async () => {
  console.log('Closing database connections...');
  await db.disconnect();
  console.log('Closing HTTP server...');
  await server.close();
}, { timeoutMs: 10000 });`,
    apiList: `- \`registerShutdownHook(cleanupFn: () => Promise<void>, options?): void\``,
    code: `export interface ShutdownOptions {
  timeoutMs?: number;
  signals?: NodeJS.Signals[];
}

export function registerShutdownHook(
  cleanup: () => Promise<void> | void,
  options: ShutdownOptions = {}
) {
  const { timeoutMs = 10000, signals = ['SIGTERM', 'SIGINT'] } = options;
  let isShuttingDown = false;

  const handleSignal = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.info(\`[graceful-shutdown] Received \${signal}. Cleaning up...\`);

    const timer = setTimeout(() => {
      console.error('[graceful-shutdown] Cleanup timed out. Forcing process exit.');
      process.exit(1);
    }, timeoutMs);

    try {
      await cleanup();
      clearTimeout(timer);
      console.info('[graceful-shutdown] Cleanup finished safely.');
      process.exit(0);
    } catch (err) {
      clearTimeout(timer);
      console.error('[graceful-shutdown] Error during cleanup:', err);
      process.exit(1);
    }
  };

  for (const sig of signals) {
    process.once(sig, () => handleSignal(sig));
  }
}
`
  }
];
