import React from 'react';

export default function TopHeader({ activeTab, status, battery, username, onLogout }) {
  const titles = {
    dashboard: 'System Overview Dashboard',
    storage: 'Storage Partitions & Drives',
    processes: 'Active System Processes'
  };

  return (
    <header className="top-header">
      <div>
        <div className="breadcrumbs">Pages / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</div>
        <h1 className="page-title">{titles[activeTab] || 'Dashboard'}</h1>
      </div>

      <div className="header-controls" style={{ gap: '1rem' }}>
        {battery && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 0.85rem',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--card-border)',
            borderRadius: '20px',
            fontSize: '0.8rem',
            color: '#fff',
            fontWeight: 500
          }}>
            <span>{battery.power_plugged ? '⚡' : '🔋'}</span>
            <span>{battery.percent}% ({battery.status})</span>
          </div>
        )}

        <div className="status-badge" style={{ margin: 0 }}>
          <span className="status-dot"></span>
          <span>{status === 'online' ? 'Real-Time Feed' : 'Connecting...'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>👤 {username}</span>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(238, 93, 80, 0.15)',
              border: '1px solid rgba(238, 93, 80, 0.3)',
              color: 'var(--accent-red)',
              padding: '0.35rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
