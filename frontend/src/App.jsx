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
import LoginScreen from './components/LoginScreen';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('serverui_token') || '');
  const [username, setUsername] = useState(() => localStorage.getItem('serverui_user') || '');

  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [status, setStatus] = useState('connecting');
  const [history, setHistory] = useState([]);

  const handleLoginSuccess = (newToken, newUsername) => {
    localStorage.setItem('serverui_token', newToken);
    localStorage.setItem('serverui_user', newUsername);
    setToken(newToken);
    setUsername(newUsername);
  };

  const handleLogout = () => {
    localStorage.removeItem('serverui_token');
    localStorage.removeItem('serverui_user');
    setToken('');
    setUsername('');
    setStats(null);
  };

  const fetchData = async () => {
    if (!token) return;

    try {
      const headers = { 'X-Auth-Token': token };
      const [statsRes, storageRes, procRes] = await Promise.all([
        fetch('/api/system/stats', { headers }),
        fetch('/api/storage', { headers }),
        fetch('/api/processes', { headers })
      ]);

      if (statsRes.status === 401) {
        handleLogout();
        return;
      }

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
    if (!token) return;
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [token]);

  if (!token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="vision-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} hostname={stats?.hostname} />

      <main className="main-content">
        <TopHeader
          activeTab={activeTab}
          status={status}
          battery={stats?.battery}
          username={username}
          onLogout={handleLogout}
        />

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
            <StorageList drives={drives} token={token} />
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
