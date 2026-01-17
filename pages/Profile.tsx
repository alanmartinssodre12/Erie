
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { User, Notification, SupportTicket } from '../types.ts';
import { 
  Settings, Shield, CreditCard, Bell, HelpCircle, 
  LogOut, ChevronRight, Camera, Edit3, X, Check,
  AlertCircle, MessageSquare, Trash2, Info, AtSign
} from 'lucide-react';

interface ProfileProps {
  user: User;
  onUpdateUser: (u: User) => void;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser, onLogout }) => {
  return (
    <div className="w-full pb-32 animate-in fade-in duration-500">
      <Routes>
        <Route index element={<ProfileMain user={user} onUpdateUser={onUpdateUser} onLogout={onLogout} />} />
        <Route path="settings" element={<SettingsPage user={user} onUpdateUser={onUpdateUser} />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="privacy" element={<PrivacyPage user={user} onUpdateUser={onUpdateUser} />} />
      </Routes>
    </div>
  );
};

const ProfileMain = ({ user, onUpdateUser, onLogout }: ProfileProps) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [editedUsername, setEditedUsername] = useState(user.username);
  const [editedBio, setEditedBio] = useState(user.bio || '');

  const handleSave = () => {
    const cleanUsername = editedUsername.toLowerCase().trim().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    onUpdateUser({ ...user, name: editedName, username: cleanUsername, bio: editedBio });
    setIsEditing(false);
  };

  const handlePhotoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          onUpdateUser({ ...user, avatar: re.target?.result as string });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600 to-blue-400 opacity-10"></div>
        
        <div className="absolute top-6 right-6 flex gap-2">
           <button onClick={() => setIsEditing(!isEditing)} className="p-2 bg-white rounded-xl text-blue-600 shadow-sm border border-slate-50 hover:bg-slate-50 transition-all">
              {isEditing ? <X size={20}/> : <Edit3 size={18} />}
           </button>
        </div>

        <div className="relative mb-6 group cursor-pointer mt-4" onClick={handlePhotoUpload}>
          <div className="w-32 h-32 rounded-full border-4 border-white p-1 bg-white overflow-hidden shadow-xl shadow-blue-900/10">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} className="w-full h-full rounded-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" />
          </div>
        </div>

        {isEditing ? (
          <div className="w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left block ml-2">Nome de Exibição</label>
              <input value={editedName} onChange={e => setEditedName(e.target.value)} className="w-full text-center bg-slate-50 p-3 rounded-2xl font-black text-xl border border-slate-100 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left block ml-2">@username único</label>
              <input value={editedUsername} onChange={e => setEditedUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))} className="w-full text-center bg-slate-50 p-3 rounded-2xl font-bold text-blue-600 border border-slate-100 outline-none" />
            </div>
            <textarea value={editedBio} onChange={e => setEditedBio(e.target.value)} className="w-full text-center bg-slate-50 p-3 rounded-2xl text-sm border border-slate-100 outline-none h-24" placeholder="Sua bio..." />
            <button onClick={handleSave} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 active:scale-95">SALVAR ALTERAÇÕES</button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
               <AtSign size={12} className="text-blue-600" />
               <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">{user.username}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Nível 1 • {user.checkInStreak} dias seguidos</p>
            <p className="mt-4 text-sm text-slate-500 font-medium max-w-xs leading-relaxed">{user.bio || 'Bem-vindo ao meu perfil no ERIE.'}</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ProfileMenuItem icon={<Settings/>} label="Configurações" desc="Conta e segurança" onClick={() => navigate('/profile/settings')} />
        <ProfileMenuItem icon={<Bell/>} label="Notificações" desc="Alertas de sistema" onClick={() => navigate('/profile/notifications')} />
        <ProfileMenuItem icon={<Shield/>} label="Privacidade" desc="Visibilidade de perfil" onClick={() => navigate('/profile/privacy')} />
        <ProfileMenuItem icon={<HelpCircle/>} label="Ajuda e Suporte" desc="Contate o Suporte" onClick={() => navigate('/profile/help')} />
        <ProfileMenuItem icon={<CreditCard/>} label="Minha Carteira" desc={`Saldo: R$ ${user.balance.toFixed(2)}`} onClick={() => navigate('/wallet')} />
        <ProfileMenuItem icon={<LogOut/>} label="Sair" desc="Desconectar do app" onClick={onLogout} danger />
      </div>
    </div>
  );
};

