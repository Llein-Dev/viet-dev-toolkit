export interface SlugifyOptions {
  separator?: string;
  lowercase?: boolean;
  preserveDots?: boolean;
}

export function removeVNAccents(text: string): string {
  if (!text) return '';
  return text
    .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
    .replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A')
    .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
    .replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E')
    .replace(/[ìíịỉĩ]/g, 'i')
    .replace(/[ÌÍỊỈĨ]/g, 'I')
    .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
    .replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O')
    .replace(/[ùúụủũưừứựửữ]/g, 'u')
    .replace(/[ÙÚỤỦŨƯỪỨỰỬỮ]/g, 'U')
    .replace(/[ỳýỵỷỹ]/g, 'y')
    .replace(/[ỲÝỴỶỸ]/g, 'Y')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function slugifyVN(text: string, options: SlugifyOptions = {}): string {
  const { separator = '-', lowercase = true, preserveDots = false } = options;

  let str = removeVNAccents(text);
  if (lowercase) {
    str = str.toLowerCase();
  }

  // Remove non-word characters
  const pattern = preserveDots ? /[^a-zA-Z0-9.\s-]/g : /[^a-zA-Z0-9\s-]/g;
  str = str.replace(pattern, '');

  // Replace spaces and repeating dashes
  str = str.trim().replace(/\s+/g, separator);
  const regexSep = new RegExp(`\\\\${separator}+`, 'g');
  str = str.replace(regexSep, separator);

  return str;
}
