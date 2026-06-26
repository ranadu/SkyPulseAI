/**
 * ReadingGuide — a compact strip at the top of the fleet dashboard
 * that explains what every score, color, and abbreviation means.
 * Collapsible so it doesn't crowd the screen after first read.
 */

import { useState } from 'react';
import { healthHex } from '../utils/format';

const RISK_LEVELS = [
  { label: 'LOW',      color: '#22c55e', health: '80-100%', rpn: 'RPN < 100',   meaning: 'Within normal limits. Monitor on schedule.' },
  { label: 'MEDIUM',   color: '#facc15', health: '60-79%',  rpn: 'RPN 100-299', meaning: 'Degradation detected. Schedule inspection.' },
  { label: 'HIGH',     color: '#fb923c', health: '40-59%',  rpn: 'RPN 300-599', meaning: 'Significant wear. Prioritise within ~25 flight hours.' },
  { label: 'CRITICAL', color: '#f43f5e', health: '< 40%',   rpn: 'RPN >= 600',  meaning: 'Failure risk elevated. Immediate action required.' },
];

const ABBREVS = [
  { sym: 'FH',   def: 'Flight Hours — cumulative engine-on time' },
  { sym: 'CYC',  def: 'Flight Cycles — one takeoff + landing = 1 cycle' },
  { sym: 'RUL',  def: 'Remaining Useful Life — stress-adjusted hours until rated life is reached' },
  { sym: 'MTBF', def: 'Mean Time Between Failures — total hours ÷ number of recorded failures' },
  { sym: 'VSI',  def: 'Vibration Severity Index — measured ÷ nominal (ISO 10816); > 2.5 is warning' },
  { sym: 'RPN',  def: 'Risk Priority Number — Severity × Probability × Detectability (FMEA)' },
  { sym: 'REL',  def: 'Mission Reliability — R(t) = e^(−λt), probability of completing a 100-hr mission' },
  { sym: 'FAT',  def: 'Fatigue Consumed — actual cycles ÷ rated cycles × 100%' },
];

export default function ReadingGuide() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{
      border: '1px solid #1a2235',
      background: '#0b1018',
      marginBottom: 20,
    }}>
      {/* Header toggle */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: open ? '1px solid #1a2235' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#e8a020', letterSpacing: '0.18em' }}>
            HOW TO READ THIS DASHBOARD
          </span>
          <span style={{
            fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561',
            background: '#111827', border: '1px solid #1a2235',
            padding: '1px 6px', letterSpacing: '0.1em',
          }}>
            LIVE — sensors update every 4 s
          </span>
        </div>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#374561' }}>
          {open ? '▾ collapse' : '▸ expand'}
        </span>
      </button>

      {open && (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* What the health score means */}
          <div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.16em', marginBottom: 8 }}>
              HEALTH SCORE — what it is
            </div>
            <p style={{ fontSize: 12, color: '#6b7fa3', margin: 0, lineHeight: 1.7, maxWidth: 800 }}>
              Each subsystem health score (0–100%) is a <strong style={{ color: '#94a3b8' }}>weighted sum of normalised sensor readings</strong>.
              A sensor reading is scored 100 when it is at its nominal operating value and 0 when it reaches the critical threshold.
              For example, the engine score weights temperature (30%), vibration (30%), oil pressure (20%), and usage age (20%).
              The overall aircraft health is the average of all six subsystems.
            </p>
          </div>

          {/* Health score scale */}
          <div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.16em', marginBottom: 8 }}>
              HEALTH SCALE — colour reference
            </div>
            <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, maxWidth: 600 }}>
              {[100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0].map((v, i, arr) => {
                if (i === arr.length - 1) return null;
                const mid = (v + arr[i + 1]) / 2;
                return (
                  <div key={v} style={{ flex: 1, background: healthHex(mid), height: 10 }} />
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#22c55e' }}>100% NOMINAL</span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#facc15' }}>80%</span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#fb923c' }}>60%</span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#f43f5e' }}>0% CRITICAL</span>
            </div>
          </div>

          {/* Risk levels */}
          <div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.16em', marginBottom: 8 }}>
              RISK LEVELS — what each badge means
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8 }}>
              {RISK_LEVELS.map(r => (
                <div key={r.label} style={{
                  background: '#060810', border: `1px solid ${r.color}22`,
                  padding: '10px 12px',
                }}>
                  <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 700, color: r.color, marginBottom: 3 }}>
                    {r.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', marginBottom: 4 }}>
                    {r.health} / {r.rpn}
                  </div>
                  <div style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.5 }}>{r.meaning}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Abbreviations */}
          <div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.16em', marginBottom: 8 }}>
              ABBREVIATIONS
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '4px 24px' }}>
              {ABBREVS.map(a => (
                <div key={a.sym} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span style={{
                    fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 700,
                    color: '#22d3ee', width: 38, flexShrink: 0,
                  }}>{a.sym}</span>
                  <span style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.6 }}>{a.def}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Engineering model note */}
          <div style={{
            background: '#060810', border: '1px solid #1a2235',
            padding: '10px 14px',
            fontFamily: 'var(--font-data)', fontSize: 9,
            color: '#374561', lineHeight: 1.8, letterSpacing: '0.06em',
          }}>
            ENGINEERING MODELS IN USE: Weighted sensor health scoring / Exponential reliability R(t)=e^(−λt) /
            Stress-adjusted RUL / Vibration Severity Index (ISO 10816) / FMEA Risk Priority Number
            {' '}<span style={{ color: '#e8a020' }}>→ click any aircraft and expand "SHOW CALCULATION" under each subsystem to see the live math.</span>
          </div>

        </div>
      )}
    </div>
  );
}
