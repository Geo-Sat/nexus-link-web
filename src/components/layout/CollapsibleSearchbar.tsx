import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CollapsibleSearchbar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex items-center">
      <div
        className={cn(
          'flex items-center transition-all duration-300 overflow-hidden',
          isExpanded ? 'w-[300px]' : 'w-0'
        )}
      >
        <Input
          type="search"
          placeholder="Search..."
          className="w-full"
          autoFocus={isExpanded}
        />
        {isExpanded && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0"
            onClick={() => setIsExpanded(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {!isExpanded && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(true)}
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
