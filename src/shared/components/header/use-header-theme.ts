import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/providers/auth-provider';
import ApiService from '@/services/api/api.service';

const STORAGE_KEY = 'tm-theme';

export function useHeaderTheme() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(
    () => (localStorage.getItem(STORAGE_KEY) as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (user) {
      ApiService.patch('/users/profile/patch', {
        settings: { preferences: { theme: next } },
      }).catch(() => {});
    }
  };

  return { theme, toggle };
}
