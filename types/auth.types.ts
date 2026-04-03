export enum Role {
  CEO = 'CEO',
  SALES_ENGINEER = 'Sales Engineer',
  SALES_MANAGER = 'Sales Manager',
  PROCUREMENT_OFFICER = 'Procurement Officer',
  LOGISTICS_OFFICER = 'Logistics Officer',
  ACCOUNTS = 'Accounts',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}
