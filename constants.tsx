
import { User, UserRole, SystemConfig } from './types';

export const ADMIN_IDENTIFIER = 'Erie1986123@';
export const ADMIN_OWNER_NAME = 'Alan Martins Sodré';

export const DEFAULT_CONFIG: SystemConfig = {
  revenueShareUser: 70,
  adValue: 0.15,
  minWithdrawal: 20.00,
  uiShape: 'rounded',
  primaryColor: '#2563eb', // Blue-600
};

export const MOCK_USER: User = {
  id: 'user_1',
  name: 'João Silva',
  email: 'joao@gmail.com',
  role: UserRole.USER,
  balance: 0,
  pendingBalance: 0,
  checkInStreak: 0,
  avatar: 'https://picsum.photos/seed/joao/200',
  createdAt: new Date().toISOString(),
  status: 'active',
  loginType: 'email'
};

export const MOCK_ADMIN: User = {
  id: 'admin_1',
  name: ADMIN_OWNER_NAME,
  email: 'admin@erie.com',
  role: UserRole.ADMIN,
  balance: 0,
  pendingBalance: 0,
  checkInStreak: 0,
  createdAt: '2023-01-01T08:00:00Z',
  status: 'active',
  loginType: 'email'
};
