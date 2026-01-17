
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
      // Validação real: Verifica se a conta existe no localStorage
      const users = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      const exists = users.some((u: any) => u.email === value || u.phone === value);

      // Permite teste com admin@erie.com
      if (exists || value === 'admin@erie.com' || value === 'user@erie.com') {
        setSent(true);
      } else {
        setError('Nenhuma conta encontrada com esses dados. Verifique e tente novamente.');
        setLoading(false);
      }
    }, 1500);
  };

  if (sent) {
      return (
        <div className="min-h-screen bg-white p-6 flex flex-col justify-center items-center text-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
                <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Tudo certo!</h2>
            <p className="text-slate-500 mt-4 px-4 text-sm leading-relaxed font-medium">
                Enviamos instruções de recuperação para <strong>{value}</strong>. Por segurança, o link expira em 30 minutos.
            </p>
            <button 
                onClick={() => navigate('/login')}
                className="mt-10 w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100"
            >
                VOLTAR AO LOGIN
            </button>
            <button 
              onClick={() => setSent(false)}
              className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest"
            >
              Reenviar código
            </button>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col max-w-md mx-auto">
      <button onClick={() => method ? setMethod(null) : navigate('/login')} className="mt-4 text-slate-400 flex items-center gap-1 font-bold text-xs uppercase tracking-widest">
        <ChevronLeft size={16} /> Voltar
      </button>

      <div className="mt-10 mb-8">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Recuperar conta</h1>
        <p className="text-slate-500 text-sm mt-2">Segurança em primeiro lugar. Como deseja prosseguir?</p>
      </div>

      {!method ? (
          <div className="space-y-4">
              <button 
                onClick={() => setMethod('email')}
                className="w-full flex items-center justify-between p-6 border-2 border-slate-50 rounded-[2rem] hover:border-blue-500/30 hover:bg-blue-50/10 transition-all text-left group"
              >
                  <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Mail /></div>
                      <div>
                          <p className="font-bold text-slate-800">E-mail</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Via e-mail cadastrado</p>
                      </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => setMethod('phone')}
                className="w-full flex items-center justify-between p-6 border-2 border-slate-50 rounded-[2rem] hover:border-blue-500/30 hover:bg-blue-50/10 transition-all text-left group"
              >
                  <div className="flex items-center gap-4">
                      <div className="bg-slate-50 p-3 rounded-2xl text-slate-600"><Phone /></div>
                      <div>
                          <p className="font-bold text-slate-800">SMS / WhatsApp</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Via telefone verificado</p>
                      </div>
                  </div>
                  <ArrowRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
          </div>
      ) : (
          <form onSubmit={handleSend} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100 animate-pulse">
                  <AlertCircle size={18} /> {error}
                </div>
              )}

              <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
                      {method === 'email' ? 'Confirmar E-mail' : 'Confirmar Telefone'}
                  </label>
                  <input 
                    type={method === 'email' ? 'email' : 'tel'}
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={method === 'email' ? 'exemplo@gmail.com' : '(00) 00000-0000'}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-blue-500/20 outline-none font-medium text-sm"
                  />
              </div>
              <button 
                disabled={loading}
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 disabled:opacity-50 active:scale-95 transition-all"
              >
                {loading ? 'VERIFICANDO...' : 'ENVIAR SOLICITAÇÃO'}
              </button>
              
              <p className="text-center text-[10px] text-slate-400 font-medium px-6">
                Ao solicitar, você concorda com nossos termos de segurança e proteção de dados.
              </p>
          </form>
      )}
    </div>
  );
};

export default PasswordRecovery;
