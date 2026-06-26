import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="welcome-screen" className="welcome-container" style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <div className="welcome-card" style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
        <div className="welcome-logo-area" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img src="/logo.png" alt="MFC Youth Logo" className="welcome-logo" style={{ width: '80px', height: '80px', margin: '0 auto' }} />
        </div>
        <h1 className="welcome-title" style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '0.5rem' }}>MFC YOUTH TARLAC</h1>
        <p className="welcome-subtitle" style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Secure Admin Portal</p>

        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleLogin} className="welcome-admin-form">
          <div className="welcome-input-group" style={{ marginBottom: '1rem' }}>
            <input 
              type="email" 
              placeholder="Admin Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
            />
          </div>
          <div className="welcome-input-group" style={{ marginBottom: '1.5rem' }}>
            <input 
              type="password" 
              placeholder="Admin Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'white' }}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', fontWeight: 'bold' }}
          >
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
