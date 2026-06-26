import { Link } from 'react-router-dom';
import { getAllRecommendations } from '../data/fleet';
import { riskBadge } from '../utils/format';
import type { RiskLevel } from '../types';

const RPN_COLOR: Record<RiskLevel, string> = {
  critical: '#f43f5e', high: '#fb923c', medium: '#facc15', low: '#22c55e',
};

export default function MaintenancePage() {
  const recs = getAllRecommendations();

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 3, height: 16, background: 'linear-gradient(180deg, #22d3ee, transparent)' }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.2em', color: '#22d3ee' }}>
            MAINTENANCE CONTROL
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 700, color: '#e2eaf5', margin: 0 }}>
          OPEN WORK ORDERS
        </h1>
        <p style={{ fontSize: 12, color: '#374561', marginTop: 4 }}>
          {recs.length} items / sorted by Risk Priority Number (RPN = S × P × D)
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recs.map((rec, i) => {
          const c = RPN_COLOR[rec.riskLevel];
          return (
            <div
              key={rec.id}
              className="panel"
              style={{ overflow: 'hidden', position: 'relative' }}
            >
              {/* Risk-color left bar */}
              <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, background: c }} />

              <div style={{ padding: '14px 20px 14px 26px' }}>
                {/* Row 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={riskBadge(rec.riskLevel)}>{rec.riskLevel}</span>
                    <Link
                      to={`/aircraft/${rec.aircraftId}`}
                      style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#22d3ee', textDecoration: 'none', letterSpacing: '0.08em' }}
                    >
                      {rec.aircraftId}
                    </Link>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', letterSpacing: '0.1em' }}>
                      {rec.subsystem.toUpperCase().replace('_',' ')}
                    </span>
                  </div>

                  {/* RPN box */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.14em', marginBottom: 2 }}>
                      RISK PRIORITY NUMBER
                    </div>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 700, color: c, lineHeight: 1 }}>
                      {rec.riskScore}
                    </div>
                  </div>
                </div>

                {/* Issue + reason */}
                <div style={{ fontWeight: 600, fontSize: 13, color: '#c8d5e8', marginBottom: 4 }}>{rec.issue}</div>
                <div style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.6, marginBottom: 10 }}>{rec.engineeringReason}</div>

                {/* Footer */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  borderTop: '1px solid var(--border-dim)', paddingTop: 10,
                }}>
                  <div>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', letterSpacing: '0.1em' }}>
                      ACTION:{' '}
                    </span>
                    <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22d3ee' }}>{rec.action}</span>
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-data)', fontSize: 10, color: '#fb923c',
                    letterSpacing: '0.1em', fontWeight: 700,
                  }}>
                    WITHIN {rec.windowHours} FH
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
