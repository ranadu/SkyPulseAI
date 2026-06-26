/**
 * Fleet seed data and aircraft factory.
 * Combines telemetry simulation with engineering calculations
 * to build the full Aircraft objects used throughout the app.
 */

import type {
  Aircraft,
  SubsystemHealth,
  Alert,
  MaintenanceRecommendation,
  RiskLevel,
  FleetSummary,
} from '../types';
import { generateTelemetry, type HealthScenario } from '../simulation/telemetrySimulator';
import {
  engineHealthScore,
  hydraulicHealthScore,
  electricalHealthScore,
  landingGearHealthScore,
  avionicsHealthScore,
  ecsHealthScore,
  clampScore,
} from '../calculations/healthScore';
import { calcStressFactor, calcStressAdjustedRUL, calcFatigueConsumed } from '../calculations/rul';
import {
  calcMTBF,
  calcFailureRate,
  calcReliability,
} from '../calculations/reliability';
import {
  calcVSI,
  calcRPN,
  deriveRPNFactors,
  rpnToRiskLevel,
  healthScoreToRiskLevel,
} from '../calculations/risk';
import { sensorScore } from '../calculations/healthScore';

// ---------- seed definitions ----------

interface AircraftSeed {
  id: string;
  registration: string;
  model: string;
  flightHours: number;
  flightCycles: number;
  scenario: HealthScenario;
  failures: number;
}

const SEEDS: AircraftSeed[] = [
  { id: 'AC-101', registration: 'N4821K', model: 'Boeing 737-800',  flightHours: 8420,  flightCycles: 6100,  scenario: 'nominal',  failures: 2  },
  { id: 'AC-102', registration: 'N7734W', model: 'Airbus A320-200', flightHours: 14200, flightCycles: 9800,  scenario: 'degraded', failures: 5  },
  { id: 'AC-103', registration: 'N2298R', model: 'Boeing 737-800',  flightHours: 19500, flightCycles: 13200, scenario: 'warning',  failures: 9  },
  { id: 'AC-104', registration: 'N5512B', model: 'Airbus A321-200', flightHours: 6800,  flightCycles: 4900,  scenario: 'nominal',  failures: 1  },
  { id: 'AC-105', registration: 'N8840C', model: 'Boeing 777-300',  flightHours: 22100, flightCycles: 8300,  scenario: 'critical', failures: 14 },
  { id: 'AC-106', registration: 'N3367E', model: 'Airbus A330-300', flightHours: 11400, flightCycles: 5200,  scenario: 'degraded', failures: 4  },
  { id: 'AC-107', registration: 'N9923T', model: 'Boeing 737-MAX',  flightHours: 3200,  flightCycles: 2400,  scenario: 'nominal',  failures: 0  },
  { id: 'AC-108', registration: 'N6614H', model: 'Airbus A320-200', flightHours: 17800, flightCycles: 11900, scenario: 'warning',  failures: 7  },
];

// ---------- factory ----------

function buildAlerts(id: string, subsystems: SubsystemHealth[]): Alert[] {
  const alerts: Alert[] = [];
  subsystems.forEach((sub) => {
    if (sub.status === 'critical') {
      alerts.push({
        id: `${id}-${sub.name}-crit`,
        aircraftId: id,
        subsystem: sub.name,
        severity: 'critical',
        message: `${sub.displayName} health critical: ${sub.score}%`,
        detectedAt: Date.now() - 3600000,
        acknowledged: false,
      });
    } else if (sub.status === 'high') {
      alerts.push({
        id: `${id}-${sub.name}-high`,
        aircraftId: id,
        subsystem: sub.name,
        severity: 'high',
        message: `${sub.displayName} degradation detected: ${sub.score}%`,
        detectedAt: Date.now() - 7200000,
        acknowledged: false,
      });
    } else if (sub.status === 'medium') {
      alerts.push({
        id: `${id}-${sub.name}-med`,
        aircraftId: id,
        subsystem: sub.name,
        severity: 'medium',
        message: `${sub.displayName} trending below nominal: ${sub.score}%`,
        detectedAt: Date.now() - 14400000,
        acknowledged: false,
      });
    }
  });
  return alerts;
}

