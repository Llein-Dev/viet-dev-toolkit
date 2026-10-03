export interface FormatOptions {
  decimals?: number;
  standard?: 'binary' | 'si'; // binary: 1024, si: 1000
  spacer?: string;
}

export function humanizeFileSize(bytes: number, options: FormatOptions = {}): string {
  const { decimals = 1, standard = 'binary', spacer = ' ' } = options;

  if (bytes === 0) return `0${spacer}B`;
  if (!bytes || isNaN(bytes)) return `0${spacer}B`;

  const k = standard === 'si' ? 1000 : 1024;
  const sizes = standard === 'si'
    ? ['B', 'kB', 'MB', 'GB', 'TB', 'PB']
    : ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(k));
  const val = (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : decimals);

  return `${val}${spacer}${sizes[i]}`;
}
