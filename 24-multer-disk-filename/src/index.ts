export function safeUploadFilename(originalName: string): string {
  const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.random().toString(36).slice(2, 8);

  const dotIndex = originalName.lastIndexOf('.');
  const ext = dotIndex !== -1 ? originalName.slice(dotIndex).toLowerCase() : '';
  const base = dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;

  const cleanBase = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .replace(/^-|-$/g, '')
    .toLowerCase();

  return `${timestamp}-${randomHex}-${cleanBase || 'file'}${ext}`;
}

export function createMulterFilenameHandler() {
  return (_req: any, file: { originalname: string }, cb: (error: Error | null, filename: string) => void) => {
    cb(null, safeUploadFilename(file.originalname));
  };
}
