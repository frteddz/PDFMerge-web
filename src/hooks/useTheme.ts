import { useState, useCallback, useEffect } from 'react';

export interface ThemeState {
  theme: 'light' | 'dark';
  isDark: boolean;
  toggleTheme: () => void;
}

export function useTheme(): ThemeState {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('pdfmerge-theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('pdfmerge-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, isDark: theme === 'dark', toggleTheme };
}
