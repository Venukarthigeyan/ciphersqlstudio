import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';

const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const AssignmentsPage = React.lazy(() => import('./pages/AssignmentsPage'));
const AttemptPage = React.lazy(() => import('./pages/AttemptPage'));

export default function App() {
  const { user, loading, logoutUser } = useAuth();
  const [selectedId, setSelectedId] = useState(null);

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#0d0f14',
      color: '#7a7f94', fontFamily: 'JetBrains Mono, monospace', fontSize: 14
    }}>
      Loading...
    </div>
  );
 
  if (!user) {
    return (
      <React.Suspense fallback={null}>
        <AuthPage />
      </React.Suspense>
    );
  }
 
  return (
    <div>
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <div
            className="app-header__logo"
            style={{ cursor: 'pointer' }}
            onClick={() => setSelectedId(null)}
          >
            CipherSQL<span style={{ color: '#f5c518' }}>Studio</span>
          </div>
          <div className="app-header__subtitle">practice. query. master.</div>
        </div>

        {/* User info + logout */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: 'JetBrains Mono, monospace'
        }}>
          <span style={{ fontSize: 12, color: '#7a7f94', display: 'none' }}
            className="user-greeting">
            Hi, {user.name}
          </span>
          <button
            onClick={() => { logoutUser(); setSelectedId(null); }}
            style={{
              background: 'rgba(255,77,109,0.1)',
              border: '1px solid rgba(255,77,109,0.3)',
              color: '#ff4d6d',
              borderRadius: 6,
              padding: '6px 14px',
              cursor: 'pointer',
              fontSize: 12,
              fontFamily: 'JetBrains Mono, monospace',
              minHeight: 36,
              whiteSpace: 'nowrap'
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      <React.Suspense fallback={
        <div style={{ padding: 40, color: '#7a7f94', fontFamily: 'JetBrains Mono,monospace' }}>
          Loading...
        </div>
      }>
        {selectedId === null
          ? <AssignmentsPage onSelect={setSelectedId} />
          : <AttemptPage id={selectedId} onBack={() => setSelectedId(null)} userId={user.id} />
        }
      </React.Suspense>
    </div>
  );
}