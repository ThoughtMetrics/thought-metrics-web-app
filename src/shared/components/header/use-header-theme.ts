import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tm-theme';

export function useHeaderTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as 'dark' | 'light' | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return {
    theme,
    toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')),
  };
}
