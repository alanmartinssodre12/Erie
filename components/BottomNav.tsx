
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Wallet, Home, User as UserIcon, PlayCircle, X } from 'lucide-react';
import { User } from '../types.ts';

interface BottomNavProps {
  user?: User;
  setUser?: (u: User) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ user, setUser }) => {
  const [showAd, setShowAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);

  const handleStartAd = () => {
    setShowAd(true);
    setAdProgress(0);
    const interval = setInterval(() => {
      setAdProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 100);

    setTimeout(() => {
      if (user && setUser) {
        const updatedUser = {
          ...user,
          balance: user.balance + 0.15,
          pendingBalance: user.pendingBalance + 0.05
        };
        setUser(updatedUser);
      }
      setShowAd(false);
    }, 5500);
  };

  return (
    <>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-100 flex justify-around items-center py-2 px-2 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)] z-50">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Home size={22} variant={location.pathname === '/' ? 'fill' : 'outline'} />
          <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Início</span>
        </NavLink>
        
        <NavLink 
          to="/wallet" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Wallet size={22} />
          <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Carteira</span>
        </NavLink>

        <div className="relative -top-5">
          <button 
            onClick={handleStartAd}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl border-[6px] border-white transform active:scale-90 transition-all hover:bg-blue-700 group"
          >
             <PlayCircle size={32} fill="white" className="group-hover:scale-110 transition-transform" />
          </button>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-blue-700 whitespace-nowrap uppercase tracking-widest">GANHAR</span>
        </div>

        <NavLink 
          to="/chat/list" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <MessageSquare size={22} />
          <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Mensagens</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <UserIcon size={22} />
          <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Perfil</span>
        </NavLink>
      </div>

      {/* Ad Simulation Modal */}
      {showAd && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-white max-w-md mx-auto">
          <div className="absolute top-4 right-4 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold">
            Ganhando R$ 0,15 em {Math.ceil((100 - adProgress)/20)}s
          </div>
          <div className="w-full aspect-video bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden">
            <img src="https://picsum.photos/seed/ad/800/450" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="relative z-10 text-center p-4">
               <h3 className="text-xl font-black italic mb-2">ERIE ADS</h3>
               <p className="text-sm opacity-80">Conheça o novo sistema de monetização digital.</p>
            </div>
            {/* Ad Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-100" style={{ width: `${adProgress}%` }}></div>
          </div>
          <p className="mt-8 text-xs font-bold text-slate-400 animate-pulse">ASSISTINDO ANÚNCIO...</p>
        </div>
      )}
    </>
  );
};

export default BottomNav;
