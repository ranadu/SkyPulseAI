/**
 * Risk Scoring and FMEA-style Analysis
 *
 * Risk Priority Number (RPN) from FMEA (Failure Mode and Effects Analysis):
 *
 *   RPN = Severity x Probability x Detectability
 *
 * Each factor is rated 1-10:
 *   Severity:      Impact of failure on safety / mission (10 = catastrophic)
 *   Probability:   Likelihood of failure occurring (10 = almost certain)
 *   Detectability: Ease of detecting the failure before it causes harm (10 = undetectable)
 *
 * RPN range: 1 - 1000
 *   Low:      1 - 99
 *   Medium:   100 - 299
 *   High:     300 - 599
 *   Critical: 600 - 1000
 */

import type { RiskLevel } from '../types';

export interface RPNFactors {
  severity: number;      // 1-10
  probability: number;   // 1-10
  detectability: number; // 1-10
}

export function calcRPN(factors: RPNFactors): number {
  return factors.severity * factors.probability * factors.detectability;
}

export function rpnToRiskLevel(rpn: number): RiskLevel {
  if (rpn >= 600) return 'critical';
  if (rpn >= 300) return 'high';
  if (rpn >= 100) return 'medium';
  return 'low';
}

export function healthScoreToRiskLevel(score: number): RiskLevel {
  if (score < 40) return 'critical';
  if (score < 60) return 'high';
  if (score < 80) return 'medium';
  return 'low';
}

/**
 * Vibration Severity Index (VSI).
 *
 * VSI = Measured Vibration / Normal Vibration
 *
 * VSI > 1.0 indicates elevated vibration.
 * ISO 10816 guidance: VSI > 2.5 = warning, VSI > 4.0 = critical.
 */
export function calcVSI(measuredVibration: number, nominalVibration = 2.0): number {
  return measuredVibration / nominalVibration;
}

/**
 * Temperature Trend Rate.
 *
 * Rate = delta_temp / delta_time  (degrees C per flight hour)
 *
 * A positive rate over multiple readings suggests thermal degradation.
 */
export function calcTempTrendRate(
  tempReadings: number[],
  timeSteps: number
): number {
  if (tempReadings.length < 2) return 0;
  const deltaTemp = tempReadings[tempReadings.length - 1] - tempReadings[0];
  return deltaTemp / timeSteps;
}

/**
 * Derive RPN factors from sensor scores and aircraft state.
 * Used to generate realistic FMEA-style risk scores automatically.
 */
export function deriveRPNFactors(
  subsystem: string,
  healthScore: number,
  _vsi: number
): RPNFactors {
  // Severity: system criticality (engine is most critical)
  const severityMap: Record<string, number> = {
    engine: 9,
    hydraulic: 7,
    electrical: 6,
    landing_gear: 8,
    avionics: 5,
    ecs: 4,
  };
  const severity = severityMap[subsystem] ?? 5;

  // Probability: derived from health score degradation
  const probability = Math.ceil(((100 - healthScore) / 100) * 10);

  // Detectability: higher VSI or low health = easier to detect (lower number = easy to detect in FMEA)
  // We invert convention here: if health is low, it IS detectable (score 2-4)
  const detectability = healthScore < 50 ? 3 : healthScore < 75 ? 5 : 7;

  return {
    severity,
    probability: Math.max(1, Math.min(10, probability)),
    detectability,
  };
}
