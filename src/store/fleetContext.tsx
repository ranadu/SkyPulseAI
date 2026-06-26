/**
 * Live fleet context.
 *
 * Every TICK_MS a new sensor reading is generated for each aircraft
 * by applying small bounded noise to the previous reading.
 * Subsystem health scores are recalculated from the new reading so
 * the UI reflects a continuously monitored system.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Aircraft, SensorReading, SubsystemHealth } from '../types';
import { FLEET as INITIAL_FLEET } from '../data/fleet';
import {
  engineHealthScore,
  hydraulicHealthScore,
  electricalHealthScore,
  landingGearHealthScore,
  avionicsHealthScore,
  ecsHealthScore,
  clampScore,
  sensorScore,
} from '../calculations/healthScore';
import { calcStressFactor, calcStressAdjustedRUL, calcFatigueConsumed } from '../calculations/rul';
import { healthScoreToRiskLevel } from '../calculations/risk';

const TICK_MS = 4000; // sensor update interval

/* ── Noise helpers ─────────────────────────────────────────────── */

function perturb(value: number, scale: number, min: number, max: number): number {
  const delta = (Math.random() - 0.5) * 2 * scale;
  return Math.max(min, Math.min(max, value + delta));
}

function nextReading(prev: SensorReading): SensorReading {
  return {
    timestamp:         Date.now(),
    engineTemp:        perturb(prev.engineTemp,        4,    580, 900),
    engineVibration:   perturb(prev.engineVibration,   0.12, 0.5, 12),
    oilPressure:       perturb(prev.oilPressure,       1.2,  25,  70),
    fuelFlow:          perturb(prev.fuelFlow,           10,   700, 1200),
    hydraulicPressure: perturb(prev.hydraulicPressure, 25,   1500, 3200),
    batteryVoltage:    perturb(prev.batteryVoltage,    0.1,  22,  29),
    generatorVoltage:  perturb(prev.generatorVoltage,  0.25, 105, 120),
    avionicsTemp:      perturb(prev.avionicsTemp,      1.5,  30,  80),
    landingGearCycles: prev.landingGearCycles,
  };
}

/* ── Subsystem recalculation ───────────────────────────────────── */

function recalcSubsystems(flightHours: number, r: SensorReading): SubsystemHealth[] {
  const tempS = sensorScore(r.engineTemp, 650, 750, 850, false);
  const vibS  = sensorScore(r.engineVibration, 2.0, 5.0, 10.0, false);
  const sf    = calcStressFactor(tempS, vibS);

  const rated = { engine: 25000, hydraulic: 20000, electrical: 15000, lg: 30000, avionics: 20000, ecs: 18000 };

  const scores = {
    engine:    clampScore(engineHealthScore(r.engineTemp, r.engineVibration, r.oilPressure, flightHours)),
    hydraulic: clampScore(hydraulicHealthScore(r.hydraulicPressure, flightHours)),
    electrical:clampScore(electricalHealthScore(r.batteryVoltage, r.generatorVoltage, flightHours)),
    lg:        clampScore(landingGearHealthScore(r.landingGearCycles, 50000, flightHours)),
    avionics:  clampScore(avionicsHealthScore(r.avionicsTemp, flightHours)),
    ecs:       clampScore(ecsHealthScore(r.avionicsTemp, flightHours)),
  };

  return [
    { name: 'engine',      displayName: 'Engine',
      score: scores.engine,    status: healthScoreToRiskLevel(scores.engine),
      rul: Math.round(calcStressAdjustedRUL(rated.engine, flightHours, sf)),
      fatiqueConsumed: parseFloat(((flightHours / rated.engine) * 100).toFixed(1)) },

    { name: 'hydraulic',   displayName: 'Hydraulic System',
      score: scores.hydraulic, status: healthScoreToRiskLevel(scores.hydraulic),
      rul: Math.round(calcStressAdjustedRUL(rated.hydraulic, flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((flightHours / rated.hydraulic) * 100).toFixed(1)) },

    { name: 'electrical',  displayName: 'Electrical System',
      score: scores.electrical, status: healthScoreToRiskLevel(scores.electrical),
      rul: Math.round(calcStressAdjustedRUL(rated.electrical, flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((flightHours / rated.electrical) * 100).toFixed(1)) },

    { name: 'landing_gear',displayName: 'Landing Gear',
      score: scores.lg,    status: healthScoreToRiskLevel(scores.lg),
      rul: Math.round(Math.max(0, (50000 - r.landingGearCycles) * 1.5)),
      fatiqueConsumed: parseFloat(calcFatigueConsumed(r.landingGearCycles, 50000).toFixed(1)) },

    { name: 'avionics',    displayName: 'Avionics',
      score: scores.avionics, status: healthScoreToRiskLevel(scores.avionics),
      rul: Math.round(calcStressAdjustedRUL(rated.avionics, flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((flightHours / rated.avionics) * 100).toFixed(1)) },

    { name: 'ecs',         displayName: 'Env. Control System',
      score: scores.ecs,   status: healthScoreToRiskLevel(scores.ecs),
      rul: Math.round(calcStressAdjustedRUL(rated.ecs, flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((flightHours / rated.ecs) * 100).toFixed(1)) },
  ];
}

function tickAircraft(ac: Aircraft): Aircraft {
  const prev = ac.telemetry.readings[ac.telemetry.readings.length - 1];
  const next = nextReading(prev);
  // Rolling window: keep last 48 readings
  const readings = [...ac.telemetry.readings.slice(-47), next];
  const subs = recalcSubsystems(ac.flightHours, next);
  const overallHealth = clampScore(subs.reduce((s, sub) => s + sub.score, 0) / subs.length);
  return {
    ...ac,
    overallHealth,
    riskLevel: healthScoreToRiskLevel(overallHealth),
    subsystems: subs,
    telemetry: { readings },
  };
}

/* ── Context ────────────────────────────────────────────────────── */

interface FleetCtx {
  fleet: Aircraft[];
  tick: number;
}

const FleetContext = createContext<FleetCtx>({ fleet: INITIAL_FLEET, tick: 0 });

export function FleetProvider({ children }: { children: React.ReactNode }) {
  const [fleet, setFleet] = useState<Aircraft[]>(INITIAL_FLEET);
  const [tick, setTick]   = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setFleet(prev => prev.map(tickAircraft));
      setTick(t => t + 1);
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <FleetContext.Provider value={{ fleet, tick }}>
      {children}
    </FleetContext.Provider>
  );
}

export function useFleet() {
  return useContext(FleetContext);
}

export function useAircraft(id: string): Aircraft | undefined {
  const { fleet } = useFleet();
  return fleet.find(a => a.id === id);
}
