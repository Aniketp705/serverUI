import React from 'react';

export default function SystemStats({ stats }) {
  const cpu = stats?.cpu || { usage_percent: 0, cores: 4 };
  const memory = stats?.memory || { total_gb: 0, used_gb: 0, percent: 0 };
  const disk = stats?.disk || { total_gb: 0, used_gb: 0, percent: 0 };

  return (
    <div className="stats-container">
      {/* CPU Card */}
      <div className="card stat-card">
        <div className="metric-header">
          <span>CPU USAGE</span>
          <span>{cpu.cores} Cores</span>
        </div>
        <div className="metric-value" style={{ color: 'var(--primary)' }}>
          {cpu.usage_percent}%
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${cpu.usage_percent}%`,
              background: 'linear-gradient(90deg, #6366f1, #818cf8)'
            }}
          ></div>
        </div>
      </div>

      {/* RAM Card */}
      <div className="card stat-card">
        <div className="metric-header">
          <span>MEMORY (RAM)</span>
          <span>{memory.used_gb} GB / {memory.total_gb} GB</span>
        </div>
        <div className="metric-value" style={{ color: 'var(--accent-cyan)' }}>
          {memory.percent}%
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${memory.percent}%`,
              background: 'linear-gradient(90deg, #06b6d4, #38bdf8)'
            }}
          ></div>
        </div>
      </div>

      {/* Primary Storage Card */}
      <div className="card stat-card">
        <div className="metric-header">
          <span>SYSTEM STORAGE (ROOT)</span>
          <span>{disk.used_gb} GB / {disk.total_gb} GB</span>
        </div>
        <div className="metric-value" style={{ color: 'var(--accent-orange)' }}>
          {disk.percent}%
        </div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ 
              width: `${disk.percent}%`,
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}
