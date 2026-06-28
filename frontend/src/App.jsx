import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import MetricCards from './components/MetricCards';
import WelcomeBanner from './components/WelcomeBanner';
import HealthGauge from './components/HealthGauge';
import SwapBreakdown from './components/SwapBreakdown';
import TelemetryChart from './components/TelemetryChart';
import ProcessTable from './components/ProcessTable';
import StorageList from './components/StorageList';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [status, setStatus] = useState('connecting');
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    try {
      const [statsRes, storageRes, procRes] = await Promise.all([
        fetch('/api/system/stats'),
        fetch('/api/storage'),
        fetch('/api/processes')
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
        setStatus(statsData.status);

        setHistory((prev) => {
          const newPoint = { cpu: statsData.cpu.usage_percent, ram: statsData.memory.percent };
          const updated = [...prev, newPoint];
          return updated.slice(-15);
        });
      }

      if (storageRes.ok) {
        const storageData = await storageRes.json();
        setDrives(storageData.drives);
      }

      if (procRes.ok) {
        const procData = await procRes.json();
        setProcesses(procData.processes);
      }
    } catch (err) {
      console.error('Telemetry stream error:', err);
      setStatus('offline');
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vision-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} hostname={stats?.hostname} />

      <main className="main-content">
        <TopHeader activeTab={activeTab} status={status} />

        {activeTab === 'dashboard' && (
          <>
            <MetricCards stats={stats} />

            <div className="middle-row">
              <WelcomeBanner stats={stats} />
              <HealthGauge stats={stats} />
              <SwapBreakdown stats={stats} />
            </div>

            <div className="bottom-row">
              <TelemetryChart history={history} />
              <ProcessTable processes={processes} />
            </div>
          </>
        )}

        {activeTab === 'storage' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <StorageList drives={drives} />
          </div>
        )}

        {activeTab === 'processes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ProcessTable processes={processes} />
          </div>
        )}
      </main>
    </div>
  );
}
