import React, { useState, useEffect } from 'react';

export default function StorageList({ drives }) {
  const [selectedPath, setSelectedPath] = useState(null);
  const [browseData, setBrowseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDriveTitle = (device, mount) => {
    if (!mount) return device || 'Disk Partition';
    const cleanDevice = (device || '').replace(/[\/\\]/g, '').toUpperCase();
    const cleanMount = mount.replace(/[\/\\]/g, '').toUpperCase();

    if (!device || cleanDevice === cleanMount) {
      return `Local Disk (${cleanMount})`;
    }
    return `${device} (${mount})`;
  };

  const fetchDirectory = async (path) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/storage/browse?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (res.ok) {
        setBrowseData(data);
      } else {
        setError(data.error || 'Failed to open directory');
      }
    } catch (err) {
      setError('Network error browsing folder');
    } finally {
      setLoading(false);
    }
  };

  const handleDriveClick = (mount) => {
    setSelectedPath(mount);
    fetchDirectory(mount);
  };

  const handleItemClick = (item) => {
    if (item.is_dir) {
      setSelectedPath(item.path);
      fetchDirectory(item.path);
    }
  };

  const handleParentClick = () => {
    if (!selectedPath) return;
    // Calculate parent folder path
    const parts = selectedPath.replace(/[/\\]$/, '').split(/[/\\]/);
    if (parts.length <= 1 || (parts.length === 2 && parts[1] === '')) {
      setSelectedPath(null);
      setBrowseData(null);
    } else {
      parts.pop();
      let parentPath = parts.join('\\');
      if (parentPath.length === 2 && parentPath.endsWith(':')) {
        parentPath += '\\';
      }
      setSelectedPath(parentPath);
      fetchDirectory(parentPath);
    }
  };

  return (
    <div className="vision-card">
      {/* Partition Cards View */}
      {!selectedPath ? (
        <>
          <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>
            Physical Disks & Mounts
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Click any partition card to browse its files & folders
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {drives.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Detecting physical partitions...</div>
            ) : (
              drives.map((drive, idx) => (
                <div
                  key={idx}
                  onClick={() => handleDriveClick(drive.mount)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '14px',
                    padding: '1.2rem',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0, 117, 255, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#fff' }}>
                      💾 {formatDriveTitle(drive.device, drive.mount)}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{drive.fstype}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                    {drive.used_gb} GB used / {drive.free_gb} GB free ({drive.total_gb} GB Total)
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${drive.percent}%`,
                        background: drive.percent > 85 ? 'var(--accent-orange)' : 'linear-gradient(90deg, #0075ff, #00f2fe)'
                      }}
                    ></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.6rem', fontWeight: 600, textAlign: 'right' }}>
                    Browse Files →
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        /* File Explorer View */
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => { setSelectedPath(null); setBrowseData(null); }}
                style={{
                  background: '#1a1f37',
                  border: '1px solid var(--card-border)',
                  color: '#fff',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                ← All Drives
              </button>
              <button
                onClick={handleParentClick}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--card-border)',
                  color: 'var(--text-muted)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                ⬆ Up Folder
              </button>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, fontFamily: 'monospace' }}>
              {selectedPath}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Opening folder contents...
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-red)' }}>
              ⚠️ {error}
            </div>
          ) : (
            <div style={{ maxHeight: '450px', overflowY: 'auto' }}>
              <table className="process-table">
                <thead>
                  <tr>
                    <th style={{ width: '60%' }}>NAME</th>
                    <th style={{ width: '20%' }}>TYPE</th>
                    <th style={{ width: '20%', textAlign: 'right' }}>SIZE</th>
                  </tr>
                </thead>
                <tbody>
                  {browseData?.items?.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                        This folder is empty.
                      </td>
                    </tr>
                  ) : (
                    browseData?.items?.map((item, idx) => (
                      <tr
                        key={idx}
                        onClick={() => handleItemClick(item)}
                        style={{ cursor: item.is_dir ? 'pointer' : 'default' }}
                      >
                        <td style={{ color: item.is_dir ? '#fff' : 'var(--text-muted)', fontWeight: item.is_dir ? 600 : 400 }}>
                          {item.is_dir ? '📁 ' : '📄 '} {item.name}
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                          {item.is_dir ? 'Directory' : 'File'}
                        </td>
                        <td style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {item.is_dir ? '--' : item.size_mb > 1024 ? `${(item.size_mb / 1024).toFixed(2)} GB` : `${item.size_mb} MB`}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
