
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
          totalAdsWatched: user.totalAdsWatched + 1
        };
        setUser(updatedUser);
      }
      setShowAd(false);
    }, 5500);
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 flex justify-around items-center py-3 px-2 shadow-[0_-8px_20px_-10px_rgba(0,0,0,0.1)] z-[60]">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Home size={22} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">Início</span>
        </NavLink>
        
        <NavLink 
          to="/wallet" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <Wallet size={22} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">Saldo</span>
        </NavLink>

        <div className="relative -top-6">
          <button 
            onClick={handleStartAd}
            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl border-[6px] border-white transform active:scale-90 transition-all hover:bg-blue-700 group"
          >
             <PlayCircle size={32} fill="white" />
          </button>
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-black text-blue-700 whitespace-nowrap uppercase tracking-[0.2em]">ADSENSE</span>
        </div>

        <NavLink 
          to="/chat/list" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <MessageSquare size={22} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">Chat</span>
        </NavLink>

        <NavLink 
          to="/profile" 
          className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-all ${isActive ? 'text-blue-600 scale-110' : 'text-slate-400'}`}
        >
          <UserIcon size={22} />
          <span className="text-[9px] mt-1 font-black uppercase tracking-widest">Perfil</span>
        </NavLink>
      </div>

      {showAd && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-white">
          <div className="absolute top-8 right-8 bg-white/10 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-white/5">
            Ganhando R$ 0,15 em {Math.ceil((100 - adProgress)/20)}s
          </div>
          <div className="w-full max-w-2xl aspect-video bg-slate-900 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 relative overflow-hidden border border-white/5 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="relative z-10 text-center p-8">
               <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white font-black text-4xl italic mb-6 shadow-2xl">E</div>
               <h3 className="text-3xl font-black tracking-tighter mb-2">ERIE ADS CORE</h3>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Sincronizando com Google AdSense Server...</p>
            </div>
            <div className="absolute bottom-0 left-0 h-2 bg-blue-500 transition-all duration-100" style={{ width: `${adProgress}%` }}></div>
          </div>
          <p className="mt-12 text-xs font-black text-blue-500 animate-pulse uppercase tracking-[0.5em]">Processando Recompensa...</p>
        </div>
      )}
    </>
  );
};

export default BottomNav;
