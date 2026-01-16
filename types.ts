
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface SystemConfig {
  revenueShareUser: number; // % para o usuário
  adValue: number; // R$ por anúncio
  minWithdrawal: number;
  uiShape: 'rounded' | 'square' | 'pill';
  primaryColor: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  balance: number;
  pendingBalance: number;
  checkInStreak: number;
  lastCheckIn?: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'blocked';
  loginType: 'google' | 'email';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: string;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'reward' | 'withdrawal' | 'checkin';
  status: 'pending' | 'completed' | 'rejected';
  method?: 'Pix' | 'PayPal' | 'PagBank';
  date: string;
}
