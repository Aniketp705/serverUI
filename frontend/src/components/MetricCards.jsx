import React from 'react';

export default function MetricCards({ stats }) {
  const cpu = stats?.cpu || { usage_percent: 0, cores: 1 };
  const memory = stats?.memory || { used_gb: 0, total_gb: 0, percent: 0 };
  const network = stats?.network || { sent_kbps: 0, recv_kbps: 0 };
  
  const formatUptime = (seconds) => {
    if (!seconds) return '0h 0m';
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  return (
    <div className="metrics-row">
      {/* CPU Usage */}
      <div className="vision-card metric-card">
        <div>
          <div className="metric-label">CPU LOAD</div>
          <div className="metric-val">{cpu.usage_percent}%</div>
          <div className="metric-sub">{cpu.cores} Active Cores</div>
        </div>
        <div className="metric-icon-box" style={{ background: 'linear-gradient(135deg, #0075ff, #00f2fe)' }}>
          ⚡
        </div>
      </div>

      {/* Memory Usage */}
      <div className="vision-card metric-card">
        <div>
          <div className="metric-label">MEMORY (RAM)</div>
          <div className="metric-val">{memory.percent}%</div>
          <div className="metric-sub" style={{ color: 'var(--text-muted)' }}>
            {memory.used_gb} / {memory.total_gb} GB
          </div>
        </div>
        <div className="metric-icon-box" style={{ background: 'linear-gradient(135deg, #7551ff, #a855f7)' }}>
          🧠
        </div>
      </div>

      {/* Network Speed */}
      <div className="vision-card metric-card">
        <div>
          <div className="metric-label">NETWORK IO</div>
          <div className="metric-val" style={{ fontSize: '1.2rem' }}>
            ↓ {network.recv_kbps} <span style={{ fontSize: '0.7rem' }}>KB/s</span>
          </div>
          <div className="metric-sub" style={{ color: 'var(--accent-cyan)' }}>
            ↑ {network.sent_kbps} KB/s
          </div>
        </div>
        <div className="metric-icon-box" style={{ background: 'linear-gradient(135deg, #01b574, #10b981)' }}>
          🌐
        </div>
      </div>

      {/* Uptime */}
      <div className="vision-card metric-card">
        <div>
          <div className="metric-label">SYSTEM UPTIME</div>
          <div className="metric-val" style={{ fontSize: '1.3rem' }}>{formatUptime(stats?.uptime_seconds)}</div>
          <div className="metric-sub" style={{ color: 'var(--accent-orange)' }}>
            Health: Optimal
          </div>
        </div>
        <div className="metric-icon-box" style={{ background: 'linear-gradient(135deg, #ffb547, #f59e0b)' }}>
          ⏱️
        </div>
      </div>
    </div>
  );
}
