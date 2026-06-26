/**
 * Telemetry Simulator
 *
 * Generates realistic aircraft sensor time-series data.
 * Supports four health scenarios: nominal, degraded, warning, critical.
 * Uses seeded pseudo-random values so data is reproducible per aircraft ID.
 */

import type { SensorReading } from '../types';

export type HealthScenario = 'nominal' | 'degraded' | 'warning' | 'critical';

interface SensorProfile {
  engineTemp: number;
  engineVibration: number;
  oilPressure: number;
  fuelFlow: number;
  hydraulicPressure: number;
  batteryVoltage: number;
  generatorVoltage: number;
  avionicsTemp: number;
  drift: number;  // multiplier for gradual degradation trend
}

const PROFILES: Record<HealthScenario, SensorProfile> = {
  nominal: {
    engineTemp: 630,
    engineVibration: 1.8,
    oilPressure: 62,
    fuelFlow: 840,
    hydraulicPressure: 3050,
    batteryVoltage: 28.2,
    generatorVoltage: 115.5,
    avionicsTemp: 42,
    drift: 0.0,
  },
  degraded: {
    engineTemp: 710,
    engineVibration: 3.8,
    oilPressure: 52,
    fuelFlow: 890,
    hydraulicPressure: 2700,
    batteryVoltage: 26.8,
    generatorVoltage: 113.5,
    avionicsTemp: 55,
    drift: 0.5,
  },
  warning: {
    engineTemp: 770,
    engineVibration: 6.5,
    oilPressure: 42,
    fuelFlow: 960,
    hydraulicPressure: 2300,
    batteryVoltage: 25.0,
    generatorVoltage: 111.0,
    avionicsTemp: 65,
    drift: 1.0,
  },
  critical: {
    engineTemp: 840,
    engineVibration: 9.2,
    oilPressure: 32,
    fuelFlow: 1080,
    hydraulicPressure: 1900,
    batteryVoltage: 23.5,
    generatorVoltage: 108.5,
    avionicsTemp: 72,
    drift: 2.0,
  },
};

/** Simple seeded pseudo-random (mulberry32). */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Numeric hash of a string (for seeding). */
function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Generate 24 hours of telemetry (48 readings, 30-min intervals).
 *
 * @param aircraftId   - used as random seed for reproducibility
 * @param scenario     - health state to simulate
 * @param cycleCount   - current landing gear cycles (increments with readings)
 */
export function generateTelemetry(
  aircraftId: string,
  scenario: HealthScenario,
  cycleCount: number,
  pointCount = 48
): SensorReading[] {
  const rand = seededRandom(hashString(aircraftId));
  const profile = PROFILES[scenario];
  const now = Date.now();
  const intervalMs = 30 * 60 * 1000; // 30 minutes

  const readings: SensorReading[] = [];

  for (let i = 0; i < pointCount; i++) {
    const progress = i / pointCount;
    const trend = profile.drift * progress;
    const noise = () => (rand() - 0.5) * 2;

    readings.push({
      timestamp: now - (pointCount - i) * intervalMs,
      engineTemp:        profile.engineTemp        + trend * 8   + noise() * 5,
      engineVibration:   profile.engineVibration   + trend * 0.4 + noise() * 0.2,
      oilPressure:       profile.oilPressure        - trend * 1   + noise() * 1.5,
      fuelFlow:          profile.fuelFlow            + trend * 5   + noise() * 10,
      hydraulicPressure: profile.hydraulicPressure  - trend * 20  + noise() * 30,
      batteryVoltage:    profile.batteryVoltage      - trend * 0.1 + noise() * 0.1,
      generatorVoltage:  profile.generatorVoltage   - trend * 0.2 + noise() * 0.3,
      avionicsTemp:      profile.avionicsTemp        + trend * 2   + noise() * 1.5,
      landingGearCycles: cycleCount + Math.floor(i / 6), // ~1 cycle per 3 hrs
    });
  }

  return readings;
}
