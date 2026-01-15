import React from 'react';
import { LoginPage } from './pages/Login';
import { DashboardPage } from './pages/Dashboard';
import { MapsPage } from './pages/maps/Maps.tsx';
import { AccountsPage } from './pages/accounts/Accounts.tsx';
import { PartnersPage } from "@/pages/partners/Partners.tsx";
import { AssetsPage } from "@/pages/assets/Assets.tsx";
import NotFound from './pages/NotFound';


interface AppRoute {
  path: string;
  element: React.ReactNode;
  title?: string;
  section?: string;
  isPrivate?: boolean;
  roles?: string[];
  redirectTo?: string;
}

export const appRoutes: AppRoute[] = [
  {
    path: '/login',
    element: <LoginPage />,
    isPrivate: false,
  },
  {
      path: '/dashboard',
      element: <DashboardPage />,
      title: 'Dashboard',
      section: 'Home',
      isPrivate: true,
      roles: ['admin', 'staff', 'account_user', 'account_admin', 'partner_admin']
  },
  {
      path: '/maps',
      element: <MapsPage />,
      title: 'Maps',
      section: 'Home',
      isPrivate: true,
    roles: ['admin', 'staff', 'account_user', 'account_admin', 'partner_admin'],
  },
  {
    path: '/partners',
    element: <PartnersPage />,
    title: 'Partners',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'staff'],
  },
  {
    path: '/accounts',
    element: <AccountsPage />,
    title: 'Accounts',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'staff'],
  },
  {
    path: '/assets',
    element: <AssetsPage />,
    title: 'Assets Info',
    section: 'App',
    isPrivate: true,
    roles: ['admin', 'staff', 'account_user', 'account_admin', 'partner_admin'],
  },
  // {
  //   path: '/trips',
  //   element: <TripsPage />,
  //   title: 'Trips',
  //   section: 'App',
  //   isPrivate: true,
  //   roles: ['admin', 'staff', 'account_user', 'account_admin', 'partner_admin'],
  // },
  // {
  //   path: '/zones',
  //   element: <NotFound />,
  //   title: 'Zones',
  //   section: 'App',
  //   isPrivate: true,
  //   roles: ['admin', 'staff'],
  // },
  // {
  //   path: '/alerts',
  //   element: <NotFound />,
  //   title: 'Alerts',
  //   section: 'App',
  //   isPrivate: true,
  //   roles: ['admin', 'staff'],
  // },
  // {
  //   path: '/reports',
  //   element: <NotFound />,
  //   title: 'Reports',
  //   section: 'App',
  //   isPrivate: true,
  //   roles: ['admin', 'staff'],
  // },
  // {
  //   path: '/settings',
  //   element: <NotFound />,
  //   title: 'Settings',
  //   section: 'Account',
  //   isPrivate: true,
  //   roles: ['admin', 'staff', 'account_user', 'account_admin', 'partner_admin'],
  // },
  {
    path: '/profile',
    element: <NotFound />,
    title: 'Profile',
    section: 'User Account',
    isPrivate: true,
    roles: ['admin', 'staff', 'account_user', 'account_admin', 'partner_admin'],
  },
  {
    path: '/',
    element: null,
    isPrivate: false,
    redirectTo: '/dashboard',
  },
  {
    path: '*',
    element: <NotFound />,
    isPrivate: false,
  },
];