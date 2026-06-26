import { Activity, AlertTriangle, Wrench, Plane, Heart } from 'lucide-react';
import { FLEET, getFleetSummary } from '../data/fleet';
import StatCard from '../components/StatCard';
import AircraftCard from '../components/AircraftCard';

export default function FleetDashboard() {
  const s = getFleetSummary();

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 24px' }}>

      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 3, height: 18,
            background: 'linear-gradient(180deg, #e8a020, transparent)',
          }} />
          <span style={{
            fontFamily: 'var(--font-data)',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: '#e8a020',
            textTransform: 'uppercase',
          }}>Fleet Operations Center</span>
        </div>
        <h1 style={{
          fontFamily: 'var(--font-data)',
          fontSize: 22,
          fontWeight: 700,
          color: '#e2eaf5',
          letterSpacing: '-0.01em',
          margin: 0,
        }}>PREDICTIVE HEALTH MONITOR</h1>
        <p style={{ fontSize: 12, color: '#374561', marginTop: 4 }}>
          {s.totalAircraft} aircraft monitored / simulated telemetry / educational proof-of-concept
        </p>
      </div>

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 28 }}>
        <StatCard
          label="Total Aircraft"
          value={s.totalAircraft}
          icon={<Plane size={14} />}
          color="#22d3ee"
          accent
        />
        <StatCard
          label="Fleet Health"
          value={`${s.averageHealth}%`}
          sub="weighted avg"
          icon={<Heart size={14} />}
          color={s.averageHealth >= 80 ? '#22c55e' : s.averageHealth >= 60 ? '#facc15' : '#f43f5e'}
          accent
        />
        <StatCard
          label="Active Alerts"
          value={s.activeAlerts}
          sub="unacknowledged"
          icon={<AlertTriangle size={14} />}
          color="#fb923c"
          accent
        />
        <StatCard
          label="Critical A/C"
          value={s.criticalAircraft}
          sub="health below 40%"
          icon={<Activity size={14} />}
          color="#f43f5e"
          accent
        />
        <StatCard
          label="Open Tasks"
          value={s.pendingMaintenance}
          sub="maintenance items"
          icon={<Wrench size={14} />}
          color="#facc15"
          accent
        />
      </div>

      {/* Section label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
      }}>
        <span style={{
          fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em',
          color: '#374561', textTransform: 'uppercase',
        }}>Aircraft Status</span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-dim)' }} />
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
          {FLEET.length} UNITS
        </span>
      </div>

      {/* Fleet grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(520px, 1fr))', gap: 12 }}>
        {FLEET.map(ac => (
          <AircraftCard key={ac.id} aircraft={ac} />
        ))}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 32,
        border: '1px solid rgba(250,204,21,0.15)',
        background: 'rgba(250,204,21,0.04)',
        padding: '10px 14px',
        fontFamily: 'var(--font-data)',
        fontSize: 9,
        letterSpacing: '0.08em',
        color: '#4a5a7a',
        lineHeight: 1.7,
      }}>
        ⚠ DISCLAIMER: This system uses simulated data only. Not certified for real aircraft maintenance,
        flight safety, or operational aviation decision-making. For educational and portfolio purposes only.
      </div>
    </div>
  );
}