const ProfileMenuItem = ({ icon, label, desc, onClick, danger }: any) => (
  <button onClick={onClick} className={`bg-white p-6 rounded-[2rem] flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-md transition-all group ${danger ? 'hover:bg-red-50' : 'hover:bg-blue-50/10'}`}>
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-2xl ${danger ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'}`}>{icon}</div>
      <div className="text-left">
        <p className={`font-black text-sm ${danger ? 'text-red-600' : 'text-slate-800'}`}>{label}</p>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{desc}</p>
      </div>
    </div>
    <ChevronRight size={18} className="text-slate-300" />
  </button>
);

const SettingsPage = ({ user, onUpdateUser }: any) => {
  const navigate = useNavigate();
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/profile')} className="p-2 bg-white rounded-xl shadow-sm"><X size={20}/></button>
        <h2 className="text-2xl font-black italic">Configurações</h2>
      </div>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-6">
         <div className="flex items-center justify-between">
            <div>
               <p className="font-bold">E-mail de Acesso</p>
               <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase">Alterar</button>
         </div>
         <div className="flex items-center justify-between">
            <div>
               <p className="font-bold">Telefone</p>
               <p className="text-xs text-slate-500">{user.phone || 'Não cadastrado'}</p>
            </div>
            <button className="text-[10px] font-black text-blue-600 uppercase">Vincular</button>
         </div>
      </div>
    </div>
  );
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<Notification[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('erie_notifications') || '[]');
    setNotifs(saved);
  }, []);

  const clearAll = () => {
    localStorage.setItem('erie_notifications', '[]');
    setNotifs([]);
  };

  const markRead = () => {
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem('erie_notifications', JSON.stringify(updated));
    setNotifs(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/profile')} className="p-2 bg-white rounded-xl shadow-sm hover:bg-slate-50 transition-all"><ChevronRight className="rotate-180" size={20}/></button>
          <h2 className="text-2xl font-black italic tracking-tighter">NOTIFICAÇÕES</h2>
        </div>
        {notifs.length > 0 && (
          <div className="flex gap-2">
            <button onClick={markRead} className="p-2 text-blue-600 bg-white rounded-xl shadow-sm border border-slate-50" title="Lidas">
              <Check size={18}/>
            </button>
            <button onClick={clearAll} className="p-2 text-red-500 bg-white rounded-xl shadow-sm border border-slate-50" title="Limpar">
              <Trash2 size={18}/>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {notifs.length === 0 ? (
          <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                <Bell size={32} />
             </div>
             <p className="font-black italic text-slate-300 uppercase tracking-widest text-sm">Caixa de entrada vazia</p>
          </div>
        ) : (
          notifs.slice().reverse().map(n => (
            <div key={n.id} className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-start gap-4 transition-all hover:border-blue-100 ${n.read ? 'opacity-50' : 'opacity-100'}`}>
              <div className={`p-3 rounded-2xl ${n.read ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                <Info size={20}/>
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                    <p className="font-black text-sm text-slate-800">{n.title}</p>
                    {!n.read && <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>}
                 </div>
                 <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                 <p className="text-[9px] text-slate-300 mt-3 font-black uppercase tracking-widest">{new Date(n.timestamp).toLocaleString('pt-BR')}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const HelpPage = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const tickets = JSON.parse(localStorage.getItem('erie_tickets') || '[]');
    tickets.push({ id: Date.now(), subject, message, status: 'open', timestamp: new Date().toISOString() });
    localStorage.setItem('erie_tickets', JSON.stringify(tickets));
    setSent(true);
  };

  if (sent) return (
    <div className="p-12 text-center max-w-md mx-auto">
       <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40}/></div>
       <h2 className="text-2xl font-black mb-2 italic">CHAMADO ABERTO!</h2>
       <p className="text-sm text-slate-500 mb-8 font-medium">Nossa equipe de suporte analisará sua solicitação e responderá via e-mail em até 24h.</p>
       <button onClick={() => navigate('/profile')} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 active:scale-95">VOLTAR AO PERFIL</button>
    </div>
  );

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/profile')} className="p-2 bg-white rounded-xl shadow-sm"><ChevronRight className="rotate-180" size={20}/></button>
        <h2 className="text-2xl font-black italic tracking-tighter">AJUDA E SUPORTE</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
         <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-2">Qual o motivo do contato?</label>
            <input value={subject} onChange={e => setSubject(e.target.value)} required placeholder="Ex: Problema com saque" className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20" />
         </div>
         <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block ml-2">Descreva detalhadamente</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} required placeholder="Conte-nos o que aconteceu..." className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl text-sm font-medium outline-none h-40 focus:ring-2 focus:ring-blue-500/20" />
         </div>
         <button className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-100 active:scale-95">ENVIAR SOLICITAÇÃO</button>
      </form>
    </div>
  );
};

const PrivacyPage = ({ user, onUpdateUser }: any) => {
  const navigate = useNavigate();
  const toggle = (field: string) => {
    onUpdateUser({ ...user, settings: { ...user.settings, [field]: !user.settings[field] } });
  };

  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/profile')} className="p-2 bg-white rounded-xl shadow-sm"><ChevronRight className="rotate-180" size={20}/></button>
        <h2 className="text-2xl font-black italic tracking-tighter">PRIVACIDADE</h2>
      </div>
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 divide-y divide-slate-50 overflow-hidden">
         <PrivacyToggle label="Perfil Privado" desc="Apenas amigos podem ver suas publicações" active={user.settings?.privateProfile} onToggle={() => toggle('privateProfile')} />
         <PrivacyToggle label="Autenticação em Duas Etapas" desc="Proteção extra ao logar em novos dispositivos" active={user.settings?.twoFactor} onToggle={() => toggle('twoFactor')} />
         <PrivacyToggle label="Receber Notificações de Ganhos" desc="Alertas de receita gerada por anúncios" active={user.settings?.notifications} onToggle={() => toggle('notifications')} />
      </div>
    </div>
  );
};

const PrivacyToggle = ({ label, desc, active, onToggle }: any) => (
  <div className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
    <div className="max-w-[70%] text-left">
       <p className="font-bold text-sm text-slate-800">{label}</p>
       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">{desc}</p>
    </div>
    <button onClick={onToggle} className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-blue-600' : 'bg-slate-200'}`}>
       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${active ? 'left-7' : 'left-1'}`}></div>
    </button>
  </div>
);

export default Profile;
