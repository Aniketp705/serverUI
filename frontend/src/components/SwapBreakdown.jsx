import React from 'react';

export default function SwapBreakdown({ stats }) {
  const swap = stats?.swap || { used_gb: 0, total_gb: 0, percent: 0 };
  const mem = stats?.memory || { free_gb: 0, total_gb: 0 };

  return (
    <div className="vision-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Virtual Memory Breakdown</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Swap & RAM allocation</div>
      </div>

      <div style={{ margin: '1rem 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
          <span>Swap File</span>
          <span>{swap.percent}% ({swap.used_gb} / {swap.total_gb} GB)</span>
        </div>
        <div className="progress-bar-bg" style={{ height: '6px' }}>
          <div className="progress-bar-fill" style={{ width: `${swap.percent}%`, background: 'var(--accent-purple)' }}></div>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
          <span>Available Free RAM</span>
          <span>{mem.free_gb} GB</span>
        </div>
        <div className="progress-bar-bg" style={{ height: '6px' }}>
          <div className="progress-bar-fill" style={{ width: `${(mem.free_gb / (mem.total_gb || 1)) * 100}%`, background: 'var(--accent-cyan)' }}></div>
        </div>
      </div>
    </div>
  );
}
