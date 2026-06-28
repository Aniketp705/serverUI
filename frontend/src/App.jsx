import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SystemStats from './components/SystemStats';
import ServicesList from './components/ServicesList';
import StorageOverview from './components/StorageOverview';

export default function App() {
  const [stats, setStats] = useState(null);
  const [services, setServices] = useState([]);
  const [drives, setDrives] = useState([]);
  const [status, setStatus] = useState('connecting');

  const fetchData = async () => {
    try {
      const [statsRes, servicesRes, storageRes] = await Promise.all([
        fetch('/api/system/stats'),
        fetch('/api/services'),
        fetch('/api/storage')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        setStatus(statsData.status);
      }
      if (servicesRes.ok) {
        const servicesData = await servicesRes.json();
        setServices(servicesData.services);
      }
      if (storageRes.ok) {
        const storageData = await storageRes.json();
        setDrives(storageData.drives);
      }
    } catch (err) {
      console.error('Failed to fetch server metrics:', err);
      setStatus('offline');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">
      <Navbar status={status} uptime={stats?.uptime_seconds} />
      <main className="dashboard-grid">
        <SystemStats stats={stats} />
        <ServicesList services={services} />
        <StorageOverview drives={drives} />
      </main>
    </div>
  );
}
