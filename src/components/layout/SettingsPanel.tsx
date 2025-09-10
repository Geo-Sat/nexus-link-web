import React from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Label } from '../ui/label';
import { Settings, Sun, Moon, ArrowLeftRight, LayoutPanelTop, LayoutPanelLeft } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

import { useLayoutConfig } from '@/stores/layout';

export const SettingsPanel = () => {
  const { navPosition, direction, setNavPosition, setDirection } = useLayoutConfig();
  const { theme, setTheme } = useTheme();

  const onNavPositionChange = (position: 'left' | 'top') => {
    setNavPosition(position);
  };

  const onDirectionChange = (direction: 'ltr' | 'rtl') => {
    setDirection(direction);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>
        <div className="py-6 space-y-6">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <div className="text-sm text-muted-foreground">
                Switch between dark and light mode
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  {theme === 'light' ? (
                      <Sun className="h-5 w-5" />
                  ) : (
                      <Moon className="h-5 w-5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme('light')}>
                      <Sun className="mr-2 h-4 w-4" />
                      <span>Light</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>
                      <Moon className="mr-2 h-4 w-4" />
                      <span>Dark</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>System</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Navigation Position */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Navigation Position</Label>
              <div className="text-sm text-muted-foreground">
                Choose sidebar or topbar navigation
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavPositionChange(navPosition === 'left' ? 'top' : 'left')}
            >
              {navPosition === 'left' ? (
                <LayoutPanelTop className="h-5 w-5" />
              ) : (
                <LayoutPanelLeft className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Direction Toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Text Direction</Label>
              <div className="text-sm text-muted-foreground">
                Switch between LTR and RTL
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDirectionChange(direction === 'ltr' ? 'rtl' : 'ltr')}
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
