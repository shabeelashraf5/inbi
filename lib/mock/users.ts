import { Role, type User } from '@/types/auth.types';

export const MOCK_USERS: User[] = [
  {
    id: 'usr-001',
    name: 'Adnan Al-Rashid',
    email: 'adnan@inbi.com',
    role: Role.CEO,
    avatar: '',
  },
  {
    id: 'usr-002',
    name: 'Sara Mahmoud',
    email: 'sara@inbi.com',
    role: Role.SALES_ENGINEER,
    avatar: '',
  },
  {
    id: 'usr-003',
    name: 'Omar Farooq',
    email: 'omar@inbi.com',
    role: Role.SALES_MANAGER,
    avatar: '',
  },
  {
    id: 'usr-004',
    name: 'Fatima Hassan',
    email: 'fatima@inbi.com',
    role: Role.PROCUREMENT_OFFICER,
    avatar: '',
  },
  {
    id: 'usr-005',
    name: 'Khalid Ibrahim',
    email: 'khalid@inbi.com',
    role: Role.LOGISTICS_OFFICER,
    avatar: '',
  },
  {
    id: 'usr-006',
    name: 'Nadia Youssef',
    email: 'nadia@inbi.com',
    role: Role.ACCOUNTS,
    avatar: '',
  },
];

export function getMockUserByRole(role: Role): User | undefined {
  return MOCK_USERS.find((u) => u.role === role);
}
