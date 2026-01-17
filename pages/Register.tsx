
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types.ts';
import { MOCK_USER } from '../constants.tsx';
import { User as UserIcon, Mail, Lock, Phone, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (name.trim().length < 3) {
      setError('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (!validateEmail(email)) {
      setError('O e-mail informado não é válido.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    // Simulação de banco de dados real com localStorage
    setTimeout(() => {
      const existingUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      if (existingUsers.some((u: any) => u.email === email)) {
        setError('Este e-mail já está em uso por outra conta.');
        setLoading(false);
        return;
      }

      const newUser: User = {
        ...MOCK_USER,
        id: 'user_' + Date.now(),
        name,
        email,
        phone,
        loginType: 'email',
        createdAt: new Date().toISOString()
      };

      existingUsers.push(newUser);
      localStorage.setItem('erie_all_users', JSON.stringify(existingUsers));
      
      onLogin(newUser);
      navigate('/');
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col max-w-md mx-auto">
      <div className="mb-10 mt-6">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">Crie sua conta</h1>
        <p className="text-slate-500 text-sm mt-2">Junte-se à maior rede de recompensas do Brasil.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-2 text-xs font-bold border border-red-100">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor e-mail"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Telefone (opcional)"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha forte"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-medium"
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            disabled={loading}
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESSANDO...' : 'FINALIZAR CADASTRO'}
          </button>
        </div>
      </form>

      <p className="text-center mt-auto py-6 text-slate-500 text-sm">
        Já possui conta? <Link to="/login" className="text-blue-600 font-bold ml-1">Fazer login</Link>
      </p>
    </div>
  );
};

export default Register;
