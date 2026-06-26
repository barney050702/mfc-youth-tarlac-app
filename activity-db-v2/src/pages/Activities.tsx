import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { FolderOpen, Search, RefreshCw, FileText, Download, Upload } from 'lucide-react';

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'activities'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setActivities(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div id="panel-activities" className="animate-fade-in">
      <div className="page-banner">
        <h2 className="page-banner-title">Accomplished Activities</h2>
        <p className="page-banner-subtitle">View the complete history of your accomplished activities.</p>
      </div>

      <section className="controls-panel">
        <div className="filters-group">
          <div className="search-box">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Search activity..." />
          </div>
        </div>
      </section>

      <div className="activities-cards-container">
        {loading ? (
          // Skeleton Loader
          Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="animate-pulse" style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <div style={{ height: '24px', width: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '1rem' }}></div>
              <div style={{ height: '16px', width: '40%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
              <div style={{ height: '16px', width: '30%', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}></div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="empty-state">
            <FolderOpen size={48} className="empty-icon" />
            <h3>No activities found</h3>
            <p>Your database is currently empty.</p>
          </div>
        ) : (
          activities.map((act, index) => (
            <div key={index} style={{ background: 'var(--card-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              <h3 style={{ color: 'white', marginTop: 0 }}>{act.activity || 'Unnamed Activity'}</h3>
              <p style={{ color: 'var(--text-muted)' }}>Venue: {act.venue || 'N/A'}</p>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Participants: {act.participants || 0}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Activities;
