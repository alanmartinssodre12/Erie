
import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types.ts';
import { MOCK_USER } from '../constants.tsx';
import { Mail, Lock, Chrome, AlertCircle } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);
  const navigate = useNavigate();

  const handleSecretClick = () => {
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

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setError('Senha incorreta ou insuficiente.');
      return;
    }

    setLoading(true);
    // Simulação de busca no banco local
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email);

      if (foundUser || email === 'user@erie.com') {
        onLogin(foundUser || MOCK_USER);
        navigate('/');
      } else {
        setError('Conta não encontrada ou dados inválidos.');
        setLoading(false);
      }
    }, 1200);
  };

  const selectGoogleAccount = (name: string, email: string) => {
    setLoading(true);
    setShowGoogleModal(false);
    setTimeout(() => {
      const googleUser: User = {
        ...MOCK_USER,
        id: 'google_' + Date.now(),
        name,
        email,
        loginType: 'google',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      };
      onLogin(googleUser);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center max-w-md mx-auto relative">
      <div className="text-center mb-10">
        <div 
          onClick={handleSecretClick}
          className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black italic mx-auto mb-4 cursor-pointer active:scale-90 transition-transform shadow-lg shadow-blue-200"
        >
          E
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tighter">ERIE</h1>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Super App Platform</p>
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => setShowGoogleModal(true)}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-100 py-3.5 rounded-2xl font-bold text-slate-700 hover:bg-slate-50 transition-all active:scale-95"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-5 h-5" alt="google" />
          Entrar com Google
        </button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase">ou e-mail</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-1">
            <input 
              type="email" 
              placeholder="E-mail"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <input 
              type="password" 
              placeholder="Senha"
              required
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end">
            <Link to="/recovery" className="text-[11px] font-black text-blue-600 uppercase tracking-wider hover:underline">Esqueci a senha</Link>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'AUTENTICANDO...' : 'ENTRAR NO ERIE'}
          </button>
        </form>
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-slate-500">
          Não tem conta? <Link to="/register" className="font-bold text-blue-600 ml-1">Crie agora</Link>
        </p>
      </div>

      {/* Modal de Escolha do Google */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10">
            <div className="p-8 text-center border-b border-slate-50">
              <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" className="h-6 mx-auto mb-4" alt="google logo" />
              <h3 className="text-lg font-bold text-slate-800">Escolha uma conta</h3>
              <p className="text-xs text-slate-500 mt-1">para prosseguir no app ERIE</p>
            </div>
            <div className="p-4 space-y-2">
              <button 
                onClick={() => selectGoogleAccount('Alan Martins', 'alan@gmail.com')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-100"
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alan" className="w-10 h-10 rounded-full" alt="acc1" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Alan Martins</p>
                  <p className="text-[10px] text-slate-500">alan@gmail.com</p>
                </div>
              </button>
              <button 
                onClick={() => selectGoogleAccount('Visitante ERIE', 'visitante@gmail.com')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left border border-transparent hover:border-slate-100"
              >
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Visitante" className="w-10 h-10 rounded-full" alt="acc2" />
                <div>
                  <p className="text-sm font-bold text-slate-800">Outra Conta</p>
                  <p className="text-[10px] text-slate-500">usar dados do dispositivo</p>
                </div>
              </button>
            </div>
            <button 
              onClick={() => setShowGoogleModal(false)}
              className="w-full py-6 text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
