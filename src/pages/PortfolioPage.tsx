import { User } from 'lucide-react';

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: 32 }}>
      <div style={{ width: 2, height: 12, background: '#e8a020' }} />
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em', color: '#e8a020', textTransform: 'uppercase' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border-dim)' }} />
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
      <span style={{ fontFamily: 'var(--font-data)', color: '#e8a020', fontSize: 10, flexShrink: 0, marginTop: 1 }}>›</span>
      <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.65 }}>{children}</span>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <div style={{ maxWidth: 880, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <User size={13} style={{ color: '#e8a020' }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.2em', color: '#e8a020' }}>
            PORTFOLIO
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 700, color: '#e2eaf5', margin: '0 0 4px' }}>
          PROJECT CASE STUDY
        </h1>
        <p style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#374561', letterSpacing: '0.1em' }}>
          SKYPULSE AI / AIRCRAFT PREDICTIVE MAINTENANCE PLATFORM
        </p>
      </div>

      {/* Problem */}
      <SectionLabel>Problem Statement</SectionLabel>
      <p style={{ fontSize: 13, color: '#6b7fa3', lineHeight: 1.8, marginBottom: 12 }}>
        Aviation maintenance is a critical safety and operational efficiency challenge. Unscheduled maintenance
        events cost airlines an estimated $9 billion annually in direct costs and lost revenue (IATA).
        Traditional scheduled maintenance replaces components on fixed time intervals, ignoring actual condition.
        Predictive maintenance using real-time sensor data can reduce unexpected failures by 25-30% and lower
        total maintenance costs by up to 12%.
      </p>
      <p style={{ fontSize: 13, color: '#6b7fa3', lineHeight: 1.8 }}>
        This project demonstrates how aerospace reliability engineering principles translate into software:
        sensor telemetry to health scores, health scores to RUL estimates, and RUL to prioritized
        maintenance recommendations using FMEA-style risk scoring.
      </p>

      {/* Tech */}
      <SectionLabel>Technologies Used</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
        {[
          ['React 18 + TypeScript', 'Frontend with strict typing'],
          ['Vite', 'Build tool and dev server'],
          ['Tailwind CSS', 'Utility-first styling'],
          ['Recharts', 'Telemetry time-series charts'],
          ['React Router v6', 'SPA navigation'],
          ['Lucide React', 'Icon system'],
        ].map(([tech, desc]) => (
          <div key={tech} className="panel" style={{ padding: '12px 14px' }}>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22d3ee', marginBottom: 3 }}>{tech}</div>
            <div style={{ fontSize: 11, color: '#374561' }}>{desc}</div>
          </div>
        ))}
      </div>

      {/* Architecture */}
      <SectionLabel>System Architecture</SectionLabel>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-data)', fontSize: 11, color: '#4a5a7a',
          lineHeight: 2.0, whiteSpace: 'pre',
        }}>
          <span style={{ color: '#22d3ee' }}>simulation/</span>    telemetrySimulator.ts   Seeded stochastic sensor generation{'\n'}
          <span style={{ color: '#22d3ee' }}>calculations/</span>{'\n'}
          {'  '}healthScore.ts          Weighted sensor scoring{'\n'}
          {'  '}reliability.ts          MTBF · lambda · R(t){'\n'}
          {'  '}rul.ts                  Stress factor · effective age · RUL{'\n'}
          {'  '}risk.ts                 VSI · RPN · FMEA factor derivation{'\n'}
          <span style={{ color: '#22d3ee' }}>data/</span>           fleet.ts                Aircraft factory (ties all layers){'\n'}
          <span style={{ color: '#22d3ee' }}>pages/</span>          8 pages (Fleet, Detail, Alerts, Maintenance,{'\n'}
          {'                          '}Methodology, Worked Example, Validation, Portfolio){'\n'}
          <span style={{ color: '#22d3ee' }}>components/</span>     Reusable UI components{'\n'}
          <span style={{ color: '#22d3ee' }}>types/</span>          TypeScript interfaces
        </div>
      </div>

      {/* Engineering models */}
      <SectionLabel>Engineering Models Implemented</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        {[
          'Weighted subsystem health scoring (6 subsystems)',
          'Stress-adjusted Remaining Useful Life (RUL)',
          'Vibration Severity Index (VSI, per ISO 10816)',
          'Exponential reliability  R(t) = e^(−λt)',
          'Mean Time Between Failures (MTBF)',
          'Failure rate  λ = 1 / MTBF',
          'FMEA Risk Priority Number  (S × P × D)',
          'Structural fatigue consumption percentage',
          'Rule-based maintenance recommendation engine',
          'Temperature trend rate analysis',
        ].map(m => (
          <div key={m} style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-data)', color: '#22c55e', fontSize: 10, flexShrink: 0 }}>+</span>
            <span style={{ fontSize: 12, color: '#4a5a7a', lineHeight: 1.7 }}>{m}</span>
          </div>
        ))}
      </div>

      {/* Resume bullets */}
      <SectionLabel>Resume Bullet Points</SectionLabel>
      <div className="panel" style={{ padding: '18px 22px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, #e8a020, transparent 60%)' }} />
        <Bullet>
          Designed and built an aircraft predictive maintenance proof-of-concept using simulated telemetry,
          reliability engineering, subsystem health scoring, and FMEA-style risk analysis.
        </Bullet>
        <Bullet>
          Implemented engineering calculation modules for Remaining Useful Life, MTBF, reliability probability,
          vibration severity, fatigue usage, and maintenance risk prioritization using TypeScript.
        </Bullet>
        <Bullet>
          Developed a full-stack fleet health dashboard to visualize aircraft sensor trends, subsystem degradation,
          active alerts, and recommended maintenance actions across 8 simulated aircraft.
        </Bullet>
        <Bullet>
          Applied aerospace engineering formulas (exponential reliability model, stress-adjusted effective age,
          VSI per ISO 10816, fatigue consumed) in production-quality code with complete engineering documentation.
        </Bullet>
        <Bullet>
          Architected a modular React + TypeScript application separating simulation, calculations, data layer,
          and UI to demonstrate software engineering best practices in an aerospace context.
        </Bullet>
      </div>

      {/* Takeaways */}
      <SectionLabel>Key Takeaways</SectionLabel>
      <Bullet>Translating engineering formulas to software requires explicit handling of edge cases (zero failures, out-of-range sensors, zero denominators).</Bullet>
      <Bullet>Weighted linear scoring is interpretable but hides nonlinear interactions between failure modes.</Bullet>
      <Bullet>The gap between a rule-based demo and a certified PHM system is substantial: data quality, sensor fusion, and airworthiness validation are the hard problems.</Bullet>
      <Bullet>Trend visualization (rate of change) is more actionable than a static health percentage.</Bullet>
      <Bullet>Engineering documentation is as important as the code for an aerospace project.</Bullet>

      {/* Limitations / Future */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 32 }}>
        <div className="panel" style={{ padding: '16px 18px' }}>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.16em', color: '#f43f5e', marginBottom: 10 }}>
            CURRENT LIMITATIONS
          </div>
          {[
            'All data is simulated, not from real aircraft',
            'Rule-based logic, not ML inference',
            'Simplified linear degradation model',
            'No real-time data streaming',
            'No backend or database persistence',
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-data)', color: '#f43f5e', fontSize: 10, flexShrink: 0 }}>×</span>
              <span style={{ fontSize: 12, color: '#4a5a7a' }}>{l}</span>
            </div>
          ))}
        </div>
        <div className="panel" style={{ padding: '16px 18px' }}>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.16em', color: '#22c55e', marginBottom: 10 }}>
            FUTURE IMPROVEMENTS
          </div>
          {[
            'LSTM model for anomaly detection',
            'Weibull degradation modeling',
            'REST API + PostgreSQL backend',
            'ADS-B / ACARS data integration',
            'Maintenance scheduling optimizer',
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-data)', color: '#22c55e', fontSize: 10, flexShrink: 0 }}>+</span>
              <span style={{ fontSize: 12, color: '#4a5a7a' }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 24,
        border: '1px solid rgba(250,204,21,0.15)',
        background: 'rgba(250,204,21,0.04)',
        padding: '10px 14px',
        fontFamily: 'var(--font-data)', fontSize: 9,
        letterSpacing: '0.08em', color: '#4a5a7a', lineHeight: 1.7,
      }}>
        ⚠ DISCLAIMER: Educational proof of concept using simulated data only. Not certified for
        real aircraft maintenance, flight safety, or operational aviation decision-making.
      </div>
    </div>
  );
}
