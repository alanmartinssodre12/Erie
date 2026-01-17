
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types.ts';
import { MOCK_ADMIN, ADMIN_IDENTIFIER, ADMIN_EMAIL, ADMIN_OWNER_NAME } from '../constants.tsx';
import { ShieldCheck, Lock, Mail, ChevronRight, Eye, EyeOff, AlertCircle, Terminal, HelpCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: User) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [showId, setShowId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const navigate = useNavigate();

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Validação estrita contra as credenciais fornecidas pelo proprietário
    setTimeout(() => {
      if (email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase() && identifier === ADMIN_IDENTIFIER) {
        onLogin(MOCK_ADMIN);
        navigate('/admin-panel-erie-1986');
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden relative">
      {/* Background Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950"></div>
      
      <div className="w-full max-w-sm space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 animate-pulse border border-blue-400/30">
             <ShieldCheck size={48} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic">ERIE SECURE ACCESS</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.4em] mt-2">AUTENTICAÇÃO DO PROPRIETÁRIO</p>
          </div>
        </div>

        <form onSubmit={handleAdminAuth} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-2xl flex flex-col gap-2 text-xs font-bold animate-in zoom-in shadow-lg">
               <div className="flex items-center gap-3">
                 <AlertCircle size={20} className="shrink-0" /> 
                 <span>ACESSO NEGADO: Credenciais inválidas para o núcleo master.</span>
               </div>
               <button type="button" onClick={() => setShowHint(true)} className="text-[9px] text-blue-400 underline uppercase mt-1 text-left ml-8">Verificar credenciais padrão?</button>
            </div>
          )}

          {showHint && (
            <div className="bg-blue-600 p-4 rounded-2xl text-[10px] font-bold text-white leading-relaxed animate-in slide-in-from-top-4">
               <div className="flex items-center gap-2 mb-2">
                 <HelpCircle size={14}/> <span>DICA DE ACESSO:</span>
               </div>
               Utilize o e-mail <strong>{ADMIN_EMAIL}</strong> e sua senha de 12+ dígitos que termina em "@".
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">E-mail do Administrador</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu_email@gmail.com"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">Identificador Mestre</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type={showId ? "text" : "password"}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Insira sua senha AErie..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-5 pl-12 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono placeholder:text-slate-700"
              />
              <button 
                type="button"
                onClick={() => setShowId(!showId)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showId ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-3 mt-6 border border-blue-400/20"
          >
            {loading ? (
              <>
                <Terminal size={20} className="animate-bounce" />
                <span>AUTENTICANDO...</span>
              </>
            ) : (
              <>
                <span>ENTRAR NO NÚCLEO ERIE</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] opacity-50">
           Área exclusiva para {ADMIN_OWNER_NAME}
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
