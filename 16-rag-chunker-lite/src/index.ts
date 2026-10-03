export interface ChunkerOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separator?: string;
}

export function chunkText(text: string, options: ChunkerOptions = {}): string[] {
  const { chunkSize = 500, chunkOverlap = 50, separator = '\n\n' } = options;

  if (!text || text.length <= chunkSize) {
    return text ? [text.trim()] : [];
  }

  const rawParagraphs = text.split(separator);
  const chunks: string[] = [];
  let currentChunk = '';

  for (const para of rawParagraphs) {
    if (!para.trim()) continue;

    if (currentChunk.length + para.length <= chunkSize) {
      currentChunk += (currentChunk ? '\n\n' : '') + para;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        // Apply overlap from end of currentChunk
        const overlapStart = Math.max(0, currentChunk.length - chunkOverlap);
        const overlapText = currentChunk.slice(overlapStart);
        currentChunk = overlapText + '\n\n' + para;
      } else {
        // Single paragraph larger than chunkSize, break by words
        const words = para.split(' ');
        let wordChunk = '';
        for (const w of words) {
          if ((wordChunk + ' ' + w).length <= chunkSize) {
            wordChunk += (wordChunk ? ' ' : '') + w;
          } else {
            chunks.push(wordChunk.trim());
            wordChunk = w;
          }
        }
        currentChunk = wordChunk;
      }
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}
