
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types.ts';
import { MOCK_ADMIN, ADMIN_IDENTIFIER } from '../constants.tsx';
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

    setTimeout(() => {
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
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
             <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-black mt-4">ERIE SECURE ACCESS</h1>
        </div>

        <form onSubmit={handleAdminAuth} className="space-y-4">
          <input 
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@erie.com"
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-4 text-sm outline-none"
          />
          <input 
            type={showId ? "text" : "password"}
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Identificador Erie..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-4 text-sm outline-none"
          />
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl"
          >
            AUTENTICAR SISTEMA
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
