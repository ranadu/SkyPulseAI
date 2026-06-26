import { Link } from 'react-router-dom';
import type { Aircraft } from '../types';
import { riskBadge, riskHex, healthHex, segmentColors } from '../utils/format';
import SubsystemBar from './SubsystemBar';

const SEGMENTS = 20;

export default function AircraftCard({ aircraft: ac }: { aircraft: Aircraft }) {
  const alertCount = ac.alerts.filter(a => !a.acknowledged).length;
  const healthColor = healthHex(ac.overallHealth);
  const segs = segmentColors(ac.overallHealth, SEGMENTS);
  const rColor = riskHex(ac.riskLevel);

  return (
    <Link
      to={`/aircraft/${ac.id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        className="panel"
        style={{
          transition: 'border-color 0.2s, background 0.2s',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = rColor + '55';
          (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-hover)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
          (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-panel)';
        }}
      >
        {/* Risk-colored top stripe */}
        <div style={{ height: 2, background: `linear-gradient(90deg, ${rColor} 0%, transparent 60%)` }} />

        <div style={{ padding: '16px 18px' }}>
          {/* Row 1: ident + risk badge */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 16,
                fontWeight: 700,
                color: '#e2eaf5',
                letterSpacing: '0.08em',
              }}>{ac.registration}</div>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 9,
                color: '#374561',
                letterSpacing: '0.14em',
                marginTop: 2,
              }}>{ac.id} / {ac.model.toUpperCase()}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
              <span className={riskBadge(ac.riskLevel)}>{ac.riskLevel}</span>
              {alertCount > 0 && (
                <span style={{
                  fontFamily: 'var(--font-data)',
                  fontSize: 9,
                  color: '#fb923c',
                  letterSpacing: '0.1em',
                }}>
                  ⚠ {alertCount} ALERT{alertCount !== 1 ? 'S' : ''}
                </span>
              )}
            </div>
          </div>

          {/* Row 2: big health number + overall bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                fontFamily: 'var(--font-data)',
                fontSize: 32,
                fontWeight: 700,
                color: healthColor,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>{ac.overallHealth}</div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.14em', marginTop: 2 }}>HEALTH</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                {segs.map((c, i) => (
                  <div key={i} style={{ flex: 1, height: 4, background: c }} />
                ))}
              </div>
              {/* mini stat row */}
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  ['FH', ac.flightHours.toLocaleString()],
                  ['CYC', ac.flightCycles.toLocaleString()],
                  ['REL', (ac.reliability * 100).toFixed(1) + '%'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.14em' }}>{k}</div>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#6b7fa3' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: 'var(--border-dim)', marginBottom: 12 }} />

          {/* Subsystem bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ac.subsystems.map(sub => (
              <SubsystemBar key={sub.name} sub={sub} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
