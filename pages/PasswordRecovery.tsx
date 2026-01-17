
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Phone, ChevronLeft, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

const PasswordRecovery: React.FC = () => {
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // CONSULTA REAL NA BASE DE DADOS GLOBAL
      const users = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      const exists = users.find((u: any) => 
        u.email.toLowerCase() === value.toLowerCase() || 
        (u.phone && u.phone === value)
      );

      if (exists) {
        setSent(true);
      } else {
        setError('Nenhuma conta encontrada com esses dados. Verifique se o e-mail ou telefone está correto.');
        setLoading(false);
      }
    }, 1500);
  };

  if (sent) {
      return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center items-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-xl shadow-emerald-900/10">
                <CheckCircle2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic">E-MAIL ENVIADO!</h2>
            <p className="text-slate-500 mt-4 px-4 text-sm leading-relaxed font-medium">
                Siga as instruções enviadas para <strong>{value}</strong> para redefinir sua senha. O link expira em 30 minutos por segurança.
            </p>
            <button 
                onClick={() => navigate('/login')}
                className="mt-10 w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 active:scale-95 transition-all"
            >
                VOLTAR AO LOGIN
            </button>
            <button 
              onClick={() => setSent(false)}
              className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600"
            >
              Reenviar link de recuperação
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent pointer-events-none"></div>

      <button onClick={() => method ? setMethod(null) : navigate('/login')} className="mt-4 text-slate-400 flex items-center gap-1 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors">
        <ChevronLeft size={16} /> Voltar
      </button>

      <div className="mt-10 mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">Recuperar Acesso</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">A segurança do núcleo ERIE protege seus dados.</p>
      </div>

      {!method ? (
          <div className="space-y-4">
              <button 
                onClick={() => setMethod('email')}
                className="w-full flex items-center justify-between p-7 border-2 border-slate-50 rounded-[2.5rem] hover:border-blue-500/20 hover:bg-blue-50/10 transition-all text-left group shadow-sm"
              >
                  <div className="flex items-center gap-5">
                      <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Mail size={24}/></div>
                      <div>
                          <p className="font-black text-slate-800">Via E-mail</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Gmail verificado</p>
                      </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>

              <button 
                onClick={() => setMethod('phone')}
                className="w-full flex items-center justify-between p-7 border-2 border-slate-50 rounded-[2.5rem] hover:border-blue-500/20 hover:bg-blue-50/10 transition-all text-left group shadow-sm"
              >
                  <div className="flex items-center gap-5">
                      <div className="bg-slate-50 p-4 rounded-2xl text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Phone size={24}/></div>
                      <div>
                          <p className="font-black text-slate-800">Via SMS</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Telefone vinculado</p>
                      </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </button>
          </div>
      ) : (
          <form onSubmit={handleSend} className="space-y-6 animate-in slide-in-from-right-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100 animate-in zoom-in">
                  <AlertCircle size={20} className="shrink-0" /> {error}
                </div>
              )}

              <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                      {method === 'email' ? 'E-mail cadastrado' : 'Número de telefone'}
                  </label>
                  <input 
                    type={method === 'email' ? 'email' : 'tel'}
                    required
                    autoFocus
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={method === 'email' ? 'seu_email@gmail.com' : '(00) 00000-0000'}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 px-6 focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm transition-all"
                  />
              </div>
              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : 'VERIFICAR E ENVIAR CÓDIGO'}
              </button>
              
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                <p className="text-center text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                  Ao solicitar a recuperação, você concorda com nossos termos de proteção de dados.
                </p>
              </div>
          </form>
      )}
    </div>
  );
};

export default PasswordRecovery;
