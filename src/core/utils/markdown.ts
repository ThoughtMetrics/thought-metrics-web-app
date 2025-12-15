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

  // Blockquotes - must be processed early to avoid conflicts
  // Handle nested blockquotes (>> creates nested quotes)
  html = html.replace(
    /^(>+)\s*(.+)$/gm,
    (_match: string, arrows: string, text: string) => {
      const level = arrows.length;
      let result = text;
      for (let i = 0; i < level; i++) {
        result = `<blockquote>${result}</blockquote>`;
      }
      return result;
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

  // Images - must be processed before links to avoid conflicts
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_match: string, alt: string, url: string) => `<img src="${url}" alt="${alt}" />`
  );

  // Links - must be processed before bold/italic
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match: string, text: string, url: string) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`
  );

  // Strikethrough - must be processed before bold
  html = html.replace(
    /~~([^~]+)~~/g,
    (_match: string, text: string) => `<del>${text}</del>`
  );

  // Bold
  html = html.replace(
    /\*\*([^*]+)\*\*/g,
    (_match: string, text: string) => `<strong>${text}</strong>`
  );

  // Italic (underscore or single asterisk) - must be after bold to avoid conflicts
  // For underscores, only match when surrounded by whitespace or line boundaries to avoid matching in URLs/filenames
  html = html.replace(
    /(^|\s)_([^_]+)_(\s|$)/gm,
    (_match: string, before: string, text: string, after: string) => `${before}<em>${text}</em>${after}`
  );
  html = html.replace(
    /\*([^*]+)\*/g,
    (_match: string, text: string) => `<em>${text}</em>`
  );

  // Auto-link plain URLs (not already in <a> or <img> tags)
  html = html.replace(
    /(?<!href="|src=")https?:\/\/[^\s<>")\]]+/g,
    (url: string) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
  );

  // Convert markdown list syntax (- or *) to <li>
  html = html.replace(
    /^\s*[-*]\s+(.+)$/gm,
    (_match: string, item: string) => `<li>${item}</li>`
  );

  // Wrap consecutive <li> elements in <ul>...</ul>
  html = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul>$1</ul>');
  html = html.replace(/<\/ul>\s*<ul>/g, '');

  // Blockquotes - convert lines starting with >
  html = html.replace(
    /^>\s+(.+)$/gm,
    (_match: string, text: string) => `<bq>${text}</bq>`
  );

  // Wrap each <bq> in blockquote
  html = html.replace(/(<bq>[\s\S]*?<\/bq>)/g, '<blockquote>$1</blockquote>');

  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\s*<blockquote>/g, '\n');

  // Remove temporary <bq> tags
  html = html.replace(/<\/?bq>/g, '');

  // Paragraphs
  return html
    .split('\n\n')
    .map((p: string) => {
      const trimmed = p.trim();
      if (!trimmed || /^<(h[1-6]|ul|pre|img|blockquote)/.exec(trimmed)) return trimmed;
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