function buildRecommendations(
  id: string,
  subsystems: SubsystemHealth[],
  vsi: number,
  oilPressure: number,
  hydPressure: number,
  battVoltage: number,
  lgCycles: number,
  avionicsTemp: number,
  _flightHours: number
): MaintenanceRecommendation[] {
  const recs: MaintenanceRecommendation[] = [];

  subsystems.forEach((sub) => {
    if (sub.score >= 80) return;

    let issue = '';
    let reason = '';
    let action = '';
    let window = 50;

    if (sub.name === 'engine') {
      if (vsi > 2.5 && oilPressure < 50) {
        issue = 'Elevated vibration with declining oil pressure';
        reason = 'VSI ' + vsi.toFixed(2) + ' exceeds ISO 10816 warning threshold. Low oil pressure may indicate bearing wear or pump degradation.';
        action = 'Borescope engine, inspect oil pump and bearings';
        window = sub.score < 50 ? 10 : 25;
      } else if (vsi > 2.5) {
        issue = 'Elevated vibration severity index';
        reason = 'VSI of ' + vsi.toFixed(2) + ' suggests rotor imbalance or blade damage.';
        action = 'Vibration analysis, blade inspection';
        window = 30;
      } else {
        issue = 'Engine health below nominal';
        reason = 'Combined sensor degradation score indicates rising maintenance need.';
        action = 'Schedule engine bay inspection';
        window = 50;
      }
    } else if (sub.name === 'hydraulic') {
      issue = 'Hydraulic pressure below nominal';
      reason = 'Pressure ' + hydPressure.toFixed(0) + ' PSI vs 3000 PSI nominal. May indicate pump wear, seal degradation, or fluid loss.';
      action = 'Inspect hydraulic pump, check fluid levels and seals';
      window = sub.score < 50 ? 5 : 20;
    } else if (sub.name === 'electrical') {
      issue = 'Electrical system voltage deviation';
      reason = 'Battery at ' + battVoltage.toFixed(1) + 'V. Deviation from 28V nominal may indicate battery cell degradation or generator regulation fault.';
      action = 'Battery capacity test, generator output check';
      window = 15;
    } else if (sub.name === 'landing_gear') {
      const fatigue = (lgCycles / 50000) * 100;
      issue = 'Landing gear cycle life ' + fatigue.toFixed(1) + '% consumed';
      reason = 'Fatigue life approach requires structural inspection per maintenance manual.';
      action = 'Landing gear structural inspection, NDT inspection';
      window = sub.score < 50 ? 5 : 30;
    } else if (sub.name === 'avionics') {
      issue = 'Avionics bay elevated temperature';
      reason = 'Temp ' + avionicsTemp.toFixed(0) + 'C vs 45C nominal. Cooling degradation risks avionics reliability.';
      action = 'Inspect avionics bay cooling fans and ventilation';
      window = 20;
    } else if (sub.name === 'ecs') {
      issue = 'ECS performance degradation';
      reason = 'Environmental Control System showing elevated thermal indicators.';
      action = 'ECS pack inspection, air cycle machine check';
      window = 40;
    }

    if (!issue) return;

    const factors = deriveRPNFactors(sub.name, sub.score, vsi);
    const rpn = calcRPN(factors);

    recs.push({
      id: `${id}-rec-${sub.name}`,
      aircraftId: id,
      subsystem: sub.name,
      issue,
      engineeringReason: reason,
      riskLevel: rpnToRiskLevel(rpn),
      action,
      windowHours: window,
      riskScore: rpn,
    });
  });

  return recs;
}

