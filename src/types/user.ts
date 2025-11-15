export interface User {
  id?: number;
  name?: string;
  email: string;
  password?: string; // Password should be optional as it should not be stored in the client-side user object
  role?: 'admin' | 'account_user' | 'client' | 'partner';
}
