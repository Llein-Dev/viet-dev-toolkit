export interface StripOptions {
  removeCodeBlocks?: boolean;
  removeLinks?: boolean;
}

export function stripMarkdown(markdown: string, options: StripOptions = {}): string {
  if (!markdown) return '';

  let text = markdown;

  // Remove code blocks
  if (options.removeCodeBlocks) {
    text = text.replace(/```[\s\S]*?```/g, '');
  } else {
    text = text.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1');
  }

  // Remove inline code
  text = text.replace(/`([^\`]+)`/g, '$1');

  // Remove images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, '');

  // Remove links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Remove headers #
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove blockquotes >
  text = text.replace(/^>\s+/gm, '');

  // Remove bold / italic ***text***, **text**, *text*
  text = text.replace(/(\*\*|__|\*|_)(.*?)\1/g, '$2');

  // Remove strikethrough ~~text~~
  text = text.replace(/~~(.*?)~~/g, '$1');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Normalize repeated empty lines
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}