function buildAircraft(seed: AircraftSeed): Aircraft {
  const telemetryReadings = generateTelemetry(seed.id, seed.scenario, seed.flightCycles - 100);
  const latest = telemetryReadings[telemetryReadings.length - 1];

  // Compute subsystem health scores
  const engineScore = clampScore(engineHealthScore(
    latest.engineTemp, latest.engineVibration, latest.oilPressure, seed.flightHours
  ));
  const hydScore = clampScore(hydraulicHealthScore(latest.hydraulicPressure, seed.flightHours));
  const elecScore = clampScore(electricalHealthScore(latest.batteryVoltage, latest.generatorVoltage, seed.flightHours));
  const lgScore = clampScore(landingGearHealthScore(latest.landingGearCycles, 50000, seed.flightHours));
  const avScore = clampScore(avionicsHealthScore(latest.avionicsTemp, seed.flightHours));
  const ecsScore = clampScore(ecsHealthScore(latest.avionicsTemp, seed.flightHours));

  // Stress and RUL
  const tempScoreRaw = sensorScore(latest.engineTemp, 650, 750, 850, false);
  const vibScoreRaw = sensorScore(latest.engineVibration, 2.0, 5.0, 10.0, false);
  const stressFactor = calcStressFactor(tempScoreRaw, vibScoreRaw);

  const rated = { engine: 25000, hydraulic: 20000, electrical: 15000, lg: 30000, avionics: 20000, ecs: 18000 };

  const subsystems: SubsystemHealth[] = [
    {
      name: 'engine', displayName: 'Engine',
      score: engineScore, status: healthScoreToRiskLevel(engineScore),
      rul: Math.round(calcStressAdjustedRUL(rated.engine, seed.flightHours, stressFactor)),
      fatiqueConsumed: parseFloat(((seed.flightHours / rated.engine) * 100).toFixed(1)),
    },
    {
      name: 'hydraulic', displayName: 'Hydraulic System',
      score: hydScore, status: healthScoreToRiskLevel(hydScore),
      rul: Math.round(calcStressAdjustedRUL(rated.hydraulic, seed.flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((seed.flightHours / rated.hydraulic) * 100).toFixed(1)),
    },
    {
      name: 'electrical', displayName: 'Electrical System',
      score: elecScore, status: healthScoreToRiskLevel(elecScore),
      rul: Math.round(calcStressAdjustedRUL(rated.electrical, seed.flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((seed.flightHours / rated.electrical) * 100).toFixed(1)),
    },
    {
      name: 'landing_gear', displayName: 'Landing Gear',
      score: lgScore, status: healthScoreToRiskLevel(lgScore),
      rul: Math.round(calcBasicRULCycles(50000 - latest.landingGearCycles)),
      fatiqueConsumed: parseFloat(calcFatigueConsumed(latest.landingGearCycles, 50000).toFixed(1)),
    },
    {
      name: 'avionics', displayName: 'Avionics',
      score: avScore, status: healthScoreToRiskLevel(avScore),
      rul: Math.round(calcStressAdjustedRUL(rated.avionics, seed.flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((seed.flightHours / rated.avionics) * 100).toFixed(1)),
    },
    {
      name: 'ecs', displayName: 'Env. Control System',
      score: ecsScore, status: healthScoreToRiskLevel(ecsScore),
      rul: Math.round(calcStressAdjustedRUL(rated.ecs, seed.flightHours, 1.0)),
      fatiqueConsumed: parseFloat(((seed.flightHours / rated.ecs) * 100).toFixed(1)),
    },
  ];

  const overallHealth = clampScore(
    subsystems.reduce((sum, s) => sum + s.score, 0) / subsystems.length
  );
  const riskLevel: RiskLevel = healthScoreToRiskLevel(overallHealth);

  const mtbf = calcMTBF(seed.flightHours, seed.failures);
  const lambda = calcFailureRate(mtbf);
  const reliability = calcReliability(lambda, 100); // 100-hour mission

  const vsi = calcVSI(latest.engineVibration);
  const alerts = buildAlerts(seed.id, subsystems);
  const recommendations = buildRecommendations(
    seed.id, subsystems, vsi,
    latest.oilPressure, latest.hydraulicPressure,
    latest.batteryVoltage, latest.landingGearCycles,
    latest.avionicsTemp, seed.flightHours
  );

  return {
    id: seed.id,
    registration: seed.registration,
    model: seed.model,
    flightHours: seed.flightHours,
    flightCycles: seed.flightCycles,
    lastMaintenance: Date.now() - 30 * 24 * 3600000, // 30 days ago
    overallHealth,
    riskLevel,
    subsystems,
    telemetry: { readings: telemetryReadings },
    alerts,
    recommendations,
    mtbf: Math.round(mtbf),
    reliability: parseFloat(reliability.toFixed(4)),
  };
}

// Converts remaining cycles to approximate flight hours (assume 1.5 hrs/cycle avg)
function calcBasicRULCycles(remainingCycles: number): number {
  return Math.max(0, remainingCycles * 1.5);
}

// Build the fleet once at module load time
export const FLEET: Aircraft[] = SEEDS.map(buildAircraft);

export function getFleetSummary(): FleetSummary {
  return {
    totalAircraft: FLEET.length,
    averageHealth: Math.round(FLEET.reduce((s, a) => s + a.overallHealth, 0) / FLEET.length),
    activeAlerts: FLEET.reduce((s, a) => s + a.alerts.filter(al => !al.acknowledged).length, 0),
    criticalAircraft: FLEET.filter(a => a.riskLevel === 'critical').length,
    pendingMaintenance: FLEET.reduce((s, a) => s + a.recommendations.length, 0),
  };
}

export function getAircraft(id: string): Aircraft | undefined {
  return FLEET.find(a => a.id === id);
}

export function getAllAlerts() {
  return FLEET.flatMap(a => a.alerts).sort((a, b) => b.detectedAt - a.detectedAt);
}

export function getAllRecommendations() {
  return FLEET.flatMap(a => a.recommendations).sort((a, b) => b.riskScore - a.riskScore);
}
