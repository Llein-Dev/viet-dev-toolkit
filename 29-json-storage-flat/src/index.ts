import fs from 'fs';
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
    const tmp = `${this.filePath}.${Date.now()}.tmp`;
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
