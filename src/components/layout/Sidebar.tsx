import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLayoutConfig } from '@/stores/layout';
import {
    Map,
    LayoutDashboard,
    Settings,
    ChevronRight,
    ChevronLeft,
    Users,
    Car,
    Bell,
    FileText,
    Folder,
    List,
    Globe,
    File,
    Group, Handshake, GlassesIcon, ListIcon
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useAuth } from '@/lib/auth'; // Import useAuth
import { appRoutes } from '@/routes'; // Import appRoutes

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
  isCollapsed: boolean;
}

const NavItem = ({ icon, title, to, isCollapsed }: NavItemProps) => {
  const location = useLocation();
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'text-muted-foreground hover:bg-accent/50',
          isCollapsed && 'justify-center px-2'
        )
      }
    >
      {icon}
      {!isCollapsed && <span>{title}</span>}
    </NavLink>
  );
};

const iconMapping: { [key: string]: React.ReactNode } = {
    '/dashboard': <LayoutDashboard size={20} />,
    '/maps': <Map size={20} />,
    '/partners': <Handshake size={20} />,
    '/tracking': <Car size={20} />,
    '/accounts': <Group size={20} />,
    '/assets': <ListIcon size={20} />,
    '/trips': <List size={20} />,
    '/zones': <Globe size={20} />,
    '/alerts': <Bell size={20} />,
    '/reports': <File size={20} />,
    '/settings': <Settings size={20} />,
    '/profile': <Users size={20} />,
};

export const Sidebar = () => {
  const { navPosition } = useLayoutConfig();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  const accessibleRoutes = useMemo(() => {
    if (!user) return [];
    return appRoutes.filter(route => {
      if (!route.isPrivate) return false; // Don't show public routes in sidebar
      if (route.roles) {
        return route.roles.includes(user.role);
      }
      return true; // If no roles are specified, show the route
    });
  }, [user]);

  const groupedRoutes = useMemo(() => {
    const groups: { [key: string]: typeof accessibleRoutes } = {};
    accessibleRoutes.forEach(route => {
      const section = route.section || 'General';
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(route);
    });
    return groups;
  }, [accessibleRoutes]);

  return (
    <div
      className={cn(
        'h-full bg-background flex flex-col transition-all duration-300',
        'border-r',
        isCollapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'p-4 flex items-center gap-2',
        isCollapsed && 'justify-center'
      )}>
        <img
          src="/logo.png"
          alt="Geosat"
          className={cn(
            'transition-all duration-300',
            isCollapsed ? 'w-8' : 'w-32'
          )}
        />
      </div>

      {/* Navigation */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {Object.entries(groupedRoutes).map(([section, routes]) => (
          <div key={section} className="mt-4 pt-4 border-t border-border/50 first:mt-0 first:pt-0 first:border-none">
            {section !== 'General' && (
              <div className={cn(
                "text-xs text-muted-foreground mb-2",
                isCollapsed && "text-center"
              )}>
                {section}
              </div>
            )}
            {routes.map(route => (
              route.title && (
                <NavItem
                  key={route.path}
                  icon={iconMapping[route.path] || <FileText size={20} />}
                  title={route.title}
                  to={route.path}
                  isCollapsed={isCollapsed}
                />
              )
            ))}
          </div>
        ))}
      </div>

      {/* Collapse Button */}
      <div className="p-3 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-full"
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </Button>
      </div>
    </div>
  );
};
