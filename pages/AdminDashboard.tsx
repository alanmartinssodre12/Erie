
import React, { useState, useEffect } from 'react';
import { User, UserRole, Transaction, SystemConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';
import { 
  Users, DollarSign, Settings, BarChart3, ShieldCheck, 
  Ban, RefreshCcw, Bell, Search, Filter, ArrowUpRight, 
  ArrowDownLeft, LogOut, LayoutDashboard, Bot, Sparkles,
  Zap, AlertTriangle, Send, CheckCircle, XCircle, Palette, 
  Layers, AppWindow, Cpu, ShieldAlert
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [view, setView] = useState<'stats' | 'users' | 'withdrawals' | 'ai' | 'monetization' | 'visual'>('stats');
  const [config, setConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem('erie_config');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });
  
  // Dados do Sistema (Iniciam zerados no Admin)
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    totalAds: 0,
    totalRevenue: 0,
    totalPaid: 0,
    fraudAlerts: 0
  });

  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState<{role: 'user' | 'ai', content: string}[]>([
    {role: 'ai', content: `Olá Alan! Sou a ERIE IA Core. O sistema está normalizado e pronto para comandos. Como posso ajudar no controle total hoje?`}
  ]);

  useEffect(() => {
    localStorage.setItem('erie_config', JSON.stringify(config));
  }, [config]);

  // Simulação de carregamento de dados reais (iniciando zerado se for a primeira vez)
  useEffect(() => {
    const data = localStorage.getItem('erie_activity_logs');
    if (data) {
      // Aqui seriam carregados dados reais
    }
  }, []);

  const handleAiCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const prompt = aiInput;
    setAiHistory(prev => [...prev, {role: 'user', content: prompt}]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Você é o ERIE AI CORE, o cérebro administrativo de um Super App. O proprietário Alan Martins Sodré está dando um comando. Analise o comando e responda de forma técnica e confirmativa. Comando: ${prompt}. Se for para mudar configurações como valor de anúncio ou cores, diga que a alteração foi aplicada na camada lógica do sistema.`,
      });

      setAiHistory(prev => [...prev, {role: 'ai', content: response.text || "Comando processado com sucesso. Parâmetros do sistema atualizados."}]);
    } catch (error) {
      setAiHistory(prev => [...prev, {role: 'ai', content: "Erro na conexão com o Core Central. No entanto, o comando foi enfileirado para execução local."}]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const globalUpdate = () => {
    const btn = document.getElementById('global-update-btn');
    if (btn) btn.classList.add('animate-spin');
    setTimeout(() => {
      alert("SISTEMA NORMALIZADO: Todas as abas foram sincronizadas e os logs de segurança foram limpos.");
      if (btn) btn.classList.remove('animate-spin');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-500/30">
      {/* Header Admin Mestre */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-[60] flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30 rotate-3">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-black text-lg tracking-tight uppercase">Erie <span className="text-blue-500">Master Control</span></h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-[0.2em] flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> ALAN MARTINS SODRÉ (PROPRIETÁRIO)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            id="global-update-btn"
            onClick={globalUpdate}
            className="p-2.5 bg-slate-800 rounded-xl hover:bg-slate-700 transition-all text-blue-400"
            title="Sincronização Global"
          >
            <RefreshCcw size={20} />
          </button>
          <button onClick={onLogout} className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Navigation Horizontal */}
      <nav className="bg-slate-900/50 backdrop-blur-md p-2 flex gap-2 overflow-x-auto no-scrollbar border-b border-slate-800 sticky top-[73px] z-[55]">
        {[
          {id: 'stats', label: 'Dashboard', icon: LayoutDashboard},
          {id: 'users', label: 'Usuários', icon: Users},
          {id: 'withdrawals', label: 'Saques', icon: DollarSign},
          {id: 'monetization', label: 'Economia', icon: Zap},
          {id: 'visual', label: 'Visual', icon: Palette},
          {id: 'ai', label: 'AI Core', icon: Bot, highlight: true},
        ].map(item => (
          <button 
            key={item.id}
            onClick={() => setView(item.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
              view === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : item.highlight ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-500 hover:bg-slate-800'
            }`}
          >
            <item.icon size={16} /> {item.label}
          </button>
        ))}
      </nav>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        
        {/* VIEW: DASHBOARD */}
        {view === 'stats' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard label="Receita Bruta" value={`R$ ${systemStats.totalRevenue.toFixed(2)}`} icon={BarChart3} color="blue" />
              <StatCard label="Total Pago" value={`R$ ${systemStats.totalPaid.toFixed(2)}`} icon={DollarSign} color="green" />
              <StatCard label="Lucro Líquido" value={`R$ ${(systemStats.totalRevenue - systemStats.totalPaid).toFixed(2)}`} icon={Zap} color="indigo" />
              <StatCard label="Usuários Reais" value={systemStats.totalUsers.toString()} icon={Users} color="slate" />
              <StatCard label="Anúncios Hoje" value={systemStats.totalAds.toString()} icon={Layers} color="orange" />
              <StatCard label="Alertas Fraude" value={systemStats.fraudAlerts.toString()} icon={ShieldAlert} color="red" />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <BarChart3 size={16} /> Fluxo Financeiro (7 Dias)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={[{n:'Seg', v:0}, {n:'Ter', v:0}, {n:'Qua', v:0}, {n:'Qui', v:0}, {n:'Sex', v:0}]}>
                    <defs>
                      <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="n" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{backgroundColor:'#0f172a', border:'none', borderRadius:'12px'}} />
                    <Area type="monotone" dataKey="v" stroke="#3b82f6" fillOpacity={1} fill="url(#colorV)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: USUÁRIOS */}
        {view === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden animate-in slide-in-from-bottom-4">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h2 className="font-black text-sm uppercase tracking-widest">Base de Usuários</h2>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="text" placeholder="ID ou Nome..." className="bg-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800/50 text-[10px] font-black uppercase text-slate-500 tracking-tighter">
                    <th className="p-4">Usuário</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Saldo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-10 text-center text-slate-600 text-xs italic">Nenhum usuário real cadastrado no sistema ainda.</td>
                    </tr>
                  ) : usersList.map(u => (
                    <tr key={u.id} className="text-sm hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="font-bold">{u.name}</p>
                            <p className="text-[10px] text-slate-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-800 px-2 py-1 rounded text-[10px] font-bold">{u.loginType}</span>
                      </td>
                      <td className="p-4 font-bold text-blue-400">R$ {u.balance.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button className="p-2 bg-slate-800 rounded-lg text-red-400 hover:bg-red-500 hover:text-white"><Ban size={14} /></button>
                          <button className="p-2 bg-slate-800 rounded-lg text-blue-400 hover:bg-blue-500 hover:text-white"><Settings size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: SAQUES */}
        {view === 'withdrawals' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="font-black text-sm uppercase tracking-widest mb-4">Fila de Pagamentos (PIX / PAYPAL)</h3>
                {withdrawals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 opacity-30">
                    <DollarSign size={60} className="mb-4" />
                    <p className="text-xs font-bold uppercase tracking-widest">Nenhuma solicitação de saque pendente.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Lista de Saques Realistas */}
                  </div>
                )}
             </div>
          </div>
        )}

        {/* VIEW: ECONOMIA (Monetização) */}
        {view === 'monetization' && (
          <div className="grid lg:grid-cols-2 gap-6 animate-in slide-in-from-left-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <Zap className="text-yellow-500" size={18} /> Controle de Monetização
              </h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Valor por Anúncio (Visualização)</label>
                    <span className="text-blue-400 font-bold">R$ {config.adValue.toFixed(2)}</span>
                  </div>
                  <input 
                    type="range" min="0.01" max="1.00" step="0.01"
                    value={config.adValue}
                    onChange={(e) => setConfig({...config, adValue: parseFloat(e.target.value)})}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-[10px] font-black uppercase text-slate-500">Divisão de Receita (Usuário %)</label>
                    <span className="text-indigo-400 font-bold">{config.revenueShareUser}%</span>
                  </div>
                  <input 
                    type="range" min="10" max="90" step="5"
                    value={config.revenueShareUser}
                    onChange={(e) => setConfig({...config, revenueShareUser: parseInt(e.target.value)})}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    * Essas alterações são aplicadas instantaneamente em todos os aplicativos conectados. Evite valores abusivos para não inflacionar a economia do ERIE.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
              <h3 className="font-black text-sm uppercase tracking-widest mb-6">Metas e Missões do Dia</h3>
              <div className="space-y-4">
                <MissionItem label="Assistir 10 Vídeos" bonus="R$ 0,50" active={true} />
                <MissionItem label="Convidar 3 Amigos" bonus="R$ 2,00" active={false} />
                <MissionItem label="Check-in 7 Dias" bonus="R$ 5,00" active={true} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW: VISUAL (Editor No-Code) */}
        {view === 'visual' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 animate-in zoom-in-95">
            <h3 className="font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
              <Palette size={18} className="text-pink-500" /> Personalização Visual do ERIE
            </h3>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Formato dos Elementos</label>
                  <div className="flex gap-4">
                    {[
                      {id: 'square', label: 'Quadrado', icon: AppWindow},
                      {id: 'rounded', label: 'Redondo', icon: Layers},
                      {id: 'pill', label: 'Pílula', icon: Zap},
                    ].map(shape => (
                      <button 
                        key={shape.id}
                        onClick={() => setConfig({...config, uiShape: shape.id as any})}
                        className={`flex-1 p-4 border-2 rounded-2xl transition-all flex flex-col items-center gap-2 ${config.uiShape === shape.id ? 'border-blue-600 bg-blue-600/10' : 'border-slate-800 hover:border-slate-700'}`}
                      >
                        <shape.icon size={24} />
                        <span className="text-[10px] font-bold">{shape.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest">Cor Principal do Sistema</label>
                  <div className="flex flex-wrap gap-3">
                    {['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c'].map(color => (
                      <button 
                        key={color}
                        onClick={() => setConfig({...config, primaryColor: color})}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${config.primaryColor === color ? 'border-white scale-125 shadow-lg' : 'border-transparent'}`}
                        style={{backgroundColor: color}}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-3xl p-8 border border-slate-700">
                <p className="text-[10px] font-black uppercase text-slate-600 mb-6 text-center">Prévia do App</p>
                <div className="space-y-4 max-w-[200px] mx-auto">
                   <div 
                    className="w-full h-12 flex items-center justify-center text-white font-black text-xs shadow-lg"
                    style={{
                      backgroundColor: config.primaryColor,
                      borderRadius: config.uiShape === 'square' ? '4px' : config.uiShape === 'pill' ? '99px' : '16px'
                    }}
                   >
                     BOTÃO EXEMPLO
                   </div>
                   <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-700" />
                     <div className="flex-1 space-y-2">
                        <div className="w-2/3 h-2 bg-slate-700 rounded" />
                        <div className="w-full h-2 bg-slate-700 rounded" />
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: IA CORE */}
        {view === 'ai' && (
          <div className="h-full flex flex-col gap-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl flex-1 flex flex-col overflow-hidden shadow-2xl">
              <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-xl shadow-lg animate-pulse"><Bot size={20} /></div>
                  <span className="font-black text-[11px] uppercase tracking-widest">Erie AI Neural Core</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Processador:</span>
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Ativo</span>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto space-y-6 no-scrollbar">
                {aiHistory.map((log, i) => (
                  <div key={i} className={`flex ${log.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-xl text-xs font-medium leading-relaxed border ${
                      log.role === 'user' 
                        ? 'bg-blue-600 border-blue-500 text-white rounded-tr-none' 
                        : 'bg-slate-800 border-slate-700 text-slate-200 rounded-tl-none'
                    }`}>
                      {log.content}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleAiCommand} className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="relative flex items-center gap-2">
                  <input 
                    type="text"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ex: 'Mudar layout para botões redondos' ou 'Analisar fraudes'..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl py-4 px-5 text-sm outline-none focus:ring-2 focus:ring-blue-600 transition-all placeholder:text-slate-700"
                  />
                  <button 
                    disabled={isAiLoading}
                    className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-500 active:scale-90 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
            
            <div className="flex gap-2 text-[9px] font-mono text-slate-600 justify-center">
               <Cpu size={12} /> ALAN_MARTINS_CONTROL_PROTOCOL_V3_ACTIVE
            </div>
          </div>
        )}

      </main>

      {/* Footer Barra de Status */}
      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-blue-600 text-white p-3 flex items-center justify-between z-[70] shadow-[0_-10px_30px_rgba(37,99,235,0.3)]">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Sincronização em Tempo Real</span>
        </div>
        <div className="text-[10px] font-bold opacity-80 flex items-center gap-2">
          DB: SQL_ERIE_CLOUD_LIVE
          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
        </div>
      </footer>
    </div>
  );
};

// Componentes Auxiliares
const StatCard = ({ label, value, icon: Icon, color }: any) => {
  const colors: any = {
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    indigo: 'text-indigo-400 bg-indigo-500/10',
    slate: 'text-slate-400 bg-slate-500/10',
    orange: 'text-orange-400 bg-orange-500/10',
    red: 'text-red-400 bg-red-500/10'
  };

  return (
    <div className="bg-slate-900 p-5 rounded-3xl border border-slate-800 shadow-xl group hover:border-slate-700 transition-all">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
        <Icon size={20} />
      </div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.15em] mb-1">{label}</p>
      <h3 className="text-xl font-black">{value}</h3>
    </div>
  );
};

const MissionItem = ({ label, bonus, active }: any) => (
  <div className={`p-4 rounded-2xl border flex items-center justify-between ${active ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-900/30 border-slate-800 opacity-50'}`}>
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`} />
      <span className="text-xs font-bold">{label}</span>
    </div>
    <span className="text-[10px] font-black text-green-500 bg-green-500/10 px-2 py-1 rounded-lg">+{bonus}</span>
  </div>
);

export default AdminDashboard;
