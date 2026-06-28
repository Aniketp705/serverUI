import React from 'react';

export default function ServicesList({ services }) {
  return (
    <div className="card services-card">
      <div className="card-header">
        <h2 className="card-title">🚀 Hosted Services ({services.length})</h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Click service to open</span>
      </div>
      <div className="services-grid">
        {services.map((service) => (
          <a 
            key={service.id} 
            href={service.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="service-item"
          >
            <div className="service-info">
              <span className="service-name">{service.name}</span>
              <span className="service-meta">{service.category} • Port {service.port}</span>
            </div>
            <span className={service.status === 'running' ? 'badge-running' : 'badge-stopped'}>
              {service.status.toUpperCase()}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
