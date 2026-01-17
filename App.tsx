
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole, Post, Transaction, Message } from './types.ts';

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
    // Inicializar DB local se estiver vazio
    if (!localStorage.getItem('erie_all_users')) localStorage.setItem('erie_all_users', '[]');
    if (!localStorage.getItem('erie_posts')) localStorage.setItem('erie_posts', '[]');
    if (!localStorage.getItem('erie_transactions')) localStorage.setItem('erie_transactions', '[]');
    if (!localStorage.getItem('erie_messages')) localStorage.setItem('erie_messages', '[]');

    const savedUser = localStorage.getItem('erie_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setInitialized(true);
  }, []);

  const handleUpdateUser = (u: User | null) => {
    setUser(u);
    if (u) {
      localStorage.setItem('erie_user', JSON.stringify(u));
      // Atualizar no "banco" global
      const allUsers = JSON.parse(localStorage.getItem('erie_all_users') || '[]');
      const index = allUsers.findIndex((usr: User) => usr.id === u.id);
      if (index > -1) {
        allUsers[index] = u;
      } else {
        allUsers.push(u);
      }
      localStorage.setItem('erie_all_users', JSON.stringify(allUsers));
    } else {
      localStorage.removeItem('erie_user');
    }
  };

  const handleLogout = () => {
    handleUpdateUser(null);
  };

  if (!initialized) return null;

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col max-w-md mx-auto shadow-2xl relative border-x border-white/5 overflow-hidden">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleUpdateUser} />} />
          <Route path="/register" element={<Register onLogin={handleUpdateUser} />} />
          <Route path="/recovery" element={<PasswordRecovery />} />
          <Route path="/admin-access-erie" element={<AdminLogin onLogin={handleUpdateUser} />} />

          <Route
            path="/"
            element={
              user ? (
                <MainLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser}>
                  <Home user={user} setUser={handleUpdateUser} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          <Route
            path="/wallet"
            element={
              user ? (
                <MainLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser}>
                  <Wallet user={user} setUser={handleUpdateUser} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/profile"
            element={
              user ? (
                <MainLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser}>
                  <Profile user={user} onUpdateUser={handleUpdateUser} onLogout={handleLogout} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/chat/:id"
            element={
              user ? (
                <MainLayout user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser}>
                  <ChatRoom user={user} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          <Route
            path="/admin-panel-erie-1986"
            element={
              user && user.role === UserRole.ADMIN ? (
                <AdminDashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin-access-erie" />
              )
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

const MainLayout: React.FC<{ 
  user: User; 
  onLogout: () => void; 
  onUpdateUser: (u: User) => void;
  children: React.ReactNode 
}> = ({ user, onLogout, onUpdateUser, children }) => {
  const location = useLocation();
  const isChatRoom = location.pathname.startsWith('/chat/') && location.pathname !== '/chat/list';

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {!isChatRoom && <Navbar user={user} onLogout={onLogout} />}
      <main className={`flex-1 overflow-y-auto no-scrollbar ${!isChatRoom ? 'pb-24' : ''}`}>
        {children}
      </main>
      {!isChatRoom && <BottomNav user={user} setUser={onUpdateUser} />}
    </div>
  );
};

export default App;
