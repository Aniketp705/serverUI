import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, hostname }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
    { id: 'storage', label: 'Storage & Drives', icon: '💾' },
    { id: 'processes', label: 'Running Processes', icon: '📊' },
  ];

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-brand">
          <div className="brand-logo">S</div>
          <div className="brand-text">VISION SERVER</div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <div className="nav-icon">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      <div className="sidebar-footer-card">
        <h4 style={{ fontSize: '0.9rem', marginBottom: '0.4rem' }}>Host Telemetry</h4>
        <p style={{ fontSize: '0.75rem', opacity: 0.9 }}>
          Node: <strong style={{ color: '#fff' }}>{hostname || 'Server'}</strong>
        </p>
        <div style={{ marginTop: '0.8rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '8px', display: 'inline-block' }}>
          Real-time Engine Active
        </div>
      </div>
    </aside>
  );
}
