import React from 'react';

export default function HealthGauge({ stats }) {
  // Compute health score based on inverse of RAM and CPU pressure
  const cpuVal = stats?.cpu?.usage_percent || 0;
  const ramVal = stats?.memory?.percent || 0;
  const avgLoad = (cpuVal + ramVal) / 2;
  const healthScore = Math.max(10, Math.round(100 - avgLoad));

  // SVG circle calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="vision-card gauge-container">
      <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
        System Efficiency Rate
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time load metric</div>

      <div className="circular-gauge">
        <svg viewBox="0 0 100 100">
          <circle className="circle-bg" cx="50" cy="50" r={radius} />
          <circle
            className="circle-fill"
            cx="50"
            cy="50"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            stroke={healthScore > 70 ? 'var(--accent-green)' : healthScore > 40 ? 'var(--accent-orange)' : 'var(--accent-red)'}
          />
        </svg>
        <div className="gauge-text" style={{ color: healthScore > 70 ? 'var(--accent-green)' : 'var(--text-main)' }}>
          {healthScore}%
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: 'var(--accent-green)', fontWeight: 600 }}>
        {healthScore > 80 ? '✦ Smooth Operation' : healthScore > 50 ? '✦ Normal Workload' : '⚠️ Heavy Load'}
      </div>
    </div>
  );
}
