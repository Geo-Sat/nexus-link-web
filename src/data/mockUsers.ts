import { User } from '@/types/user'; // Assuming a User type exists

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Admin User',
    username: 'admin',
    password: 'password',
    role: 'admin',
  },
  {
    id: 2,
    name: 'Front Office User',
    username: 'frontoffice',
    password: 'password',
    role: 'front_office',
  },
  {
    id: 3,
    name: 'Client User',
    username: 'client',
    password: 'password',
    role: 'client',
  },
  {
    id: 4,
    name: 'Partner User',
    username: 'partner',
    password: 'password_role',
    role: 'partner',
  },
];
