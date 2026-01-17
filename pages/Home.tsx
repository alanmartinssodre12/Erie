
import React, { useState } from 'react';
import { User as UserType } from '../types.ts';
import { 
  Calendar, Play, TrendingUp, Star, Gift, ShieldAlert, 
  Heart, MessageCircle, Share2, PlusSquare, PlayCircle,
  Flame, Award
} from 'lucide-react';

interface HomeProps {
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
}

const Home: React.FC<HomeProps> = ({ user, setUser }) => {
  const [tab, setTab] = useState<'feed' | 'reels'>('feed');
  const [checkingIn, setCheckingIn] = useState(false);

  const handleCheckIn = () => {
    setCheckingIn(true);
    setTimeout(() => {
      setUser(prev => prev ? {
        ...prev,
        balance: prev.balance + 0.50,
        checkInStreak: prev.checkInStreak + 1,
        lastCheckIn: new Date().toISOString()
      } : null);
      setCheckingIn(false);
    }, 1200);
  };

  return (
    <div className="min-h-full pb-20">
      {/* Tab Selector */}
      <div className="flex items-center justify-center bg-white sticky top-0 z-40 border-b border-slate-50">
        <button 
          onClick={() => setTab('feed')}
          className={`px-6 py-3 text-sm font-bold transition-all relative ${tab === 'feed' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          Feed
          {tab === 'feed' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
        </button>
        <button 
          onClick={() => setTab('reels')}
          className={`px-6 py-3 text-sm font-bold transition-all relative ${tab === 'reels' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          Reels
          {tab === 'reels' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
        </button>
      </div>

      {tab === 'feed' ? (
        <div className="p-4 space-y-6 animate-in slide-in-from-left-2 duration-300">
          {/* Daily Check-in Compact */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-2xl shadow-lg text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg"><Award size={24} /></div>
              <div>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Missão Diária</p>
                <p className="text-sm font-bold">Check-in: Dia {user.checkInStreak + 1}</p>
              </div>
            </div>
            <button 
              disabled={checkingIn}
              onClick={handleCheckIn}
              className="bg-white text-blue-600 text-xs font-black px-4 py-2 rounded-full shadow-md active:scale-95 disabled:opacity-50"
            >
              {checkingIn ? '...' : 'COLETAR'}
            </button>
          </div>

          {/* Social Feed Posts */}
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={`https://picsum.photos/seed/${i+50}/100`} className="w-10 h-10 rounded-full border border-slate-100" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">Criador_Erie_{i}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Postado há {i*10} min • 🔥 Trending</p>
                  </div>
                </div>
                <button className="text-blue-600 font-bold text-xs px-3 py-1 bg-blue-50 rounded-full">Seguir</button>
              </div>
              <div className="aspect-square bg-slate-50">
                <img src={`https://picsum.photos/seed/post${i+100}/800/800`} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-slate-700">
                    <button className="flex items-center gap-1.5 active:scale-125 transition-transform"><Heart size={22} /><span className="text-xs font-bold">{i*42}</span></button>
                    <button className="flex items-center gap-1.5"><MessageCircle size={22} /><span className="text-xs font-bold">{i*12}</span></button>
                    <button className="active:scale-110 transition-transform"><Share2 size={22} /></button>
                  </div>
                  <div className="flex items-center gap-1 text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                    <Flame size={14} fill="currentColor" />
                    <span className="text-[10px] font-black">+R$ 0,02</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">
                  <span className="font-bold text-slate-800 mr-2">Criador_Erie_{i}</span>
                  Incrível como o novo sistema de recompensas do ERIE está funcionando! Já fiz meu primeiro saque via Pix hoje. 🚀 #ERIE #Monetização
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[calc(100vh-100px)] bg-black relative flex flex-col animate-in slide-in-from-right-2 duration-300">
          {/* Simulated Vertical Video Player */}
          <div className="flex-1 overflow-hidden relative">
            <img src="https://picsum.photos/seed/reels1/1080/1920" className="w-full h-full object-cover opacity-80" />
            
            {/* Reel UI Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 text-white bg-gradient-to-t from-black/80 via-transparent to-transparent">
              <div className="flex items-end justify-between">
                <div className="flex-1 space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <img src="https://picsum.photos/seed/auth1/100" className="w-10 h-10 rounded-full border-2 border-white shadow-xl" />
                    <span className="font-bold text-sm shadow-sm">Alan_ERIE</span>
                    <button className="text-[10px] font-bold bg-blue-600 px-2 py-1 rounded-md">SEGUE</button>
                  </div>
                  <p className="text-xs leading-relaxed max-w-[80%] shadow-sm">Testando os novos efeitos visuais do ERIE Super App. A qualidade está incrível! 🔥🎬 #Reels #AI</p>
                  <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1 rounded-md animate-bounce"><Award size={14} /></div>
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ganhando R$ 0,01 por visualização</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-6 items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-md active:scale-125 transition-transform"><Heart size={24} fill="white" /></div>
                    <span className="text-[10px] font-bold">12.4K</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-md"><MessageCircle size={24} fill="white" /></div>
                    <span className="text-[10px] font-bold">856</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="bg-white/10 p-3 rounded-full backdrop-blur-md"><Share2 size={24} fill="white" /></div>
                    <span className="text-[10px] font-bold">2.1K</span>
                  </div>
                  <div className="w-10 h-10 bg-slate-800 rounded-lg border-2 border-white/50 animate-spin-slow overflow-hidden">
                    <img src="https://picsum.photos/seed/music/50" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 w-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-progress"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
