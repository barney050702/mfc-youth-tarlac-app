import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Book, Users, CheckSquare, Wallet, ListChecks, LogOut } from 'lucide-react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Sidebar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) navigate('/login');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <aside className="sidebar-drawer" style={{ transform: 'translateX(0)', display: 'flex', flexDirection: 'column' }}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="MFC Youth Logo" />
          <div>
            <h2>MFC Youth Tarlac</h2>
          </div>
        </div>
      </div>
      
      <div className="sidebar-profile">
        <div className="sidebar-avatar" style={{ background: '#4f46e5' }}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>{user?.email?.charAt(0).toUpperCase() || 'A'}</span>
        </div>
        <h3 style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100%' }}>
          {user?.displayName || (user?.email ? user.email.split('@')[0] : 'Admin')}
        </h3>
        <p>Full Access</p>
      </div>

      <nav className="sidebar-nav" style={{ flexGrow: 1 }}>
        <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Home size={20} /> Home
        </NavLink>
        <NavLink to="/activities" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Book size={20} /> <span style={{ flexGrow: 1, textAlign: 'left' }}>Activity Records</span>
        </NavLink>
        <NavLink to="/members" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
          <Users size={20} /> <span style={{ flexGrow: 1, textAlign: 'left' }}>Members</span>
        </NavLink>
      </nav>

      <div style={{ padding: '1rem' }}>
        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', color: '#ef4444', borderColor: '#ef4444' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      <div className="sidebar-footer">
        <span>@2026 Copyright</span>
        <span>version 2.0.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
