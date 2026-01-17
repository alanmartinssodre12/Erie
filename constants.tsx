
import { User, UserRole, SystemConfig } from './types.ts';

export const ADMIN_EMAIL = 'alanmarttinssodre1251@gmail.com';
export const ADMIN_IDENTIFIER = 'AErie2143658709@';
export const ADMIN_OWNER_NAME = 'Alan Martins Sodré';

export const DEFAULT_CONFIG: SystemConfig = {
  revenueShareUser: 70,
  adValue: 0.15,
  minWithdrawal: 20.00,
  uiShape: 'rounded',
  primaryColor: '#2563eb',
};

export const MOCK_USER: User = {
  id: 'user_new',
  username: 'usuario_erie',
  name: 'Usuário ERIE',
  email: '',
  role: UserRole.USER,
  balance: 0.00,
  pendingBalance: 0.00,
  checkInStreak: 0,
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Erie',
  createdAt: new Date().toISOString(),
  status: 'active',
  loginType: 'email',
  totalAdsWatched: 0,
  fraudScore: 0,
  settings: {
    notifications: true,
    privateProfile: false,
    twoFactor: false
  }
};

export const MOCK_ADMIN: User = {
  id: 'admin_master',
  username: 'alan_erie',
  name: ADMIN_OWNER_NAME,
  email: ADMIN_EMAIL,
  role: UserRole.ADMIN,
  balance: 0.00,
  pendingBalance: 0.00,
  checkInStreak: 0,
  createdAt: new Date().toISOString(),
  status: 'active',
  loginType: 'email',
  totalAdsWatched: 0,
  fraudScore: 0,
  settings: {
    notifications: true,
    privateProfile: true,
    twoFactor: true
  }
};
