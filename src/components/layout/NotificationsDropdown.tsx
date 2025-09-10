import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

export const NotificationsDropdown = () => {
  const notifications = [
    {
      id: 1,
      title: 'Speed Alert',
      description: 'Vehicle KBZ 111A exceeded speed limit',
      time: '2 mins ago',
      type: 'alert'
    },
    {
      id: 2,
      title: 'Maintenance Due',
      description: 'Vehicle KCF 223B requires service',
      time: '1 hour ago',
      type: 'maintenance'
    },
    {
      id: 3,
      title: 'Geofence Alert',
      description: 'Vehicle KDE 445C left designated area',
      time: '3 hours ago',
      type: 'alert'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
          >
            {notifications.length}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map(notification => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">{notification.title}</span>
              <span className="text-xs text-muted-foreground">{notification.time}</span>
            </div>
            <span className="text-sm text-muted-foreground">{notification.description}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center text-primary">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
