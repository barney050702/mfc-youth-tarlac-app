import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout: React.FC = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <Header />
      <main style={{ marginLeft: 'var(--sidebar-width)', paddingTop: 'var(--header-height)', minHeight: '100vh', backgroundColor: 'var(--bg-dark)', padding: 'calc(var(--header-height) + 2rem) 2rem 2rem 2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
