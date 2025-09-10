// Simple markdown parser
export const parseMarkdown = (markdown: string): string => {
  let html: string = markdown;

  // Headers
  html = html.replace(
    /^(#{1,6})\s+(.+)$/gm,
    (_match: string, hashes: string, text: string) => {
      const level = hashes.length;
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );

  // Code blocks
  html = html.replace(
    /```.*\n([\s\S]*?)\n```/g,
    (_match: string, code: string) => `<pre><code>${code}</code></pre>`
  );

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    (_match: string, code: string) => `<code>${code}</code>`
  );

  // Bold
  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    (_match: string, text: string) => `<strong>${text}</strong>`
  );

  // Convert markdown list syntax (- or *) to <li>
  html = html.replace(
    /^\s*[-*]\s+(.+)$/gm,
    (_match: string, item: string) => `<li>${item}</li>`
  );

  // Wrap consecutive <li> elements in <ul>...</ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Paragraphs
  return html
    .split('\n\n')
    .map((p: string) => {
      const trimmed = p.trim();
      if (!trimmed || /^<(h[1-6]|ul|pre)/.exec(trimmed)) return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join('\n');
};

// Extract headings
export const extractHeadings = (markdown: string) => {
  const headings = [];
  const matches = markdown.matchAll(/^(#{1,6})\s+(.+)$/gm);

  for (const match of matches) {
    const level = match[1].length;
    const text = match[2];
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ level, text, id });
  }

  return headings;
};
