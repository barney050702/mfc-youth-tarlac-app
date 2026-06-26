import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Users, CalendarClock, CalendarRange } from 'lucide-react';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState('Admin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsername(user.displayName || (user.email ? user.email.split('@')[0] : 'Admin'));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div id="panel-dashboard" className="animate-fade-in">
      <section className="welcome-banner" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-hover) 100%)', color: 'white', padding: '1.75rem 2rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 15px var(--primary-glow)' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem', marginTop: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Hello, {username} ! 👋
        </h1>
        <p style={{ fontSize: '0.95rem', opacity: 0.9, margin: 0, maxWidth: '600px', lineHeight: 1.5 }}>
          Welcome to your centralized hub. Access your youth activity information, records, and resources in real-time.
        </p>
      </section>

      <section className="dashboard-stats">
        <div className="stat-card hover:scale-105 transition-transform">
          <div className="stat-icon purple"><Calendar /></div>
          <div className="stat-info">
            <h3>-</h3>
            <p>Total Activities</p>
          </div>
        </div>
        <div className="stat-card hover:scale-105 transition-transform">
          <div className="stat-icon green"><CheckCircle2 /></div>
          <div className="stat-info">
            <h3>-</h3>
            <p>Accomplished</p>
          </div>
        </div>
        <div className="stat-card hover:scale-105 transition-transform">
          <div className="stat-icon orange"><Users /></div>
          <div className="stat-info">
            <h3>-</h3>
            <p>Total Members</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
