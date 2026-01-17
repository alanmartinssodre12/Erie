
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Notification } from '../types.ts';
import { LogOut, ShieldCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastClickTime = useRef<number>(0);

  useEffect(() => {
    // Atualiza contador de notificações não lidas
    const checkNotifications = () => {
      const saved = JSON.parse(localStorage.getItem('erie_notifications') || '[]');
      const unread = saved.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // Função secreta para Alan acessar o Admin sem digitar URL
  const handleSecretClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount === 5) {
        setClickCount(0);
        navigate('/admin-access-erie');
      }
    } else {
      setClickCount(1);
    }
    lastClickTime.current = now;
  };

  return (
    <nav className="bg-white border-b border-slate-100 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <div 
        className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-all hover:scale-105" 
        onClick={handleSecretClick}
        title="Toque 5 vezes para acesso restrito"
      >
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl italic shadow-lg shadow-blue-900/10">E</div>
        <span className="font-black text-xl tracking-tighter text-slate-800 italic">ERIE</span>
      </div>

      <div className="flex items-center gap-2">
        {user.role === UserRole.ADMIN && (
          <button 
            onClick={() => navigate('/admin-panel-erie-1986')}
            className="p-2.5 text-blue-600 bg-blue-50 rounded-xl transition-all hover:bg-blue-100"
            title="Painel Administrativo"
          >
            <ShieldCheck size={20} />
          </button>
        )}
        <button 
          onClick={() => navigate('/profile/notifications')}
          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative"
          title="Notificações"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
               <span className="text-[8px] text-white font-black">{unreadCount > 9 ? '9+' : unreadCount}</span>
            </div>
          )}
        </button>
        <div className="w-[1px] h-6 bg-slate-100 mx-1"></div>
        <button 
          onClick={onLogout}
          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
