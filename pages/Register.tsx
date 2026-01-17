
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, UserRole } from '../types.ts';
import { MOCK_USER } from '../constants.tsx';
import { User as UserIcon, Mail, Lock, Phone } from 'lucide-react';

interface RegisterProps {
  onLogin: (user: User) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const newUser: User = {
        ...MOCK_USER,
        id: 'new_user_' + Date.now(),
        name,
        email,
        phone,
        createdAt: new Date().toISOString()
      };
      onLogin(newUser);
      navigate('/');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col">
      <div className="mb-10 mt-10">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Crie sua conta</h1>
        <p className="text-slate-500 text-sm mt-2">Comece a participar e ganhar recompensas hoje.</p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="relative">
          <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome completo"
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none"
          />
        </div>
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg"
        >
          Criar Conta
        </button>
      </form>

      <p className="text-center mt-auto py-6 text-slate-500 text-sm">
        Já tem uma conta? <Link to="/login" className="text-blue-600 font-bold">Fazer login</Link>
      </p>
    </div>
  );
};

export default Register;
