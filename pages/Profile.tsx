
import React, { useState } from 'react';
import { User, UserRole } from '../types.ts';
import { 
  Settings, Shield, CreditCard, Bell, HelpCircle, 
  LogOut, ChevronRight, Star, Camera, Edit3, X, Check
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedBio, setEditedBio] = useState(user.bio || '');

  const handleSave = () => {
    const updatedUser: User = {
      ...user,
      name: editedName,
      bio: editedBio
    };
    onUpdateUser(updatedUser);
    setIsEditing(false);
  };

  const menuItems = [
    { icon: <Settings size={18} />, label: 'Configurações', color: 'bg-slate-100 text-slate-600' },
    { icon: <Shield size={18} />, label: 'Privacidade e Segurança', color: 'bg-blue-50 text-blue-600' },
    { icon: <CreditCard size={18} />, label: 'Carteira ERIE', color: 'bg-emerald-50 text-emerald-600' },
    { icon: <Bell size={18} />, label: 'Notificações', color: 'bg-orange-50 text-orange-600' },
    { icon: <HelpCircle size={18} />, label: 'Ajuda e Suporte', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-full pb-32 animate-in fade-in duration-500">
      {/* Header Perfil */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-4 right-4">
           <button 
             onClick={() => setIsEditing(!isEditing)} 
             className="p-2 bg-slate-50 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
           >
              {isEditing ? <X size={20}/> : <Edit3 size={20} />}
           </button>
        </div>

        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-blue-50 p-1 bg-white">
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              className="w-full h-full rounded-full object-cover" 
              alt="avatar" 
            />
          </div>
          <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform">
            <Camera size={14} />
          </button>
        </div>
        
        {isEditing ? (
          <div className="w-full space-y-3">
             <input 
               type="text" 
               value={editedName} 
               onChange={e => setEditedName(e.target.value)} 
               className="w-full text-center bg-slate-50 border border-slate-100 rounded-xl py-2 px-4 font-black text-lg outline-none focus:ring-2 focus:ring-blue-500/20"
               placeholder="Seu nome"
             />
             <textarea 
               value={editedBio} 
               onChange={e => setEditedBio(e.target.value)} 
               className="w-full text-center bg-slate-50 border border-slate-100 rounded-xl py-2 px-4 text-xs font-medium outline-none h-20 focus:ring-2 focus:ring-blue-500/20"
               placeholder="Escreva algo sobre você..."
             />
             <button 
               onClick={handleSave}
               className="w-full bg-emerald-600 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-emerald-100"
             >
                <Check size={18}/> SALVAR ALTERAÇÕES
             </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.name}</h2>
            <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em] mt-1">
              {user.role === UserRole.ADMIN ? 'SUPER ADMIN' : 'USUÁRIO PREMIUM'} • {user.checkInStreak} DIAS
            </p>
            {user.bio ? (
              <p className="mt-4 text-xs font-medium text-slate-500 leading-relaxed px-4">{user.bio}</p>
            ) : (
              <p className="mt-4 text-xs italic text-slate-300">Nenhuma bio definida.</p>
            )}
          </>
        )}
        
        <div className="flex gap-4 mt-8 w-full">
          <div className="flex-1 bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Amigos</p>
            <p className="text-lg font-black text-slate-800">0</p>
          </div>
          <div className="flex-1 bg-blue-50 p-4 rounded-3xl border border-blue-100/30">
            <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-1">Saldo</p>
            <p className="text-lg font-black text-blue-600">R$ {user.balance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Menu Options */}
      <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 space-y-1">
        {menuItems.map((item, idx) => (
          <button 
            key={idx}
            className="w-full p-4 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>{item.icon}</div>
              <span className="font-bold text-slate-700 text-sm">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button 
        onClick={onLogout}
        className="w-full bg-red-50 text-red-600 p-5 rounded-[2rem] flex items-center justify-center gap-2 font-black text-sm transition-all active:scale-95 border border-red-100 shadow-xl shadow-red-100/50"
      >
        <LogOut size={20} />
        ENCERRAR SESSÃO
      </button>

      <div className="text-center py-6">
        <p className="text-[9px] text-slate-300 font-black uppercase tracking-[0.4em]">ERIE PLATFORM • v3.0.0-PRO</p>
      </div>
    </div>
  );
};

export default Profile;
