
import React, { useState, useEffect } from 'react';
import { User, UserRole, Transaction, SystemConfig } from '../types.ts';
import { DEFAULT_CONFIG } from '../constants.tsx';
import { 
  Users, DollarSign, Settings, BarChart3, ShieldCheck, 
  RefreshCcw, LogOut, LayoutDashboard, Bot, Send, Activity, ShieldAlert
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<'stats' | 'users' | 'withdrawals' | 'ai'>('stats');
  const [isApiKeyActive, setIsApiKeyActive] = useState<boolean | null>(null);
  
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalAds: 0,
    totalRevenue: 0.00,
    totalPaid: 0.00,
    fraudAlerts: 0
  });

  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    {role: 'ai', content: `ERIE AI MASTER CORE: Sistema pronto.`}
  ]);

  useEffect(() => {
    const checkApiStatus = async () => {
      const apiKey = (window as any).process?.env?.API_KEY || "";
      if (!apiKey) {
        setIsApiKeyActive(false);
        return;
      }
      try {
        const ai = new GoogleGenAI({ apiKey });
        await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: 'ping',
        });
        setIsApiKeyActive(true);
      } catch (e) {
        setIsApiKeyActive(false);
      }
    };
    checkApiStatus();
  }, []);

  const handleAiCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const apiKey = (window as any).process?.env?.API_KEY || "";
    setAiHistory(prev => [...prev, {role: 'user', content: aiInput}]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: aiInput,
      });
      setAiHistory(prev => [...prev, {role: 'ai', content: response.text || "OK"}]);
    } catch (error) {
      setAiHistory(prev => [...prev, {role: 'ai', content: "Erro de conexão."}]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col">
      <header className="bg-slate-900 border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">E</div>
          <div>
            <h1 className="font-bold text-lg">Admin ERIE</h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-widest">Master: Alan Martins</p>
          </div>
        </div>
        <button onClick={onLogout} className="p-2 text-red-500"><LogOut size={20} /></button>
      </header>

      <nav className="flex gap-2 p-3 bg-slate-900/50">
        {['stats', 'users', 'withdrawals', 'ai'].map(id => (
          <button 
            key={id}
            onClick={() => setView(id as any)}
            className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase ${view === id ? 'bg-blue-600' : 'text-slate-500'}`}
          >
            {id}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        {view === 'stats' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase">Receita</p>
              <h2 className="text-xl font-bold">R$ 0,00</h2>
            </div>
            <div className="bg-slate-900 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] text-slate-500 uppercase">Usuários</p>
              <h2 className="text-xl font-bold">0</h2>
            </div>
          </div>
        )}
        
        {view === 'ai' && (
          <div className="bg-slate-900 rounded-2xl flex flex-col h-[400px]">
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
              {aiHistory.map((h, i) => (
                <div key={i} className={h.role === 'user' ? 'text-right' : 'text-left'}>
                  <span className={`inline-block p-2 rounded-lg ${h.role === 'user' ? 'bg-blue-600' : 'bg-slate-800'}`}>
                    {h.content}
                  </span>
                </div>
              ))}
            </div>
            <form onSubmit={handleAiCommand} className="p-3 border-t border-white/5 flex gap-2">
              <input 
                className="flex-1 bg-black rounded-lg p-2 text-xs outline-none" 
                value={aiInput} 
                onChange={e => setAiInput(e.target.value)} 
                placeholder="Comando..."
              />
              <button className="bg-blue-600 p-2 rounded-lg"><Send size={16} /></button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-slate-900 p-5 rounded-2xl border border-white/5">
    <Icon size={20} className="mb-2" />
    <p className="text-[10px] text-slate-500 uppercase">{label}</p>
    <h3 className="text-xl font-bold">{value}</h3>
  </div>
);

export default AdminDashboard;
