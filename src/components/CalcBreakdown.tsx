/**
 * CalcBreakdown — shows the live sensor inputs and formula steps
 * that produced a subsystem health score. Collapsible.
 */

import { useState } from 'react';
import type { SubsystemName, SensorReading } from '../types';
import { sensorScore, usageScore } from '../calculations/healthScore';
import { calcStressFactor } from '../calculations/rul';
import { calcVSI } from '../calculations/risk';
import { healthHex } from '../utils/format';

interface Props {
  subsystem: SubsystemName;
  reading: SensorReading;
  flightHours: number;
  finalScore: number;
}

/* ── Small sub-components ──────────────────────────────────────── */

function Row({ label, raw, unit, score, weight }: {
  label: string; raw: string; unit: string; score: number; weight: number;
}) {
  const contribution = (weight * score).toFixed(1);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '130px 90px 50px 60px 30px 60px',
      alignItems: 'center',
      padding: '5px 0',
      borderBottom: '1px solid #0d1520',
      gap: 4,
    }}>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', letterSpacing: '0.1em' }}>
        {label}
      </span>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#e2eaf5' }}>
        {raw} <span style={{ color: '#374561', fontSize: 9 }}>{unit}</span>
      </span>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: healthHex(score) }}>
        {score.toFixed(0)}
      </span>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
        × {weight.toFixed(2)}
      </span>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>=</span>
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#22d3ee' }}>
        {contribution}
      </span>
    </div>
  );
}

function ColHeader() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '130px 90px 50px 60px 30px 60px',
      padding: '4px 0 6px',
      gap: 4,
      borderBottom: '1px solid #1a2235',
      marginBottom: 2,
    }}>
      {['SENSOR', 'MEASURED', 'SCORE', 'WEIGHT', '', 'CONTRIB'].map(h => (
        <span key={h} style={{
          fontFamily: 'var(--font-data)', fontSize: 8,
          letterSpacing: '0.12em', color: '#374561',
        }}>{h}</span>
      ))}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────── */

