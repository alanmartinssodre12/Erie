
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole, Notification } from '../types.ts';
import { MOCK_USER } from '../constants.tsx';
import { User as UserIcon, Mail, Lock, Phone, AlertCircle, AtSign, ChevronLeft } from 'lucide-react';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleUsernameChange = (val: string) => {
    const cleaned = val.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setUsername(cleaned);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 3) {
      setError('Seu nome completo deve ter pelo menos 3 caracteres.');
      return;
    }

    if (username.length < 4) {
      setError('Sua arroba (@username) deve ter no mínimo 4 caracteres.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, informe um endereço de e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setError('Crie uma senha mais forte (mínimo de 6 caracteres).');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      
      // Validação de Duplicidade
      if (existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        setError('Este e-mail já possui uma conta vinculada.');
        setLoading(false);
        return;
      }

      if (existingUsers.some((u: any) => u.username === username)) {
        setError('Este @username já está sendo usado por outro usuário.');
        setLoading(false);
        return;
      }

      const newUser: User = {
        ...MOCK_USER,
        id: 'user_' + Date.now(),
        username: username,
        name,
        email,
        phone,
        loginType: 'email',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        createdAt: new Date().toISOString()
      };

      // SALVAMENTO PERMANENTE NO BANCO GLOBAL
      existingUsers.push(newUser);
      localStorage.setItem('erie_all_users', JSON.stringify(existingUsers));
      
      // Notificação de boas-vindas
      const welcomeNotif: Notification = {
        id: 'welcome_' + Date.now(),
        title: 'Sua conta ERIE está pronta!',
        message: `Bem-vindo, ${name.split(' ')[0]}! Explore o feed e comece a monetizar agora.`,
        timestamp: new Date().toISOString(),
        read: false
      };
      const notifications = JSON.parse(localStorage.getItem('erie_notifications') || '[]');
      notifications.push(welcomeNotif);
      localStorage.setItem('erie_notifications', JSON.stringify(notifications));
      
      onLogin(newUser);
      navigate('/');
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col max-w-md mx-auto relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>

      <button onClick={() => navigate('/login')} className="mt-4 text-slate-400 flex items-center gap-1 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-colors">
        <ChevronLeft size={16} /> Voltar ao Login
      </button>

      <div className="mb-10 mt-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter italic">Crie sua Identidade</h1>
        <p className="text-slate-500 text-sm mt-2 font-medium">Conta verificada, permanente e segura.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100 animate-in fade-in">
            <AlertCircle size={18} className="shrink-0" /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Nome de Exibição</label>
            <div className="relative">
              <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Alan Martins"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-14 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Identificador (@username)</label>
            <div className="relative">
              <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Ex: alan_erie"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-14 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-black lowercase text-blue-600"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">E-mail Principal</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: seu@gmail.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-14 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-3">Crie sua Senha</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4.5 pl-14 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold"
              />
            </div>
          </div>
        </div>

        <div className="pt-6">
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'FINALIZAR CADASTRO E ENTRAR'}
          </button>
        </div>
      </form>

      <p className="text-center mt-auto py-10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
        Protegido por ERIE Security Core
      </p>
    </div>
  );
};

export default Register;
