
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { MOCK_ADMIN, ADMIN_IDENTIFIER } from '../constants';
import { ShieldCheck, Lock, Mail, ChevronRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (user: User) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [showId, setShowId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Simulação de autenticação de segurança reforçada para Alan Martins Sodré
    setTimeout(() => {
      // Aceita o email do mock ou o email padrão de admin definido no requisito
      if ((email === 'admin@erie.com' || email === 'alan.erie@admin.com') && identifier === ADMIN_IDENTIFIER) {
        onLogin(MOCK_ADMIN);
        navigate('/admin-panel-erie-1986');
      } else {
        setError(true);
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white font-sans overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 animate-pulse"></div>
      
      <div className="w-full max-w-sm space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 rotate-3 border border-white/10 relative">
             <ShieldCheck size={40} className="text-white" />
             <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-950"></div>
          </div>
          <h1 className="text-2xl font-black tracking-tighter mt-4">ERIE SECURE ACCESS</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-4 py-1 bg-slate-900 rounded-full inline-block">Acesso Exclusivo: Proprietário</p>
        </div>

        <form onSubmit={handleAdminAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">E-mail Administrativo</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@erie.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-700 focus:ring-1 focus:ring-blue-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Identificador Admin</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                type={showId ? "text" : "password"}
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Identificador Erie..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-12 text-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-700 focus:ring-1 focus:ring-blue-500/50"
              />
              <button 
                type="button"
                onClick={() => setShowId(!showId)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
              >
                {showId ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 flex items-center gap-3 animate-shake">
              <AlertCircle size={20} />
              <div className="text-[10px] font-bold uppercase tracking-widest">
                Acesso negado.<br/>Verifique suas credenciais.
              </div>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                AUTENTICAR SISTEMA
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        <div className="pt-8 text-center border-t border-slate-900">
            <p className="text-[9px] text-slate-600 font-medium leading-relaxed max-w-[200px] mx-auto">
              SISTEMA ERIE V2.5<br />
              PROTEÇÃO ATIVA CONTRA ACESSOS NÃO AUTORIZADOS.
            </p>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] text-slate-800 font-mono">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        SECURE_CONNECTION_ESTABLISHED
      </div>
    </div>
  );
};

export default AdminLogin;
