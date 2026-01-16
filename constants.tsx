
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

// Em produção, esses mocks seriam substituídos por dados do banco.
// Para o proprietário, garantimos que o saldo comece em zero.
export const MOCK_USER: User = {
  id: 'user_new',
  name: 'Usuário ERIE',
  email: '',
  role: UserRole.USER,
  balance: 0.00, // RIGOROSAMENTE ZERADO
  pendingBalance: 0.00,
  checkInStreak: 0,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erie',
  createdAt: new Date().toISOString(),
  status: 'active',
  loginType: 'email'
};

export const MOCK_ADMIN: User = {
  id: 'admin_master',
  name: ADMIN_OWNER_NAME,
  email: 'admin@erie.com',
  role: UserRole.ADMIN,
  balance: 0.00,
  pendingBalance: 0.00,
  checkInStreak: 0,
  createdAt: new Date().toISOString(),
  status: 'active',
  loginType: 'email'
};
