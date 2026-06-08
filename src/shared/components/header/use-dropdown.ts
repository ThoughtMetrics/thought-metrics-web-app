import { useEffect, useMemo, useRef, useState } from 'react';
import { headerDropdownData } from './header.constant';

const CLOSE_DELAY_MS = 300;

export function useDropdown() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const clearTimer = () => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  };

  const open = (item: string) => {
    clearTimer();
    setActiveDropdown(item);
  };

  const startClose = () => {
    timerRef.current = setTimeout(() => setActiveDropdown(null), CLOSE_DELAY_MS);
  };

  const close = () => {
    clearTimer();
    setActiveDropdown(null);
  };

  const activeSection = useMemo(
    () => headerDropdownData.sections.find(s => s.title === activeDropdown),
    [activeDropdown],
  );

  return {
    activeDropdown,
    isOpen: activeDropdown !== null,
    activeSection,
    open,
    startClose,
    cancelClose: clearTimer,
    close,
  };
}
