import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { getAircraft } from '../data/fleet';
import { riskBadge, healthHex, formatDate, segmentColors } from '../utils/format';
import SubsystemBar from '../components/SubsystemBar';

const SEGMENTS = 24;

/* ── Custom tooltip ─────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0b1018', border: '1px solid #1a2235',
      padding: '8px 12px', fontFamily: 'var(--font-data)', fontSize: 10,
    }}>
      <div style={{ color: '#374561', marginBottom: 6, letterSpacing: '0.1em' }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ color: '#e2eaf5' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 2, height: 12, background: '#e8a020' }} />
      <span style={{
        fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em',
        color: '#e8a020', textTransform: 'uppercase',
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border-dim)' }} />
    </div>
  );
}

export default function AircraftDetail() {
  const { id } = useParams<{ id: string }>();
  const ac = getAircraft(id ?? '');

  if (!ac) {
    return (
      <div style={{ maxWidth: 900, margin: '80px auto', textAlign: 'center' }}>
        <p style={{ color: '#374561', fontFamily: 'var(--font-data)' }}>AIRCRAFT NOT FOUND</p>
        <Link to="/" style={{ color: '#e8a020', fontFamily: 'var(--font-data)', fontSize: 11 }}>
          RETURN TO FLEET
        </Link>
      </div>
    );
  }

  const chartData = ac.telemetry.readings
    .filter((_, i) => i % 4 === 0)
    .map(r => ({
      t: new Date(r.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      'ENG TEMP': Math.round(r.engineTemp),
      'VIBRATION': parseFloat(r.engineVibration.toFixed(2)),
      'OIL PSI': Math.round(r.oilPressure),
    }));

  const elecData = ac.telemetry.readings
    .filter((_, i) => i % 4 === 0)
    .map(r => ({
      t: new Date(r.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      'BAT V': parseFloat(r.batteryVoltage.toFixed(2)),
      'GEN V': parseFloat((r.generatorVoltage).toFixed(1)),
      'AV TEMP': Math.round(r.avionicsTemp),
    }));

  const healthColor = healthHex(ac.overallHealth);
  const segs = segmentColors(ac.overallHealth, SEGMENTS);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>

      {/* Back */}
      <Link
        to="/"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.14em',
          color: '#374561', textDecoration: 'none', marginBottom: 20,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => ((e.target as HTMLElement).style.color = '#e8a020')}
        onMouseLeave={e => ((e.target as HTMLElement).style.color = '#374561')}
      >
        <ArrowLeft size={11} /> RETURN TO FLEET
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{
              fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em',
              color: '#e8a020', textTransform: 'uppercase',
            }}>Aircraft Detail</span>
          </div>
          <h1 style={{
            fontFamily: 'var(--font-data)', fontSize: 28, fontWeight: 700,
            color: '#e2eaf5', margin: 0, letterSpacing: '0.06em',
          }}>{ac.registration}</h1>
          <p style={{
            fontFamily: 'var(--font-data)', fontSize: 10, color: '#374561',
            margin: '4px 0 0', letterSpacing: '0.1em',
          }}>{ac.id} / {ac.model.toUpperCase()}</p>
        </div>
        <span className={riskBadge(ac.riskLevel)} style={{ fontSize: 11 }}>
          {ac.riskLevel.toUpperCase()} RISK
        </span>
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
        {[
          { k: 'FLIGHT HOURS', v: ac.flightHours.toLocaleString() },
          { k: 'CYCLES', v: ac.flightCycles.toLocaleString() },
          { k: 'MTBF', v: ac.mtbf.toLocaleString() + ' HRS' },
          { k: '100-HR RELIABILITY', v: (ac.reliability * 100).toFixed(1) + '%' },
        ].map(({ k, v }) => (
          <div key={k} className="panel" style={{ padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.15em', color: '#374561', marginBottom: 6 }}>{k}</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 18, fontWeight: 700, color: '#22d3ee' }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Main content: subsystems + engine chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 12, marginBottom: 12 }}>

        {/* Subsystem panel */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Subsystem Health</SectionLabel>

          {/* Big health score */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
            <span style={{
              fontFamily: 'var(--font-data)', fontSize: 44, fontWeight: 700,
              color: healthColor, lineHeight: 1, letterSpacing: '-0.03em',
            }}>{ac.overallHealth}</span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 14, color: '#374561' }}>/ 100</span>
          </div>

          <div style={{ display: 'flex', gap: 2, marginBottom: 18 }}>
            {segs.map((c, i) => <div key={i} style={{ flex: 1, height: 4, background: c }} />)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ac.subsystems.map(sub => (
              <SubsystemBar key={sub.name} sub={sub} showMeta />
            ))}
          </div>
        </div>

        {/* Engine chart */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Engine Telemetry — 24-hr History</SectionLabel>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
              <XAxis dataKey="t" tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} interval={2} />
              <YAxis tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="ENG TEMP" stroke="#f43f5e" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="VIBRATION" stroke="#facc15" dot={false} strokeWidth={1.5} />
              <Line type="monotone" dataKey="OIL PSI" stroke="#22d3ee" dot={false} strokeWidth={1.5} />
            </LineChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
            {[['ENG TEMP', '#f43f5e'], ['VIBRATION', '#facc15'], ['OIL PSI', '#22d3ee']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 18, height: 2, background: c }} />
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#4a5a7a', letterSpacing: '0.1em' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Electrical chart */}
      <div className="panel" style={{ padding: '18px 20px', marginBottom: 12 }}>
        <SectionLabel>Electrical / Avionics Telemetry — 24-hr History</SectionLabel>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={elecData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
            <XAxis dataKey="t" tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} interval={2} />
            <YAxis tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="BAT V" stroke="#22c55e" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="GEN V" stroke="#e8a020" dot={false} strokeWidth={1.5} />
            <Line type="monotone" dataKey="AV TEMP" stroke="#a78bfa" dot={false} strokeWidth={1.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>

        {/* Alerts */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Active Alerts</SectionLabel>
          {ac.alerts.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22c55e', letterSpacing: '0.1em' }}>
              NO ACTIVE ALERTS
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ac.alerts.map(alert => {
                const colors: Record<string, string> = { critical: '#f43f5e', high: '#fb923c', medium: '#facc15', low: '#22c55e' };
                const c = colors[alert.severity];
                return (
                  <div key={alert.id} style={{
                    borderLeft: `2px solid ${c}`,
                    paddingLeft: 12,
                    paddingTop: 4,
                    paddingBottom: 4,
                  }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.14em', color: c }}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
                        {alert.subsystem.toUpperCase().replace('_', ' ')}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{alert.message}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Maintenance Recommendations</SectionLabel>
          {ac.recommendations.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22c55e', letterSpacing: '0.1em' }}>
              NOMINAL — NO ACTIONS REQUIRED
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ac.recommendations.map(rec => {
                const colors: Record<string, string> = { critical: '#f43f5e', high: '#fb923c', medium: '#facc15', low: '#22c55e' };
                const c = colors[rec.riskLevel];
                return (
                  <div key={rec.id} style={{
                    borderLeft: `2px solid ${c}22`,
                    paddingLeft: 12,
                    borderBottom: '1px solid var(--border-dim)',
                    paddingBottom: 10,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: c, letterSpacing: '0.12em' }}>
                        {rec.riskLevel.toUpperCase()} / RPN {rec.riskScore}
                      </span>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#fb923c', letterSpacing: '0.1em' }}>
                        WITHIN {rec.windowHours} FH
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#c8d5e8', marginBottom: 3 }}>{rec.issue}</div>
                    <div style={{ fontSize: 11, color: '#4a5a7a', marginBottom: 4, lineHeight: 1.5 }}>{rec.engineeringReason}</div>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22d3ee', letterSpacing: '0.06em' }}>
                      ACTION: {rec.action}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <p style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', marginTop: 16, letterSpacing: '0.08em' }}>
        LAST MAINTENANCE: {formatDate(ac.lastMaintenance).toUpperCase()}
      </p>
    </div>
  );
}
