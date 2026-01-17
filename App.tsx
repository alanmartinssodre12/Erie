
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types.ts';
import { AtSign } from 'lucide-react';

// Pages
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Home from './pages/Home.tsx';
import ChatRoom from './pages/ChatRoom.tsx';
import Wallet from './pages/Wallet.tsx';
import Profile from './pages/Profile.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import AdminLogin from './pages/AdminLogin.tsx';
import PasswordRecovery from './pages/PasswordRecovery.tsx';

// Components
import Navbar from './components/Navbar.tsx';
import BottomNav from './components/BottomNav.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Inicializar DB local de forma robusta
    const initDB = (key: string, def: string) => {
      if (!localStorage.getItem(key)) localStorage.setItem(key, def);
    };
    
    initDB('erie_all_users', '[]');
    initDB('erie_posts', '[]');
    initDB('erie_transactions', '[]');
    initDB('erie_messages', '[]');
    initDB('erie_notifications', '[]');
    initDB('erie_tickets', '[]');

    const savedUser = localStorage.getItem('erie_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Sempre buscar a versão mais recente do usuário no banco global
      const allUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      const latest = allUsers.find((u: User) => u.id === parsedUser.id);
      setUser(latest || parsedUser);
    }
    setInitialized(true);
  }, []);

  const handleUpdateUser = (u: User | null) => {
    if (u) {
      // 1. Atualiza a sessão ativa
      setUser(u);
      localStorage.setItem('erie_user', JSON.stringify(u));
      
      // 2. Sincroniza com o "Banco de Dados" global
      const allUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      const index = allUsers.findIndex((usr: User) => usr.id === u.id);
      
      if (index > -1) {
        allUsers[index] = { ...allUsers[index], ...u };
      } else {
        allUsers.push(u);
      }
      localStorage.setItem('erie_all_users', JSON.stringify(allUsers));
    } else {
      // Logout seguro: apaga apenas a sessão, não a conta no banco global
      setUser(null);
      localStorage.removeItem('erie_user');
    }
  };

  if (!initialized) return null;

  return (
    <HashRouter>
      <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleUpdateUser} />} />
          <Route path="/register" element={<Register onLogin={handleUpdateUser} />} />
          <Route path="/recovery" element={<PasswordRecovery />} />
          <Route path="/admin-access-erie" element={<AdminLogin onLogin={handleUpdateUser} />} />

          <Route
            path="/*"
            element={
              user ? (
                <MainLayout user={user} onLogout={() => handleUpdateUser(null)} onUpdateUser={handleUpdateUser} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin-panel-erie-1986"
            element={
              user && user.role === UserRole.ADMIN ? (
                <AdminDashboard user={user} onLogout={() => handleUpdateUser(null)} />
              ) : (
                <Navigate to="/admin-access-erie" />
              )
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

const MainLayout: React.FC<{ 
  user: User; 
  onLogout: () => void; 
  onUpdateUser: (u: User) => void;
}> = ({ user, onLogout, onUpdateUser }) => {
  const location = useLocation();
  const isChatRoom = location.pathname.startsWith('/chat/') && location.pathname !== '/chat/list';
  
  // Bloqueio extra para garantir que ninguém entre sem username
  if (!user.username && location.pathname !== '/register') {
    return <Navigate to="/register" />;
  }

  return (
    <div className="flex flex-col h-screen w-full relative">
      {!isChatRoom && <Navbar user={user} onLogout={onLogout} />}
      <div className="flex-1 flex overflow-hidden">
        <main className={`flex-1 overflow-y-auto no-scrollbar bg-slate-50 w-full`}>
          <div className="max-w-6xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home user={user} setUser={onUpdateUser} />} />
              <Route path="/wallet" element={<Wallet user={user} setUser={onUpdateUser} />} />
              <Route path="/profile/*" element={<Profile user={user} onUpdateUser={onUpdateUser} onLogout={onLogout} />} />
              <Route path="/chat/:id" element={<ChatRoom user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
      {!isChatRoom && <BottomNav user={user} setUser={onUpdateUser} />}
    </div>
  );
};

export default App;
