export interface User {
  id: number;
  name: string;
  username: string;
  password?: string; // Password should be optional as it should not be stored in the client-side user object
  role: 'admin' | 'front_office' | 'client' | 'partner';
}
