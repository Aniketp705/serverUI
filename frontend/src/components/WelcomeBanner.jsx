import React from 'react';

export default function WelcomeBanner({ stats }) {
  const bat = stats?.battery;

  return (
    <div className="vision-card welcome-card">
      <div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>HOST SYSTEM INFO</span>
        <h2 style={{ fontSize: '1.6rem', marginTop: '0.2rem', color: '#fff' }}>
          {stats?.hostname || 'Home Server'}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.4rem', maxWidth: '350px' }}>
          Platform: <strong style={{ color: 'var(--accent-cyan)' }}>{stats?.os || 'Linux / Windows'}</strong>
          <br />
          Core Architecture: <strong style={{ color: '#fff' }}>{stats?.cpu?.cores || 1} Threads</strong>
          {bat && (
            <>
              <br />
              Power Source: <strong style={{ color: 'var(--accent-green)' }}>{bat.percent}% ({bat.status})</strong>
            </>
          )}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Sent</div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{stats?.network?.total_sent_mb || 0} MB</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Net Received</div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{stats?.network?.total_recv_mb || 0} MB</div>
        </div>
      </div>
    </div>
  );
}
