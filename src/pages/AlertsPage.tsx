import { Link } from 'react-router-dom';
import { useFleet } from '../store/fleetContext';
import { riskBadge, formatTime } from '../utils/format';
import type { RiskLevel } from '../types';

const SEV_COLOR: Record<RiskLevel, string> = {
  critical: '#f43f5e', high: '#fb923c', medium: '#facc15', low: '#22c55e',
};

export default function AlertsPage() {
  const { fleet } = useFleet();
  const alerts = fleet
    .flatMap(a => a.alerts)
    .sort((a, b) => b.detectedAt - a.detectedAt);

  const counts = { critical: 0, high: 0, medium: 0, low: 0 } as Record<RiskLevel, number>;
  alerts.forEach(a => counts[a.severity]++);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 3, height: 16, background: 'linear-gradient(180deg, #fb923c, transparent)' }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.2em', color: '#fb923c' }}>ALERT MANAGEMENT</span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 700, color: '#e2eaf5', margin: 0 }}>FLEET ALERTS</h1>
        <p style={{ fontSize: 12, color: '#374561', marginTop: 4 }}>{alerts.length} total alerts across all aircraft</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
        {(['critical','high','medium','low'] as RiskLevel[]).map(sev => (
          <div key={sev} className="panel" style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${SEV_COLOR[sev]}, transparent 60%)` }} />
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.16em', color: SEV_COLOR[sev], textTransform: 'uppercase', marginBottom: 6 }}>{sev}</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 28, fontWeight: 700, color: SEV_COLOR[sev] }}>{counts[sev]}</div>
          </div>
        ))}
      </div>

      <div className="panel">
        <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid var(--border-dim)' }}>
          <div style={{ width: 2, height: 12, background: '#e8a020' }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em', color: '#e8a020' }}>ALL ALERTS</span>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: '100px 90px 120px 1fr 90px',
          padding: '8px 18px', borderBottom: '1px solid var(--border-dim)',
          fontFamily: 'var(--font-data)', fontSize: 8, letterSpacing: '0.16em', color: '#374561', textTransform: 'uppercase',
        }}>
          {['Severity','Aircraft','Subsystem','Message','Time'].map(h => <span key={h}>{h}</span>)}
        </div>

        {alerts.map((alert, i) => (
          <div
            key={alert.id}
            style={{
              display: 'grid', gridTemplateColumns: '100px 90px 120px 1fr 90px',
              padding: '10px 18px',
              borderBottom: i < alerts.length - 1 ? '1px solid var(--border-dim)' : 'none',
              alignItems: 'center',
            }}
          >
            <span className={riskBadge(alert.severity)}>{alert.severity}</span>
            <Link to={`/aircraft/${alert.aircraftId}`} style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#22d3ee', textDecoration: 'none' }}>
              {alert.aircraftId}
            </Link>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#4a5a7a', letterSpacing: '0.08em' }}>
              {alert.subsystem.toUpperCase().replace('_',' ')}
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{alert.message}</span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>{formatTime(alert.detectedAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
