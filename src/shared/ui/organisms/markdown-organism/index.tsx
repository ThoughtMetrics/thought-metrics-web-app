import React, { useState, useRef, useEffect } from 'react';
import '../../../../styles/markdown.css';
import { extractHeadings, parseMarkdown } from '@/core/utils/markdown';
import { cn } from '@/core/utils/cn';

const MarkDownOrganism: React.FC<{ content: string; showTOC: boolean }> = ({
  content,
  showTOC = false,
}) => {
  const [activeHeading, setActiveHeading] = useState('');
  const contentRef = useRef<HTMLDivElement>(null);

  const headings = extractHeadings(content);
  const htmlContent = parseMarkdown(content);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveHeading(id);
  };

  // Intersection Observer to track active heading
  useEffect(() => {
    if (!showTOC) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all currently intersecting entries
        const intersectingEntries = entries.filter(
          (entry) => entry.isIntersecting
        );

        if (intersectingEntries.length > 0) {
          // Sort by intersection ratio and position to get the most prominent one
          intersectingEntries.sort((a, b) => {
            // First sort by intersection ratio (higher is better)
            if (a.intersectionRatio !== b.intersectionRatio) {
              return b.intersectionRatio - a.intersectionRatio;
            }
            // Then by distance from top (closer to top is better)
            return a.boundingClientRect.top - b.boundingClientRect.top;
          });

          const mostProminentEntry = intersectingEntries[0];
          if (
            mostProminentEntry.target.id &&
            ['H1', 'H2'].includes(mostProminentEntry.target.tagName)
          ) {
            setActiveHeading(mostProminentEntry.target.id);
          }
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: '-10% 0% -50% 0%', // Smaller top margin, larger bottom margin
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], // Multiple thresholds for better detection
      }
    );

    // Alternative approach: Also track when headings leave the viewport
    const handleScroll = () => {
      if (!contentRef.current) return;

      const headingElements = contentRef.current.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      );
      let closestHeading = '';
      let closestDistance = Infinity;

      headingElements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const distanceFromTop = Math.abs(rect.top - 100); // 100px from top

        if (rect.top <= 150 && distanceFromTop < closestDistance) {
          closestDistance = distanceFromTop;
          closestHeading = element.id;
        }
      });

      if (closestHeading && closestHeading !== activeHeading) {
        setActiveHeading(closestHeading);
      }
    };

    // Observe all heading elements after content is rendered
    const timer = setTimeout(() => {
      const headingElements = contentRef.current?.querySelectorAll(
        'h1, h2, h3, h4, h5, h6'
      );
      headingElements?.forEach((el) => observer.observe(el));

      // Also add scroll listener as backup
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [htmlContent, showTOC, activeHeading]);

  return (
    <section
      className={cn(
        'grid grid-cols-1 gap-6',
        showTOC && 'md:grid-cols-[25%_75%]'
      )}
    >
      {showTOC && (
        <div className="">
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
        </div>
      )}
      <div>
        <div
          ref={contentRef}
          className="prose bg-transparent"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </section>
  );
};
export default MarkDownOrganism;
