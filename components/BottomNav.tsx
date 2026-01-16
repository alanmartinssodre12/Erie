
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Wallet, Home, User, PlayCircle } from 'lucide-react';

const BottomNav: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 flex justify-around items-center py-2 px-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
      <NavLink 
        to="/" 
        className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <Home size={22} />
        <span className="text-[10px] mt-1 font-medium">Início</span>
      </NavLink>
      
      <NavLink 
        to="/wallet" 
        className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <Wallet size={22} />
        <span className="text-[10px] mt-1 font-medium">Carteira</span>
      </NavLink>

      <div className="relative -top-6">
        <button className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white transform active:scale-95 transition-transform">
           <PlayCircle size={30} fill="currentColor" className="text-white" />
        </button>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-800 whitespace-nowrap">GANHAR</span>
      </div>

      <NavLink 
        to="/chat/list" 
        className={({ isActive }) => `flex flex-col items-center p-2 rounded-xl transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400'}`}
      >
        <MessageSquare size={22} />
        <span className="text-[10px] mt-1 font-medium">Chat</span>
      </NavLink>

      <button className="flex flex-col items-center p-2 rounded-xl text-slate-400">
        <User size={22} />
        <span className="text-[10px] mt-1 font-medium">Perfil</span>
      </button>
    </div>
  );
};

export default BottomNav;
