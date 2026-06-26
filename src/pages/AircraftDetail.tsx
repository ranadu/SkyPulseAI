import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useAircraft } from '../store/fleetContext';
import { riskBadge, healthHex, formatDate, segmentColors } from '../utils/format';
import SubsystemBar from '../components/SubsystemBar';
import CalcBreakdown from '../components/CalcBreakdown';

const SEGMENTS = 24;

function kpiCards(ac: NonNullable<ReturnType<typeof useAircraft>>) {
  const rel = ac.reliability * 100;
  const relColor = rel >= 95 ? '#22c55e' : rel >= 85 ? '#facc15' : '#f43f5e';
  const mtbfNote = ac.mtbf < 1000
    ? 'Low MTBF — frequent failures in history. Confidence interval wide at this sample size.'
    : ac.mtbf < 3000
      ? 'Moderate MTBF. Based on small failure sample; 90% CI spans roughly ×3 uncertainty.'
      : 'High MTBF. Valid during useful-life phase only; wear-out phase will increase λ.';
  const relNote = rel >= 97
    ? `Excellent. Implies failure rate λ = ${(1 / ac.mtbf * 1e4).toFixed(2)}×10⁻⁴/hr. Exponential model — assumes constant failure rate.`
    : rel >= 90
      ? `Acceptable. Based on R(t)=e^(−λt). Assumes random-failure regime; optimistic if near end-of-life.`
      : `Low reliability — high probability of in-mission failure. Model may still be underestimating risk if wear-out has begun.`;
  const cycleNote = ac.flightCycles > 30000
    ? 'High cycle count. Structural fatigue life is cycle-limited for pressure bulkhead and landing gear. Review damage-tolerance limits.'
    : ac.flightCycles > 15000
      ? 'Mid-life cycle count. Monitor high-cycle fatigue items (skin panels, fastener holes) per maintenance manual intervals.'
      : 'Low cycle count. Structural life not yet a primary concern; engine hours likely the binding life limit.';
  const fhNote = ac.flightHours > 20000
    ? 'High-time aircraft. Stress-adjusted effective age may significantly exceed calendar age for high-stress scenarios.'
    : ac.flightHours > 10000
      ? 'Mid-time aircraft. Cross-reference cycles to determine whether this is a short-haul (cycle-limited) or long-haul (hour-limited) operation.'
      : 'Low-time aircraft. Engine and primary structure life limits not yet approached; maintenance driven by calendar intervals.';

  return [
    { k: 'FLIGHT HOURS',       v: ac.flightHours.toLocaleString() + ' hrs', interp: fhNote,    color: '#22d3ee' },
    { k: 'CYCLES',             v: ac.flightCycles.toLocaleString(),          interp: cycleNote,  color: '#22d3ee' },
    { k: 'MTBF',               v: ac.mtbf.toLocaleString() + ' hrs',         interp: mtbfNote,   color: '#22d3ee' },
    { k: '100-HR RELIABILITY', v: rel.toFixed(1) + '%',                      interp: relNote,    color: relColor  },
  ];
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#0b1018', border: '1px solid #1a2235',
      padding: '8px 12px', fontFamily: 'var(--font-data)', fontSize: 10,
    }}>
      <div style={{ color: '#374561', marginBottom: 6 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: <span style={{ color: '#e2eaf5' }}>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
      <div style={{ width: 2, height: 12, background: '#e8a020' }} />
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em', color: '#e8a020', textTransform: 'uppercase' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border-dim)' }} />
    </div>
  );
}

