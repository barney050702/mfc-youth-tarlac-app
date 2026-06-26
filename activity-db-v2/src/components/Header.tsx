import React from 'react';
import { Menu, Globe, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo-area">
        <div className="header-nav-icons" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem', borderRadius: '8px' }}>
          <Menu id="main-menu-trigger" />
        </div>
      </div>
      <div className="header-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--primary)', marginRight: '1rem' }}>
          <a href="https://mfcyouth.org/" target="_blank" rel="noreferrer" className="web-link-icon">
            <Globe />
          </a>
          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(255,255,255,0.15)' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <img src="/logo.png" alt="MFC Youth Logo" style={{ height: '32px', width: '32px', objectFit: 'cover', borderRadius: '50%', backgroundColor: 'transparent' }} />
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary)', margin: 0, whiteSpace: 'nowrap' }}>MFC YOUTH TARLAC PORTAL</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
