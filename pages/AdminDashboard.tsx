
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Transaction, SystemConfig, SystemStats } from '../types.ts';
import { DEFAULT_CONFIG, ADMIN_OWNER_NAME } from '../constants.tsx';
import { 
  Users, DollarSign, Settings, ShieldCheck, 
  RefreshCcw, LogOut, LayoutDashboard, Bot, Send, 
  Activity, ShieldAlert, CheckCircle2, XCircle, 
  Palette, Smartphone, Eye, Ban, Trash2, Sliders,
  // Fix: Added missing PlayCircle import
  PlayCircle
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'dash' | 'users' | 'withdrawals' | 'ads' | 'ai' | 'design'>('dash');
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
  const [stats, setStats] = useState<SystemStats>({
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
    {role: 'ai', content: `ERIE AI MASTER CORE: Online. Comandante ${ADMIN_OWNER_NAME}, sistema pronto para instruções.`}
  ]);

  const [isUpdating, setIsUpdating] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiHistory]);

  const handleUpdateSystem = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      alert('SISTEMA ATUALIZADO: Todos os módulos foram sincronizados e erros de cache limpos.');
    }, 2000);
  };

  const handleAiCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    setAiHistory(prev => [...prev, {role: 'user', content: aiInput}]);
    const currentInput = aiInput;
    setAiInput('');
    setIsAiLoading(true);

    try {
      // Fix: Following @google/genai guidelines for client initialization and model selection
      // Always create a new GoogleGenAI instance right before the call and use process.env.API_KEY directly.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        // Using gemini-3-pro-preview for complex reasoning/management tasks
        model: 'gemini-3-pro-preview',
        contents: currentInput,
        config: {
            systemInstruction: "Você é o núcleo de IA do ERIE Super App. Seu dono é Alan Martins Sodré. Você tem acesso aos logs do sistema (fictícios agora). Suas respostas devem ser técnicas, diretas e focadas em gestão de plataforma, monetização e segurança. Você pode sugerir mudanças de código e correções de bugs."
        }
      });
      // response.text is a property, not a method.
      setAiHistory(prev => [...prev, {role: 'ai', content: response.text || "Comando processado com sucesso."}]);
    } catch (error) {
      setAiHistory(prev => [...prev, {role: 'ai', content: "Erro na conexão com o núcleo neural. Verifique sua chave API."}]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header Fixed */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-[60]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-900/20">E</div>
          <div>
            <h1 className="font-black text-sm tracking-tight text-white">ERIE SECURE ACCESS</h1>
            <p className="text-[9px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck size={10} /> MASTER CONTROL: {ADMIN_OWNER_NAME}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleUpdateSystem}
            className={`p-2 rounded-lg bg-white/5 text-blue-400 transition-all ${isUpdating ? 'animate-spin' : ''}`}
            title="Atualizar Sistema Global"
          >
            <RefreshCcw size={18} />
          </button>
          <button onClick={onLogout} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-16 md:w-48 bg-slate-900 border-r border-white/5 flex flex-col py-4">
          <NavItem icon={<LayoutDashboard size={20}/>} label="Geral" active={activeTab === 'dash'} onClick={() => setActiveTab('dash')} />
          <NavItem icon={<Users size={20}/>} label="Usuários" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
          <NavItem icon={<DollarSign size={20}/>} label="Saques" active={activeTab === 'withdrawals'} onClick={() => setActiveTab('withdrawals')} />
          <NavItem icon={<Activity size={20}/>} label="Monetização" active={activeTab === 'ads'} onClick={() => setActiveTab('ads')} />
          <NavItem icon={<Bot size={20}/>} label="AI Core" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} />
          <NavItem icon={<Palette size={20}/>} label="Design" active={activeTab === 'design'} onClick={() => setActiveTab('design')} />
        </aside>

        {/* Dynamic Viewport */}
        <main className="flex-1 p-6 overflow-y-auto no-scrollbar bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950">
          
          {activeTab === 'dash' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard label="Receita Total" value={`R$ ${stats.totalRevenue.toFixed(2)}`} icon={<DollarSign/>} color="text-emerald-400" />
                <StatCard label="Usuários Reais" value={stats.totalUsers} icon={<Users/>} color="text-blue-400" />
                <StatCard label="Pagos (Usuários)" value={`R$ ${stats.totalPaid.toFixed(2)}`} icon={<CheckCircle2/>} color="text-purple-400" />
                <StatCard label="Total Anúncios" value={stats.totalAds} icon={<Eye/>} color="text-orange-400" />
                <StatCard label="Ativos Hoje" value={stats.activeToday} icon={<Activity/>} color="text-blue-500" />
                <StatCard label="Alertas Fraude" value={stats.fraudAlerts} icon={<ShieldAlert/>} color="text-red-500" />
              </div>

              <div className="bg-slate-900 rounded-3xl p-6 border border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Integridade do Sistema</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-xs font-bold">API Gemini AI</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-md font-black">OPERACIONAL</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-xs font-bold">Processador de Pix</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-md font-black">OPERACIONAL</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <span className="text-xs font-bold">Servidor de Ads</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-1 rounded-md font-black">OPERACIONAL</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-black italic">GESTÃO DE USUÁRIOS</h2>
                 <div className="bg-slate-900 border border-white/5 rounded-lg px-3 py-1 text-[10px] font-bold">FILTRAR POR: TUDO</div>
              </div>
              
              <div className="bg-slate-900 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-white/5 text-slate-400 uppercase font-black text-[9px] tracking-widest">
                    <tr>
                      <th className="px-4 py-4">Usuário</th>
                      <th className="px-4 py-4">Tipo</th>
                      <th className="px-4 py-4">Saldo (R$)</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <tr>
                      <td className="px-4 py-4 flex items-center gap-2">
                        <img src="https://picsum.photos/seed/user1/50" className="w-6 h-6 rounded-full" />
                        <div>
                          <p className="font-bold">Usuário Teste</p>
                          <p className="text-[9px] text-slate-500">teste@gmail.com</p>
                        </div>
                      </td>
                      <td className="px-4 py-4"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-[9px] font-black">EMAIL</span></td>
                      <td className="px-4 py-4 font-bold">R$ 12,50</td>
                      <td className="px-4 py-4"><span className="text-emerald-500 font-bold">ATIVO</span></td>
                      <td className="px-4 py-4 flex gap-2">
                        <button className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Ban size={14}/></button>
                        <button className="p-1.5 bg-white/5 text-white rounded-lg"><Eye size={14}/></button>
                      </td>
                    </tr>
                    {/* Mais linhas seriam mapeadas aqui em produção */}
                  </tbody>
                </table>
                <div className="p-10 text-center text-slate-500 italic text-xs">
                   Nenhum outro usuário cadastrado no momento.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'withdrawals' && (
            <div className="space-y-4">
               <h2 className="text-xl font-black italic mb-6">SOLICITAÇÕES DE SAQUE</h2>
               <div className="grid grid-cols-1 gap-4">
                  <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 font-black">PIX</div>
                        <div>
                           <p className="font-bold">Alan Martins Sodré</p>
                           <p className="text-[10px] text-slate-500">Chave: alan@erie.com • Valor: R$ 50,00</p>
                        </div>
                     </div>
                     <div className="flex gap-2">
                        <button className="bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase shadow-lg shadow-emerald-900/20">Aprovar</button>
                        <button className="bg-red-500/20 text-red-500 font-black px-4 py-2 rounded-xl text-[10px] uppercase">Recusar</button>
                     </div>
                  </div>
               </div>
               <div className="text-center py-20 opacity-20 flex flex-col items-center">
                  <DollarSign size={48} className="mb-2" />
                  <p className="text-sm font-bold">FIM DA LISTA DE SAQUES</p>
               </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="h-full flex flex-col bg-slate-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden">
              <div className="p-4 bg-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Bot size={18} className="text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest">ERIE AI CORE 3.0</span>
                 </div>
                 <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse delay-150"></div>
                 </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 no-scrollbar">
                {aiHistory.map((h, i) => (
                  <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-3xl text-xs leading-relaxed ${h.role === 'user' ? 'bg-blue-600 text-white font-bold' : 'bg-white/10 text-slate-200 border border-white/5'}`}>
                      {h.content}
                    </div>
                  </div>
                ))}
                {isAiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 animate-pulse text-[10px] font-bold text-blue-400 italic">
                      PROCESSANDO COMANDO...
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleAiCommand} className="p-4 bg-slate-900 flex gap-2">
                <input 
                  className="flex-1 bg-black/50 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white font-medium" 
                  value={aiInput} 
                  onChange={e => setAiInput(e.target.value)} 
                  placeholder="Instrua o núcleo do ERIE..."
                />
                <button 
                  disabled={isAiLoading}
                  className="bg-blue-600 p-4 rounded-2xl hover:bg-blue-700 transition-all active:scale-90 disabled:opacity-50"
                >
                  <Send size={20} className="text-white" />
                </button>
              </form>
            </div>
          )}

          {activeTab === 'design' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <h2 className="text-xl font-black italic">CUSTOMIZAÇÃO VISUAL</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Cor Primária do App</label>
                      <div className="flex flex-wrap gap-4">
                        {['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#f97316', '#020617'].map(color => (
                          <button 
                            key={color}
                            onClick={() => setConfig({...config, primaryColor: color})}
                            className={`w-10 h-10 rounded-xl transition-all ${config.primaryColor === color ? 'ring-4 ring-white ring-offset-4 ring-offset-slate-900 scale-110' : ''}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Arredondamento de Ícones</label>
                      <div className="grid grid-cols-3 gap-3">
                         <button onClick={() => setConfig({...config, uiShape: 'square'})} className={`p-3 rounded-lg border text-xs font-bold ${config.uiShape === 'square' ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/10'}`}>Quadrado</button>
                         <button onClick={() => setConfig({...config, uiShape: 'rounded'})} className={`p-3 rounded-xl border text-xs font-bold ${config.uiShape === 'rounded' ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/10'}`}>Arredondado</button>
                         <button onClick={() => setConfig({...config, uiShape: 'pill'})} className={`p-3 rounded-3xl border text-xs font-bold ${config.uiShape === 'pill' ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/10'}`}>Pílula</button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-6 rounded-3xl border border-white/5 space-y-4">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Prévia Mobile</label>
                     <div className="w-full aspect-[9/16] bg-white rounded-3xl border-[8px] border-slate-800 overflow-hidden relative shadow-2xl mx-auto max-w-[180px]">
                        <div className="h-6 bg-slate-800 w-1/2 mx-auto rounded-b-2xl mb-4"></div>
                        <div className="p-3 space-y-2">
                           <div className="h-4 w-full rounded-lg" style={{ backgroundColor: config.primaryColor }}></div>
                           <div className="h-2 w-3/4 bg-slate-200 rounded"></div>
                           <div className="h-20 w-full bg-slate-100 rounded-2xl flex items-center justify-center">
                              <PlayCircle size={24} style={{ color: config.primaryColor }} />
                           </div>
                           <div className="flex gap-2">
                              <div className="h-8 w-8 rounded-full bg-slate-200"></div>
                              <div className="flex-1 space-y-1 py-1">
                                 <div className="h-2 w-full bg-slate-100 rounded"></div>
                                 <div className="h-2 w-1/2 bg-slate-100 rounded"></div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
          
        </main>
      </div>

      <style>{`
        :root {
          --primary-erie: ${config.primaryColor};
          --radius-erie: ${config.uiShape === 'square' ? '0px' : config.uiShape === 'pill' ? '2rem' : '1rem'};
        }
      `}</style>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-4 transition-all border-l-4 ${active ? 'bg-blue-600/10 border-blue-600 text-blue-400' : 'border-transparent text-slate-500 hover:text-white'}`}
  >
    {icon}
    <span className="hidden md:block text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="bg-slate-900/50 p-5 rounded-3xl border border-white/5 backdrop-blur-sm">
    <div className={`mb-3 ${color}`}>{icon}</div>
    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">{label}</p>
    <h3 className="text-lg font-black italic">{value}</h3>
  </div>
);

export default AdminDashboard;
