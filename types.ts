
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
  bio?: string;
  role: UserRole;
  avatar?: string;
  balance: number;
  pendingBalance: number;
  checkInStreak: number;
  lastCheckIn?: string;
  createdAt: string;
  status: 'active' | 'suspended' | 'blocked';
  loginType: 'google' | 'email';
  totalAdsWatched: number;
  fraudScore: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  likes: string[]; // IDs dos usuários que curtiram
  comments: PostComment[];
  timestamp: string;
  type: 'feed' | 'reel';
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  timestamp: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'reward' | 'withdrawal' | 'checkin';
  status: 'pending' | 'completed' | 'rejected';
  method?: 'Pix' | 'PayPal' | 'PagBank';
  pixKey?: string;
  date: string;
}

export interface SystemStats {
  totalUsers: number;
  activeToday: number;
  totalAds: number;
  totalRevenue: number;
  totalPaid: number;
  fraudAlerts: number;
}
