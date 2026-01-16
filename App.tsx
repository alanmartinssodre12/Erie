
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, UserRole } from './types';
import { MOCK_USER, MOCK_ADMIN } from './constants';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';
import Wallet from './pages/Wallet';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import PasswordRecovery from './pages/PasswordRecovery';

// Components
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('erie_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('erie_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('erie_user');
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative border-x border-slate-200">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/recovery" element={<PasswordRecovery />} />
          
          {/* Rota Secreta de Acesso Admin - URL Privada */}
          <Route path="/admin-access-erie" element={<AdminLogin onLogin={handleLogin} />} />

          {/* User Routes */}
          <Route
            path="/"
            element={
              user ? (
                <MainLayout user={user} onLogout={handleLogout}>
                  <Home user={user} setUser={setUser} />
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
                <ChatRoom user={user} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/wallet"
            element={
              user ? (
                <MainLayout user={user} onLogout={handleLogout}>
                  <Wallet user={user} setUser={setUser} />
                </MainLayout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Admin Dashboard Protected */}
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

const MainLayout: React.FC<{ user: User; onLogout: () => void; children: React.ReactNode }> = ({ user, onLogout, children }) => {
  const location = useLocation();
  const hideBottomNav = location.pathname.startsWith('/chat/');

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar user={user} onLogout={onLogout} />
      <main className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 pb-20">
        {children}
      </main>
      {!hideBottomNav && <BottomNav />}
    </div>
  );
};

export default App;
