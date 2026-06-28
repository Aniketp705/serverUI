import React from 'react';

export default function TelemetryChart({ history }) {
  const pointsCount = history.length;

  if (pointsCount < 2) {
    return (
      <div className="vision-card">
        <div style={{ fontSize: '1rem', fontWeight: 600 }}>System Telemetry Overview</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
          Collecting real-time telemetry stream...
        </div>
      </div>
    );
  }

  // Pure SVG coordinate grid layout constants
  const svgWidth = 600;
  const svgHeight = 220;
  const xMin = 60;   // Left margin for Y-axis labels
  const xMax = 585;  // Right margin
  const yMin = 25;   // Top margin (100% level)
  const yMax = 175;  // Bottom margin (0% level)

  const chartWidth = xMax - xMin;   // 525px
  const chartHeight = yMax - yMin; // 150px

  // Helper to convert percentage (0-100) to SVG Y coordinate
  const getY = (val) => {
    const clamped = Math.max(0, Math.min(100, val || 0));
    return yMax - (clamped / 100) * chartHeight;
  };

  // Helper to convert index to SVG X coordinate
  const getX = (index) => {
    return xMin + (index / (pointsCount - 1)) * chartWidth;
  };

  // Generate SVG path strings
  const cpuPoints = history.map((h, i) => `${getX(i)},${getY(h.cpu)}`).join(' L ');
  const ramPoints = history.map((h, i) => `${getX(i)},${getY(h.ram)}`).join(' L ');

  // Define exact Y-axis grid levels
  const levels = [
    { pct: 100, label: '100%', y: getY(100) },
    { pct: 75,  label: '75%',  y: getY(75) },
    { pct: 50,  label: '50%',  y: getY(50) },
    { pct: 25,  label: '25%',  y: getY(25) },
    { pct: 0,   label: '0%',   y: getY(0) }
  ];

  return (
    <div className="vision-card">
      {/* Card Title & Legend Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>System Telemetry Overview</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time CPU vs RAM load timeline</div>
        </div>
        <div style={{ display: 'flex', gap: '1.2rem', fontSize: '0.8rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--primary)' }}></span>
            CPU (%)
          </span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }}></span>
            RAM (%)
          </span>
        </div>
      </div>

      {/* Pure SVG Chart with Integrated Labels & Grid */}
      <div style={{ width: '100%', overflow: 'hidden' }}>
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          style={{ width: '100%', height: 'auto', display: 'block' }}
        >
          {/* Horizontal Grid Lines & Y-Axis Percentage Labels */}
          {levels.map((lvl) => (
            <g key={lvl.label}>
              {/* Grid Line */}
              <line
                x1={xMin}
                y1={lvl.y}
                x2={xMax}
                y2={lvl.y}
                stroke={lvl.pct === 0 ? "rgba(255, 255, 255, 0.25)" : "rgba(255, 255, 255, 0.08)"}
                strokeDasharray={lvl.pct === 0 || lvl.pct === 100 ? "none" : "4 4"}
                strokeWidth={lvl.pct === 0 ? "1.5" : "1"}
              />
              {/* Y Label */}
              <text
                x={xMin - 10}
                y={lvl.y + 4}
                textAnchor="end"
                fill="#a0aec0"
                fontSize="12"
                fontWeight="600"
                fontFamily="inherit"
              >
                {lvl.label}
              </text>
            </g>
          ))}

          {/* Y-Axis Solid Left Border Line */}
          <line x1={xMin} y1={yMin} x2={xMin} y2={yMax} stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />

          {/* X-Axis Time Markers */}
          <text x={xMin} y={yMax + 24} textAnchor="start" fill="#a0aec0" fontSize="11" fontWeight="500">-45s</text>
          <text x={xMin + chartWidth * 0.33} y={yMax + 24} textAnchor="middle" fill="#a0aec0" fontSize="11" fontWeight="500">-30s</text>
          <text x={xMin + chartWidth * 0.66} y={yMax + 24} textAnchor="middle" fill="#a0aec0" fontSize="11" fontWeight="500">-15s</text>
          <text x={xMax} y={yMax + 24} textAnchor="end" fill="var(--accent-green)" fontSize="12" fontWeight="700">LIVE</text>

          {/* RAM Telemetry Data Line */}
          <path
            d={`M ${ramPoints}`}
            fill="none"
            stroke="var(--accent-cyan)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* CPU Telemetry Data Line */}
          <path
            d={`M ${cpuPoints}`}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