export default function AircraftDetail() {
  const { id } = useParams<{ id: string }>();
  const ac = useAircraft(id ?? '');

  if (!ac) {
    return (
      <div style={{ maxWidth: 900, margin: '80px auto', textAlign: 'center' }}>
        <p style={{ color: '#374561', fontFamily: 'var(--font-data)' }}>AIRCRAFT NOT FOUND</p>
        <Link to="/" style={{ color: '#e8a020', fontFamily: 'var(--font-data)', fontSize: 11 }}>RETURN TO FLEET</Link>
      </div>
    );
  }

  const latest = ac.telemetry.readings[ac.telemetry.readings.length - 1];

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
      'GEN V': parseFloat(r.generatorVoltage.toFixed(1)),
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
        }}
      >
        <ArrowLeft size={11} /> RETURN TO FLEET
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em', color: '#e8a020', marginBottom: 4 }}>
            AIRCRAFT DETAIL
          </div>
          <h1 style={{ fontFamily: 'var(--font-data)', fontSize: 28, fontWeight: 700, color: '#e2eaf5', margin: 0, letterSpacing: '0.06em' }}>
            {ac.registration}
          </h1>
          <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#374561', margin: '4px 0 0', letterSpacing: '0.1em' }}>
            {ac.id} / {ac.model.toUpperCase()}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <span className={riskBadge(ac.riskLevel)} style={{ fontSize: 11 }}>{ac.riskLevel.toUpperCase()} RISK</span>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#22c55e', letterSpacing: '0.12em' }}>
            ● LIVE DATA
          </span>
        </div>
      </div>

      {/* KPI row — with live engineering interpretations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 24 }}>
        {kpiCards(ac).map(({ k, v, interp, color }) => (
          <div key={k} className="panel" style={{ padding: '14px 16px' }}>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.15em', color: '#374561', marginBottom: 6 }}>{k}</div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 18, fontWeight: 700, color: color ?? '#22d3ee' }}>{v}</div>
            <div style={{ fontSize: 10, color: '#4a5a7a', marginTop: 6, lineHeight: 1.6 }}>{interp}</div>
          </div>
        ))}
      </div>

      {/* Subsystems + engine chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 12, marginBottom: 12 }}>

        {/* Subsystem panel with inline calc breakdowns (Fix 2) */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Subsystem Health</SectionLabel>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 44, fontWeight: 700, color: healthColor, lineHeight: 1, letterSpacing: '-0.03em' }}>
              {ac.overallHealth}
            </span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 14, color: '#374561' }}>/ 100</span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', marginLeft: 4 }}>
              avg of 6 subsystems
            </span>
          </div>

          <div style={{ display: 'flex', gap: 2, marginBottom: 18 }}>
            {segs.map((c, i) => <div key={i} style={{ flex: 1, height: 4, background: c }} />)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {ac.subsystems.map(sub => (
              <div key={sub.name}>
                <SubsystemBar sub={sub} showMeta />
                {/* Inline calculation breakdown */}
                <CalcBreakdown
                  subsystem={sub.name}
                  reading={latest}
                  flightHours={ac.flightHours}
                  finalScore={sub.score}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Engine chart */}
        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Engine Telemetry — Live 24-hr History</SectionLabel>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', marginBottom: 12, lineHeight: 1.7 }}>
            Latest: ENG TEMP <span style={{ color: '#f43f5e' }}>{Math.round(latest.engineTemp)}°C</span>
            {' · '} VIBRATION <span style={{ color: '#facc15' }}>{latest.engineVibration.toFixed(2)} mm/s</span>
            {' · '} OIL PSI <span style={{ color: '#22d3ee' }}>{Math.round(latest.oilPressure)} PSI</span>
            {' · '} Nominal ranges: temp &lt;750°C / vib &lt;5.0 mm/s / oil &gt;45 PSI
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
              <XAxis dataKey="t" tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} interval={2} />
              <YAxis tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="ENG TEMP" stroke="#f43f5e" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              <Line type="monotone" dataKey="VIBRATION" stroke="#facc15" dot={false} strokeWidth={1.5} isAnimationActive={false} />
              <Line type="monotone" dataKey="OIL PSI" stroke="#22d3ee" dot={false} strokeWidth={1.5} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {[['ENG TEMP °C', '#f43f5e'], ['VIBRATION mm/s', '#facc15'], ['OIL PSI', '#22d3ee']].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 18, height: 2, background: c }} />
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#4a5a7a' }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Electrical chart */}
      <div className="panel" style={{ padding: '18px 20px', marginBottom: 12 }}>
        <SectionLabel>Electrical / Avionics Telemetry — Live 24-hr History</SectionLabel>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', marginBottom: 12 }}>
          Latest: BAT <span style={{ color: '#22c55e' }}>{latest.batteryVoltage.toFixed(2)} V</span>
          {' · '} GEN <span style={{ color: '#e8a020' }}>{latest.generatorVoltage.toFixed(1)} V AC</span>
          {' · '} AV TEMP <span style={{ color: '#a78bfa' }}>{Math.round(latest.avionicsTemp)}°C</span>
          {' · '} Nominal: bat &gt;25.5V / gen &gt;112V / av temp &lt;60°C
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={elecData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#111827" />
            <XAxis dataKey="t" tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} interval={2} />
            <YAxis tick={{ fill: '#374561', fontSize: 9, fontFamily: 'var(--font-data)' }} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="BAT V" stroke="#22c55e" dot={false} strokeWidth={1.5} isAnimationActive={false} />
            <Line type="monotone" dataKey="GEN V" stroke="#e8a020" dot={false} strokeWidth={1.5} isAnimationActive={false} />
            <Line type="monotone" dataKey="AV TEMP" stroke="#a78bfa" dot={false} strokeWidth={1.5} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts + Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Active Alerts</SectionLabel>
          {ac.alerts.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22c55e', letterSpacing: '0.1em' }}>NO ACTIVE ALERTS</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ac.alerts.map(alert => {
                const c: Record<string, string> = { critical: '#f43f5e', high: '#fb923c', medium: '#facc15', low: '#22c55e' };
                return (
                  <div key={alert.id} style={{ borderLeft: `2px solid ${c[alert.severity]}`, paddingLeft: 12, paddingTop: 4, paddingBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.14em', color: c[alert.severity] }}>
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

        <div className="panel" style={{ padding: '18px 20px' }}>
          <SectionLabel>Maintenance Recommendations</SectionLabel>
          {ac.recommendations.length === 0 ? (
            <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22c55e', letterSpacing: '0.1em' }}>NOMINAL — NO ACTIONS REQUIRED</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ac.recommendations.map(rec => {
                const c: Record<string, string> = { critical: '#f43f5e', high: '#fb923c', medium: '#facc15', low: '#22c55e' };
                return (
                  <div key={rec.id} style={{ borderLeft: `2px solid ${c[rec.riskLevel]}22`, paddingLeft: 12, borderBottom: '1px solid var(--border-dim)', paddingBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: c[rec.riskLevel], letterSpacing: '0.12em' }}>
                        {rec.riskLevel.toUpperCase()} / RPN {rec.riskScore}
                      </span>
                      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#fb923c' }}>WITHIN {rec.windowHours} FH</span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#c8d5e8', marginBottom: 3 }}>{rec.issue}</div>
                    <div style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.5, marginBottom: 4 }}>{rec.engineeringReason}</div>
                    <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22d3ee' }}>ACTION: {rec.action}</div>
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
