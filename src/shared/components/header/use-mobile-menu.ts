import { useEffect, useState } from 'react';

export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);

  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isOpen && isMobile) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = ''; }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const toggle = () =>
    setIsOpen(prev => {
      if (prev) setActiveAccordion(null);
      return !prev;
    });

  const close = () => {
    setIsOpen(false);
    setActiveAccordion(null);
  };

  const onAccordion = (item: string) =>
    setActiveAccordion(prev => (prev === item ? null : item));

  return { isOpen, activeAccordion, toggle, close, onAccordion };
}
