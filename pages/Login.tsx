
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types';
import { MOCK_USER } from '../constants';
import { Mail, Lock, Chrome, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showGoogleSelector, setShowGoogleSelector] = useState(false);
  const navigate = useNavigate();
  
  // Lógica de acesso secreto para o Alan
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);

  const handleSecretTrigger = () => {
    const now = Date.now();
    if (now - lastClickTime.current < 500) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount === 5) {
        setClickCount(0);
        navigate('/admin-access-erie');
      }
    } else {
      setClickCount(1);
    }
    lastClickTime.current = now;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(MOCK_USER);
      navigate('/');
      setLoading(false);
    }, 1200);
  };

  const selectGoogleAccount = (acc: string) => {
    setLoading(true);
    setShowGoogleSelector(false);
    setTimeout(() => {
      onLogin({ ...MOCK_USER, email: acc });
      navigate('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center relative">
      {showGoogleSelector && (
        <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 text-center border-b border-slate-50">
              <Chrome className="mx-auto mb-2 text-blue-600" size={32} />
              <h3 className="font-bold text-slate-800">Escolha uma conta</h3>
              <p className="text-xs text-slate-500">para prosseguir no ERIE</p>
            </div>
            <div className="p-2 space-y-1">
              {['alan.sodre@gmail.com', 'contato.erie@gmail.com'].map((acc) => (
                <button 
                  key={acc}
                  onClick={() => selectGoogleAccount(acc)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
                    {acc[0]}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{acc}</p>
                    <p className="text-[10px] text-slate-400">Google Account</p>
                  </div>
                </button>
              ))}
              <button className="w-full p-3 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                Usar outra conta
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-10">
        <div 
          onClick={handleSecretTrigger}
          className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-4xl font-black italic shadow-2xl mx-auto mb-4 rotate-3 cursor-pointer active:scale-95 transition-transform"
        >
          E
        </div>
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">ERIE</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">Conectando você ao que importa.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div className="flex justify-end">
          <Link to="/recovery" className="text-sm font-bold text-blue-600">Esqueceu a senha?</Link>
        </div>

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Entrar'}
        </button>
      </form>

      <div className="mt-8">
        <div className="relative flex items-center justify-center mb-6">
          <hr className="w-full border-slate-100" />
          <span className="absolute bg-white px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ou acesse com</span>
        </div>

        <button 
          onClick={() => setShowGoogleSelector(true)}
          className="w-full bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl shadow-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
        >
          <Chrome size={20} /> Entrar com Google
        </button>
      </div>

      <p className="text-center mt-10 text-slate-500 text-sm font-medium">
        Novo por aqui? <Link to="/register" className="text-blue-600 font-bold">Criar conta</Link>
      </p>

      <div className="mt-12 flex items-center gap-2 justify-center text-[10px] text-slate-400 text-center px-4">
        <ShieldAlert size={14} />
        O ERIE não garante renda fixa. As recompensas são por participação.
      </div>
    </div>
  );
};

export default Login;
