import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Map,
  LayoutDashboard,
  Settings,
  Users,
  Car,
  Bell,
  Folder,
  List,
  Globe,
  File,
  Group
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  to: string;
}

const NavItem = ({ icon, title, to }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm',
          isActive
            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
            : 'text-muted-foreground hover:bg-accent/50',
        )
      }
    >
      {icon}
      <span>{title}</span>
    </NavLink>
  );
};

export const TopNavigation = () => {
  return (
    <nav className="flex items-center space-x-4">
      <div className="flex items-center gap-2">
        <img
          src="/logo.png"
          alt="Geosat"
          className="w-32"
        />
      </div>
      <NavItem
        icon={<LayoutDashboard size={18} />}
        title="Dashboard"
        to="/dashboard"
      />
      <NavItem
        icon={<Map size={18} />}
        title="Maps"
        to="/maps"
      />
      <NavItem
        icon={<Car size={18} />}
        title="Vehicles"
        to="/tracking"
      />
      <NavItem
        icon={<Group size={18} />}
        title="Accounts"
        to="/accounts"
      />
      <NavItem
        icon={<Folder size={18} />}
        title="Assets Info"
        to="/assets"
      />
      <NavItem
        icon={<List size={18} />}
        title="Trips"
        to="/trips"
      />
    </nav>
  );
};
