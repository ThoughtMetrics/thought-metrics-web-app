import React, { useState, useEffect } from 'react';
import '../../../../styles/markdown.css';
import { extractHeadings, parseMarkdown } from '@/core/utils/markdown';

const MarkDownOrganism: React.FC<{ content: string; showTOC: boolean }> = ({
  content,
  showTOC = false,
}) => {
  const [activeHeading, setActiveHeading] = useState('');

  const headings = extractHeadings(content);
  const htmlContent = parseMarkdown(content);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' }
    );

    setTimeout(() => {
      document
        .querySelectorAll('h1, h2, h3, h4, h5, h6')
        .forEach((el) => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section className="">
      {showTOC && (
        <nav className="hidden md:block p-4 overflow-y-auto shrink-0">
          {headings.map((heading, i) => (
            <button
              key={i}
              onClick={() => scrollTo(heading.id)}
              className={`block w-full text-left py-1 px-2 text-sm rounded transition-colors ${
                heading.level === 1
                  ? 'pl-0'
                  : heading.level === 2
                    ? 'pl-4'
                    : 'pl-8'
              } ${
                activeHeading === heading.id
                  ? 'bg-blue-50 text-blue-700 font-medium'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {heading.text}
            </button>
          ))}
        </nav>
      )}
      <div
        className="prose bg-transparent"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </section>
  );
};
export default MarkDownOrganism;
