import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/hooks/use-theme';

export const Header = () => {
    const { theme, setTheme } = useTheme();

    function cn(...classes: (string | false | null | undefined)[]): string {
        return classes.filter(Boolean).join(' ');
    }
    return (
        <header className="border-b bg-card">
            <div className="flex h-20 items-center justify-between px-4">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon">
                        <i className="fa-solid fa-bars-staggered"></i>
                    </Button>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <i className="fa-solid fa-bell"></i>
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.map((notification, index) => (
                                    <DropdownMenuItem key={index} className="flex flex-col items-start p-3">
                                        <div className="flex w-full items-start gap-2">
                                            <div className={cn(
                                                'mt-0.5 rounded-full p-1',
                                                notification.type === 'alert' ? 'bg-destructive/10 text-destructive' :
                                                    notification.type === 'info' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-primary/10 text-primary'
                                            )}>
                                                <i className={cn(
                                                    'fa-solid',
                                                    notification.type === 'alert' ? 'fa-triangle-exclamation' :
                                                        notification.type === 'info' ? 'fa-info' :
                                                            'fa-check'
                                                )} />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {notification.description}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuItem>
                                ))}
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center font-medium">
                                View all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Theme Switcher */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                {theme === 'light' ? (
                                    <i className="fa-solid fa-sun"></i>
                                ) : (
                                    <i className="fa-solid fa-moon"></i>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTheme('light')}>
                                <i className="fa-solid fa-sun mr-2"></i> Light
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('dark')}>
                                <i className="fa-solid fa-moon mr-2"></i> Dark
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTheme('system')}>
                                <i className="fa-solid fa-desktop mr-2"></i> System
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                                    JD
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">John Doe</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        john@example.com
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <i className="fa-solid fa-user mr-2"></i> Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <i className="fa-solid fa-gear mr-2"></i> Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <i className="fa-solid fa-right-from-bracket mr-2"></i> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

const notifications = [
    {
        type: 'alert',
        title: 'Vehicle Speed Alert',
        description: 'KCA 001A exceeded speed limit of 80 km/h',
        time: '2 minutes ago'
    },
    {
        type: 'info',
        title: 'Maintenance Due',
        description: 'KBZ 205B is due for maintenance in 3 days',
        time: '1 hour ago'
    },
    {
        type: 'success',
        title: 'Route Completed',
        description: 'KCF 789C completed assigned route',
        time: '3 hours ago'
    }
];
