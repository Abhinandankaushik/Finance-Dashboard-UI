import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DarkModeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="group relative h-9 w-9 rounded-lg transition-all duration-200 hover:bg-primary/10 active:scale-95 dark:hover:bg-primary/20"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
    >
      <div className="relative inline-flex items-center justify-center">
        {dark ? (
          <Sun className="absolute h-4 w-4 animate-theme-icon text-yellow-500" />
        ) : (
          <Moon className="absolute h-4 w-4 animate-theme-icon text-slate-600" />
        )}
      </div>
    </Button>
  );
}
