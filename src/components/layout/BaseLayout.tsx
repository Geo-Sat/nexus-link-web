import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { CollapsibleSearchbar } from './CollapsibleSearchbar';
import { SettingsPanel } from './SettingsPanel';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Maximize2 } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useLayoutConfig } from '@/stores/layout';
import { TopNavigation } from './TopNavigation';
import { PageHeader } from './PageHeader';
import { UserDropdown } from './UserDropdown';

export function BaseLayout({ children, setRunTour }: { children: React.ReactNode, setRunTour: (run: boolean) => void }) {
  const { navPosition, direction } = useLayoutConfig();
  const { theme, setTheme } = useTheme();

  // Apply theme on mount and change
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div dir={direction}>
      <div className={cn(
        'flex min-h-screen bg-background',
        navPosition === 'top' && 'flex-col'
      )}>
        {navPosition === 'left' && (
          <div className="sticky top-0 h-screen flex-none">
            <Sidebar />
          </div>
        )}
        
        <div className="flex-1">
          {/* Top Bar */}
          <div className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-20 items-center justify-between px-4 pr-6">
              <div className="flex items-center gap-4">
                {navPosition === 'top' ? <TopNavigation /> : <PageHeader />}
              </div>

              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRunTour(true)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Start Tour
                </Button>
                <CollapsibleSearchbar />
                <NotificationsDropdown />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <UserDropdown />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 p-4">
            {navPosition === 'top' && <PageHeader className="px-4" />}
            {children}
          </main>
        </div>
      </div>

      <SettingsPanel />
    </div>
  );
}
