
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types.ts';
import { MOCK_USER, ADMIN_EMAIL, ADMIN_IDENTIFIER } from '../constants.tsx';
import { AlertCircle, Chrome, Shield, AtSign, ChevronRight, Lock, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  
  // Google Username Pick States
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{name: string, email: string} | null>(null);
  const [chosenUsername, setChosenUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    setLoading(true);
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      
      // Busca exata por email e senha
      const found = users.find((u: User) => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.loginType === 'email'
      );

      // Simulação simples de senha (em produção seria hash)
      if (found) {
        onLogin(found);
        navigate('/');
      } else {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
        setLoading(false);
      }
    }, 1500);
  };

  const selectGoogleAccount = (name: string, email: string) => {
    const users = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
    const existing = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      onLogin(existing);
      navigate('/');
    } else {
      // Usuário Google Inédito -> DEVE escolher @username
      setPendingGoogleUser({ name, email });
    }
  };

  const finalizeGoogleLogin = () => {
    if (!pendingGoogleUser) return;
    setUsernameError('');

    const formatted = chosenUsername.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    if (formatted.length < 4) {
      setUsernameError('Sua arroba deve ter pelo menos 4 caracteres.');
      return;
    }

    const allUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
    if (allUsers.some((u: any) => u.username === formatted)) {
      setUsernameError('Este @username já está sendo usado por outra pessoa.');
      return;
    }

    const newUser: User = {
      ...MOCK_USER,
      id: 'g_' + Date.now(),
      username: formatted,
      name: pendingGoogleUser.name,
      email: pendingGoogleUser.email,
      loginType: 'google',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formatted}`,
      createdAt: new Date().toISOString()
    };

    // Salva no banco global antes de logar
    allUsers.push(newUser);
    localStorage.setItem('erie_all_users', JSON.stringify(allUsers));
    
    onLogin(newUser);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 w-full max-w-md mx-auto relative overflow-hidden">
      {/* Visual background details */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl"></div>

      <div className="text-center mb-12 relative z-10">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white text-4xl font-black italic mx-auto mb-6 shadow-2xl shadow-blue-200 animate-in zoom-in duration-500">E</div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tighter italic">ERIE</h1>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.4em] mt-2">Monetização Social Inteligente</p>
      </div>

      <div className="w-full space-y-6 relative z-10">
        <button 
          onClick={() => setShowGoogleModal(true)}
          className="group w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-[1.5rem] font-black text-slate-700 hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-6 h-6" alt="google" />
          ENTRAR COM GOOGLE
          <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
        </button>

        <div className="relative flex items-center py-4">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">ou acesso direto</span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={20} className="shrink-0" /> {error}
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="email" 
              placeholder="E-mail cadastrado" 
              required 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all" 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="password" 
              placeholder="Sua senha secreta" 
              required 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              className="w-full bg-slate-50 border border-slate-100 rounded-[1.25rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all" 
            />
          </div>
          
          <div className="flex justify-between items-center px-2">
            <Link to="/recovery" className="text-[11px] font-black text-blue-600 uppercase tracking-wider hover:underline">Esqueci a senha</Link>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-black uppercase">
               <Shield size={12}/> 256-bit Encrypted
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 text-white font-black py-5 rounded-[1.5rem] shadow-2xl shadow-blue-200 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'ACESSAR ERIE APP'}
          </button>
        </form>
      </div>

      <p className="mt-12 text-sm text-slate-500 font-medium text-center relative z-10">
        Ainda não tem conta? <Link to="/register" className="font-black text-blue-600 ml-1 hover:underline">Criar agora</Link>
      </p>

      {/* Real-Feel Google Account Selector */}
      {showGoogleModal && !pendingGoogleUser && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end md:items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20">
            <div className="p-10 text-center border-b border-slate-50">
              <img src="https://www.gstatic.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" className="h-8 mx-auto mb-6" alt="google" />
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Escolha uma conta</h3>
              <p className="text-xs text-slate-500 mt-2 font-medium">para prosseguir no <strong>ERIE Super App</strong></p>
            </div>
            <div className="p-6 space-y-3">
              <GoogleAccountBtn name="Alan Martins Sodré" email="alanmarttinssodre1251@gmail.com" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Alan" onClick={() => selectGoogleAccount('Alan Martins Sodré', 'alanmarttinssodre1251@gmail.com')} />
              <GoogleAccountBtn name="Convidado Teste" email="tester@gmail.com" avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Tester" onClick={() => selectGoogleAccount('Convidado Teste', 'tester@gmail.com')} />
              <button className="w-full flex items-center gap-4 p-5 rounded-3xl hover:bg-slate-50 transition-colors text-left border border-transparent">
                 <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400"><Chrome size={24}/></div>
                 <div>
                    <p className="text-sm font-black text-slate-800">Usar outra conta</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">adicionar novo Gmail</p>
                 </div>
              </button>
            </div>
            <button onClick={() => setShowGoogleModal(false)} className="w-full py-8 text-xs font-black text-slate-400 uppercase tracking-[0.4em] bg-slate-50 hover:bg-slate-100">Cancelar Acesso</button>
          </div>
        </div>
      )}

      {/* Username Picker for new Google Users */}
      {pendingGoogleUser && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AtSign size={32} />
               </div>
               <h3 className="text-2xl font-black text-slate-800 tracking-tighter">Sua identidade ERIE</h3>
               <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed">Conta Google verificada! Agora, escolha sua arroba única para o feed.</p>
            </div>

            {usernameError && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-black border border-red-100">
                 {usernameError}
              </div>
            )}

            <div className="relative mb-8">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                type="text"
                autoFocus
                value={chosenUsername}
                onChange={(e) => setChosenUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                placeholder="sua_arroba_aqui"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-12 pr-4 text-lg font-black outline-none focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <button 
              onClick={finalizeGoogleLogin}
              className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 active:scale-95 transition-all"
            >
              FINALIZAR E ENTRAR
            </button>
            <button 
              onClick={() => setPendingGoogleUser(null)} 
              className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest"
            >
              Voltar ao login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const GoogleAccountBtn = ({ name, email, avatar, onClick }: any) => (
  <button onClick={onClick} className="w-full flex items-center gap-4 p-5 rounded-[2rem] hover:bg-blue-50/50 transition-colors text-left border border-slate-50 hover:border-blue-100 group">
    <img src={avatar} className="w-12 h-12 rounded-full border border-slate-100 group-hover:border-blue-200" alt="avatar" />
    <div className="flex-1">
      <p className="text-sm font-black text-slate-800">{name}</p>
      <p className="text-[11px] text-slate-500 font-medium">{email}</p>
    </div>
    <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-300" />
  </button>
);

export default Login;
