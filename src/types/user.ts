export type UserRole = 'admin' | 'staff' | 'account_user' | 'account_admin' | 'partner_admin';
// const roles = ['admin', 'staff', 'account_user', 'account_admin', 'partner_admin'];

export interface User {
  id?: number;
  name?: string;
  email: string;
  password?: string; // Password should be optional as it should not be stored in the client-side user object
  role?: UserRole;
}

export type UserProfile = Omit<User, 'password'>;
