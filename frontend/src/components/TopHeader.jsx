import React from 'react';

export default function TopHeader({ activeTab, status }) {
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

      <div className="header-controls">
        <div className="status-badge" style={{ margin: 0 }}>
          <span className="status-dot"></span>
          <span>{status === 'online' ? 'Real-Time Feed' : 'Connecting...'}</span>
        </div>
      </div>
    </header>
  );
}
