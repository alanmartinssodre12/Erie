
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User } from '../types.ts';
import { MOCK_USER } from '../constants.tsx';
import { Mail, Lock, Chrome, ShieldAlert } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin(MOCK_USER);
      navigate('/');
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col justify-center">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black italic mx-auto mb-4">E</div>
        <h1 className="text-2xl font-black text-slate-800">ERIE</h1>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input 
          type="email" 
          placeholder="E-mail"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Senha"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
};

export default Login;
