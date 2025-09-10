import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const SlideOver: React.FC<SlideOverProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className
}) => {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-full',
        'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div 
        className={cn(
          'absolute inset-0 bg-background/80 backdrop-blur-sm',
          isOpen ? 'opacity-100' : 'opacity-0',
          'transition-opacity duration-300'
        )}
        onClick={onClose}
      />

      {/* Content */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-auto',
          className
        )}
      >
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col bg-background border-l shadow-xl">
            {/* Header */}
            <div className="px-4 sm:px-6 py-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Body */}
            <div className="relative flex-1 px-4 sm:px-6 overflow-y-auto">
              <div className="py-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
