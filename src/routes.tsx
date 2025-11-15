import React from 'react';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { MapsPage } from './pages/maps/Maps.tsx';
import { TripsPage } from './pages/Trips';
import { AssetsPage } from './pages/Assets';
import { AccountsPage } from './pages/accounts/Accounts.tsx';
import { TrackingPage } from './pages/Tracking';
import { LandingPage } from './pages/Landing';
import NotFound from './pages/NotFound';

// Define a type for our route objects for better type safety
interface AppRoute {
  path: string;
  element: React.ReactNode;
  title?: string; // Added title for sidebar
  section?: string; // Added section for sidebar grouping
  isPrivate?: boolean;
  roles?: string[]; // Added roles for RBAC
  redirectTo?: string; // For redirects like '/' to '/landing'
}

export const appRoutes: AppRoute[] = [
  {
    path: '/login',
    element: <LoginPage />,
    isPrivate: false,
  },
  {
    path: '/landing',
    element: <LandingPage />,
    isPrivate: false,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
    title: 'Dashboard',
    isPrivate: true,
    roles: ['admin', 'account_user', 'client', 'partner'],
  },
  {
    path: '/maps',
    element: <MapsPage />,
    title: 'Maps',
    isPrivate: true,
    roles: ['admin', 'front_office'],
  },
  {
    path: '/tracking',
    element: <TrackingPage />,
    title: 'Vehicles',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'front_office', 'client', 'partner'],
  },
  {
    path: '/accounts',
    element: <AccountsPage />,
    title: 'Accounts',
    section: 'App',
    isPrivate: true,
    roles: ['admin'],
  },
  {
    path: '/assets',
    element: <AssetsPage />,
    title: 'Assets Info',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'front_office'],
  },
  {
    path: '/trips',
    element: <TripsPage />,
    title: 'Trips',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'front_office', 'client', 'partner'],
  },
  {
    path: '/zones',
    element: <NotFound />,
    title: 'Zones',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'front_office'],
  },
  {
    path: '/alerts',
    element: <NotFound />,
    title: 'Alerts',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'front_office', 'client', 'partner'],
  },
  {
    path: '/reports',
    element: <NotFound />,
    title: 'Reports',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'front_office'],
  },
  {
    path: '/settings',
    element: <NotFound />,
    title: 'Settings',
    section: 'Account',
    isPrivate: true,
    roles: ['admin', 'front_office', 'client', 'partner'],
  },
  {
    path: '/profile',
    element: <NotFound />,
    title: 'Profile',
    section: 'Account',
    isPrivate: true,
    roles: ['admin', 'front_office', 'client', 'partner'],
  },
  {
    path: '/',
    element: null,
    isPrivate: false,
    redirectTo: '/maps',
  },
  {
    path: '*',
    element: <NotFound />,
    isPrivate: false,
  },
];