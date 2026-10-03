import fs from 'fs';

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
