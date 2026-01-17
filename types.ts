
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface SystemConfig {
  revenueShareUser: number;
  adValue: number;
  minWithdrawal: number;
  uiShape: 'rounded' | 'square' | 'pill';
  primaryColor: string;
}

export interface User {
  id: string;
  username: string; // @username único
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
  settings: {
    notifications: boolean;
    privateProfile: boolean;
    twoFactor: boolean;
  }
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userUsername: string; // Adicionado para referência
  userAvatar?: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'text';
  likes: string[];
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

export interface ChatThread {
  participantId: string;
  participantName: string;
  participantUsername: string;
  participantAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
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

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

export interface SupportTicket {
  id: string | number;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  timestamp: string;
}
