import React from 'react';

export default function ProcessTable({ processes }) {
  return (
    <div className="vision-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Top Active Processes</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sorted by memory consumption</div>
        </div>
      </div>

      <table className="process-table">
        <thead>
          <tr>
            <th>PID</th>
            <th>PROCESS NAME</th>
            <th>CPU %</th>
            <th>MEMORY</th>
          </tr>
        </thead>
        <tbody>
          {processes.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                Loading live processes...
              </td>
            </tr>
          ) : (
            processes.map((proc) => (
              <tr key={proc.pid}>
                <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace' }}>{proc.pid}</td>
                <td style={{ fontWeight: 600, color: '#fff' }}>{proc.name}</td>
                <td style={{ color: proc.cpu_percent > 10 ? 'var(--accent-orange)' : 'var(--text-main)' }}>
                  {proc.cpu_percent}%
                </td>
                <td>{proc.memory_mb} MB</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
