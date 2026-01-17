
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
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white">
          <div className="absolute top-8 right-8 bg-zinc-800 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border border-zinc-700">
            Recompensa em {Math.ceil((100 - adProgress)/20)}s
          </div>
          
          <div className="w-full max-w-xl aspect-square md:aspect-video bg-white rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
             {/* Container limpo para anúncios automáticos do Google ou Vinhetas */}
             <div className="text-center p-6 opacity-40">
                <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Publicidade Google</p>
                <div className="w-10 h-1 bg-slate-200 mx-auto rounded-full"></div>
             </div>
             
             {/* Barra de progresso da recompensa */}
             <div className="absolute bottom-0 left-0 h-1.5 bg-blue-600 transition-all duration-100" style={{ width: `${adProgress}%` }}></div>
          </div>
          
          <p className="mt-8 text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">AdSense Secured</p>
        </div>
      )}
    </>
  );
};

export default BottomNav;
