
import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types.ts';
import { LogOut, ShieldCheck, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const lastClickTime = useRef<number>(0);

  // Função secreta para Alan acessar o Admin sem digitar URL
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

  return (
    <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer active:opacity-70 transition-opacity" 
        onClick={handleSecretClick}
        title="Toque 5 vezes para acesso restrito"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl italic shadow-md">E</div>
        <span className="font-bold text-xl tracking-tight text-slate-800">ERIE</span>
      </div>

      <div className="flex items-center gap-4">
        {user.role === UserRole.ADMIN && (
          <button 
            onClick={() => navigate('/admin-panel-erie-1986')}
            className="p-2 text-blue-600 bg-blue-50 rounded-full transition-colors"
            title="Painel Administrativo"
          >
            <ShieldCheck size={20} />
          </button>
        )}
        <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
          <Bell size={20} />
        </button>
        <button 
          onClick={onLogout}
          className="p-2 text-slate-500 hover:text-red-600 transition-colors"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
