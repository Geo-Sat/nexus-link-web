import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const routeTitles: Record<string, string> = {
  'dashboard': 'Dashboard',
  'maps': 'Maps',
  'partners': 'Partners',
  'tracking': 'Vehicles',
  'accounts': 'Accounts',
  'assets': 'Assets',
  'trips': 'Trip History',
  'zones': 'Geofence Zones',
  'alerts': 'Alerts',
  'reports': 'Reports',
  'settings': 'Settings',
  'profile': 'Profile',
  'billing': 'Billing',
};

interface PageHeaderProps {
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ className }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  
  // Get current page title
  const currentPage = pathSegments[pathSegments.length - 1] || '';
  const pageTitle = routeTitles[currentPage] || 'Dashboard';

  return (
    <div className={cn('space-y-1', className)}>
      {/* Breadcrumb */}
      <nav className="flex items-center text-sm text-muted-foreground">
        <Link 
          to="/" 
          className="flex items-center hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
        </Link>
        
        {pathSegments.map((segment, index) => (
          <React.Fragment key={segment}>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link
              to={`/${pathSegments.slice(0, index + 1).join('/')}`}
              className={cn(
                'hover:text-foreground transition-colors',
                index === pathSegments.length - 1 && 'text-foreground'
              )}
            >
              {routeTitles[segment] || segment}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
    </div>
  );
};
