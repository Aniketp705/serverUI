import React from 'react';

export default function StorageOverview({ drives }) {
  return (
    <div className="card storage-card">
      <div className="card-header">
        <h2 className="card-title">💾 Drives & Pools</h2>
      </div>
      <div className="drive-list">
        {drives.map((drive, idx) => {
          const usedPct = Math.round((drive.used_gb / drive.total_gb) * 100);
          return (
            <div key={idx} className="drive-item">
              <div className="drive-header">
                <span>{drive.name}</span>
                <span style={{ color: 'var(--text-muted)' }}>{drive.temp}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {drive.used_gb} GB / {drive.total_gb} GB ({usedPct}%)
              </div>
              <div className="progress-bar-bg" style={{ marginTop: 0 }}>
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${usedPct}%`,
                    background: usedPct > 85 ? 'var(--accent-orange)' : 'var(--primary)'
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
