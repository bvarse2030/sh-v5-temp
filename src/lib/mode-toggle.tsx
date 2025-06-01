'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ModeToggle() {
  const { setTheme, theme, resolvedTheme } = useTheme();

  const handleToggle = () => {
    // Use resolvedTheme to get the actual theme when theme is 'system'
    const currentTheme = resolvedTheme || theme;

    if (currentTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  // Use resolvedTheme for display logic
  const isDark = (resolvedTheme || theme) === 'light';

  return (
    <div onClick={handleToggle} className="cursor-pointer">
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      )}
    </div>
  );
}
