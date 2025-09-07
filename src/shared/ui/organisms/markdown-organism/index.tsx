import React, { useState, useEffect } from 'react';
import '../../../../styles/markdown.css';
import { extractHeadings, parseMarkdown } from '@/core/utils/markdown';
import { cn } from '@/core/utils/cn';

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
    <section className="grid grid-cols-1 md:grid-cols-[25%_75%] gap-6">
      <div className="">
        {showTOC && (
          <nav className="hidden md:block p-4 overflow-y-auto shrink-0 sticky top-0">
            {headings.map(
              (heading, i) =>
                2 >= heading.level && (
                  <button
                    key={i + heading.id}
                    onClick={() => scrollTo(heading.id)}
                    className={cn(
                      'block w-full text-left py-1 px-2 text-sm transition-colors border-l-4',
                      activeHeading === heading.id
                        ? 'border-primary font-medium'
                        : 'border-custom-grey-1'
                    )}
                  >
                    {heading.text}
                  </button>
                )
            )}
          </nav>
        )}
      </div>
      <div className="">
        <p
          className="prose bg-transparent"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
};
export default MarkDownOrganism;