export default function CalcBreakdown({ subsystem, reading: r, flightHours, finalScore }: Props) {
  const [open, setOpen] = useState(false);

  const rows = buildRows(subsystem, r, flightHours);
  if (!rows) return null;

  const total = rows.reduce((s, row) => s + row.weight * row.score, 0);
  const stressFactor = (() => {
    const t = sensorScore(r.engineTemp, 650, 750, 850, false);
    const v = sensorScore(r.engineVibration, 2.0, 5.0, 10.0, false);
    return calcStressFactor(t, v);
  })();

  return (
    <div style={{ marginTop: 4 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, padding: '3px 0',
        }}
      >
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', letterSpacing: '0.12em' }}>
          {open ? '▾' : '▸'} SHOW CALCULATION
        </span>
      </button>

      {open && (
        <div style={{
          background: '#060810',
          border: '1px solid #1a2235',
          padding: '12px 14px',
          marginTop: 4,
        }}>
          <ColHeader />
          {rows.map(row => (
            <Row key={row.label} {...row} />
          ))}

          {/* Formula total */}
          <div style={{
            marginTop: 8, paddingTop: 8,
            borderTop: '1px solid #1a2235',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', letterSpacing: '0.1em' }}>
              H = {rows.map(r => `${(r.weight * r.score).toFixed(1)}`).join(' + ')}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
                = {total.toFixed(1)} →
              </span>
              <span style={{
                fontFamily: 'var(--font-data)', fontSize: 14, fontWeight: 700,
                color: healthHex(finalScore),
              }}>
                {finalScore}%
              </span>
            </div>
          </div>

          {/* Extra context for engine */}
          {subsystem === 'engine' && (
            <div style={{
              marginTop: 8, paddingTop: 8, borderTop: '1px solid #1a2235',
              display: 'flex', gap: 24,
            }}>
              <div>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.1em' }}>VSI</span>
                <div style={{
                  fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 700,
                  color: calcVSI(r.engineVibration) > 2.5 ? '#fb923c' : '#22d3ee',
                }}>
                  {calcVSI(r.engineVibration).toFixed(2)}
                </div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561' }}>
                  V_meas / V_nom = {r.engineVibration.toFixed(2)} / 2.0
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.1em' }}>STRESS FACTOR</span>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 700, color: stressFactor > 1.2 ? '#fb923c' : '#22d3ee' }}>
                  {stressFactor.toFixed(3)}
                </div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561' }}>
                  {stressFactor > 1.0 ? `aging ${((stressFactor - 1) * 100).toFixed(1)}% faster than nominal` : 'nominal aging rate'}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.1em' }}>EFF. AGE</span>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 700, color: '#22d3ee' }}>
                  {Math.round(flightHours * stressFactor).toLocaleString()} hrs
                </div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561' }}>
                  FH × SF = {flightHours.toLocaleString()} × {stressFactor.toFixed(3)}
                </div>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.1em' }}>ENGINE RUL</span>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 12, fontWeight: 700, color: '#22d3ee' }}>
                  {Math.max(0, Math.round(25000 - flightHours * stressFactor)).toLocaleString()} hrs
                </div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561' }}>
                  25,000 − {Math.round(flightHours * stressFactor).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Row builder ────────────────────────────────────────────────── */

interface RowData { label: string; raw: string; unit: string; score: number; weight: number; }

function buildRows(sub: SubsystemName, r: SensorReading, fh: number): RowData[] | null {
  const uScore = (rated: number) => usageScore(fh, rated);

  switch (sub) {
    case 'engine':
      return [
        { label: 'Eng Temperature', raw: r.engineTemp.toFixed(0),       unit: 'C',      score: sensorScore(r.engineTemp, 650, 750, 850, false),          weight: 0.30 },
        { label: 'Eng Vibration',   raw: r.engineVibration.toFixed(2),  unit: 'mm/s',   score: sensorScore(r.engineVibration, 2.0, 5.0, 10.0, false),    weight: 0.30 },
        { label: 'Oil Pressure',    raw: r.oilPressure.toFixed(0),       unit: 'PSI',    score: sensorScore(r.oilPressure, 60, 45, 30, true),              weight: 0.20 },
        { label: 'Usage (FH/Life)', raw: `${fh.toLocaleString()} / 25k`, unit: 'hrs',   score: uScore(25000),                                              weight: 0.20 },
      ];
    case 'hydraulic':
      return [
        { label: 'Hyd Pressure',    raw: r.hydraulicPressure.toFixed(0), unit: 'PSI',   score: sensorScore(r.hydraulicPressure, 3000, 2400, 1800, true),  weight: 0.60 },
        { label: 'Usage (FH/Life)', raw: `${fh.toLocaleString()} / 20k`, unit: 'hrs',   score: uScore(20000),                                              weight: 0.40 },
      ];
    case 'electrical':
      return [
        { label: 'Battery Voltage', raw: r.batteryVoltage.toFixed(2),   unit: 'V',      score: sensorScore(r.batteryVoltage, 28.0, 25.5, 23.0, true),    weight: 0.40 },
        { label: 'Generator Volt',  raw: r.generatorVoltage.toFixed(1),  unit: 'V AC',   score: sensorScore(r.generatorVoltage, 115, 112, 108, true),      weight: 0.40 },
        { label: 'Usage (FH/Life)', raw: `${fh.toLocaleString()} / 15k`, unit: 'hrs',   score: uScore(15000),                                              weight: 0.20 },
      ];
    case 'landing_gear': {
      const cycFrac = r.landingGearCycles / 50000;
      const cycScore = Math.max(0, Math.min(100, (1 - cycFrac) * 100));
      return [
        { label: 'Gear Cycles',     raw: `${r.landingGearCycles.toLocaleString()} / 50k`, unit: 'cyc', score: cycScore, weight: 0.70 },
        { label: 'Usage (FH/Life)', raw: `${fh.toLocaleString()} / 30k`, unit: 'hrs',   score: uScore(30000),                                              weight: 0.30 },
      ];
    }
    case 'avionics':
      return [
        { label: 'Avionics Temp',   raw: r.avionicsTemp.toFixed(0),     unit: 'C',      score: sensorScore(r.avionicsTemp, 45, 60, 75, false),            weight: 0.60 },
        { label: 'Usage (FH/Life)', raw: `${fh.toLocaleString()} / 20k`, unit: 'hrs',   score: uScore(20000),                                              weight: 0.40 },
      ];
    case 'ecs':
      return [
        { label: 'Avionics Temp',   raw: r.avionicsTemp.toFixed(0),     unit: 'C',      score: sensorScore(r.avionicsTemp, 45, 58, 72, false),            weight: 0.50 },
        { label: 'Usage (FH/Life)', raw: `${fh.toLocaleString()} / 18k`, unit: 'hrs',   score: uScore(18000),                                              weight: 0.50 },
      ];
    default:
      return null;
  }
}
