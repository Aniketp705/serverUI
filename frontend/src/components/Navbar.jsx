import React from 'react';

export default function Navbar({ status, uptime }) {
  const formatUptime = (seconds) => {
    if (!seconds) return '0h 0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <nav className="navbar">
      <div className="brand">
        <div className="brand-icon">⚡</div>
        <div>
          <h1 className="brand-title">HomeServer OS</h1>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Uptime: <strong style={{ color: 'var(--text-main)' }}>{formatUptime(uptime)}</strong>
        </span>
        <div className="status-badge">
          <span className="status-dot"></span>
          <span>{status === 'online' ? 'System Online' : 'Connecting...'}</span>
        </div>
      </div>
    </nav>
  );
}
