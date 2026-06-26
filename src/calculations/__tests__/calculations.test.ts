/**
 * Validation tests for engineering calculation modules.
 * These are lightweight unit tests, not jest -- they run via the browser
 * console or a simple Node script. See scripts/validate.ts for CLI usage.
 */

import {
  engineHealthScore,
  sensorScore,
  usageScore,
  clampScore,
} from '../healthScore';
import { calcMTBF, calcFailureRate, calcReliability } from '../reliability';
import { calcStressFactor, calcStressAdjustedRUL, calcFatigueConsumed } from '../rul';
import { calcVSI, calcRPN, rpnToRiskLevel } from '../risk';

interface TestCase {
  name: string;
  actual: number | string;
  expected: number | string;
  tolerance?: number;
}

function approxEqual(a: number, b: number, tol = 0.01): boolean {
  return Math.abs(a - b) <= tol;
}

export function runAllTests(): { passed: number; failed: number; results: string[] } {
  const tests: TestCase[] = [
    // sensorScore: temp at nominal
    { name: 'sensorScore temp at nominal (650C)', actual: sensorScore(650, 650, 750, 850, false), expected: 100 },
    // sensorScore: temp at critical
    { name: 'sensorScore temp at critical (850C)', actual: sensorScore(850, 650, 750, 850, false), expected: 0 },
    // sensorScore: oil pressure at nominal
    { name: 'sensorScore oil at nominal (60 PSI)', actual: sensorScore(60, 60, 45, 30, true), expected: 100 },
    // usageScore: 0 hours
    { name: 'usageScore 0 hours', actual: usageScore(0, 25000), expected: 100 },
    // usageScore: at rated life
    { name: 'usageScore at rated life', actual: usageScore(25000, 25000), expected: 0 },
    // engineHealthScore: all nominal inputs
    {
      name: 'engineHealthScore nominal inputs',
      actual: clampScore(engineHealthScore(650, 2.0, 60, 5000)),
      expected: 100,
    },
    // MTBF
    { name: 'MTBF = 14200/5', actual: calcMTBF(14200, 5), expected: 2840 },
    // Failure rate
    {
      name: 'lambda = 1/2840',
      actual: parseFloat(calcFailureRate(2840).toFixed(6)),
      expected: parseFloat((1 / 2840).toFixed(6)),
    },
    // Reliability R(100) = e^(-0.000352 * 100)
    {
      name: 'R(100) for MTBF=2840',
      actual: parseFloat(calcReliability(calcFailureRate(2840), 100).toFixed(4)),
      expected: parseFloat(Math.exp(-100 / 2840).toFixed(4)),
    },
    // Stress factor: all nominal (score = 100)
    { name: 'stressFactor at nominal (score=100)', actual: calcStressFactor(100, 100), expected: 1.0 },
    // RUL basic: no stress
    {
      name: 'RUL basic: 5000 hrs, no stress',
      actual: calcStressAdjustedRUL(25000, 5000, 1.0),
      expected: 20000,
    },
    // Fatigue consumed
    { name: 'fatigue consumed 25000/50000', actual: calcFatigueConsumed(25000, 50000), expected: 50 },
    // VSI
    { name: 'VSI = 4.2/2.0', actual: calcVSI(4.2), expected: 2.1, tolerance: 0.01 },
    { name: 'VSI at nominal = 1.0', actual: calcVSI(2.0), expected: 1.0 },
    // RPN
    { name: 'RPN = 9*2*5', actual: calcRPN({ severity: 9, probability: 2, detectability: 5 }), expected: 90 },
    { name: 'RPN risk level: 90 = low', actual: rpnToRiskLevel(90), expected: 'low' },
    { name: 'RPN risk level: 150 = medium', actual: rpnToRiskLevel(150), expected: 'medium' },
    { name: 'RPN risk level: 400 = high', actual: rpnToRiskLevel(400), expected: 'high' },
    { name: 'RPN risk level: 700 = critical', actual: rpnToRiskLevel(700), expected: 'critical' },
  ];

  let passed = 0;
  let failed = 0;
  const results: string[] = [];

  for (const t of tests) {
    let ok: boolean;
    if (typeof t.actual === 'number' && typeof t.expected === 'number') {
      ok = approxEqual(t.actual, t.expected, t.tolerance ?? 0.5);
    } else {
      ok = t.actual === t.expected;
    }

    if (ok) {
      passed++;
      results.push(`PASS  ${t.name}`);
    } else {
      failed++;
      results.push(`FAIL  ${t.name}  got=${t.actual}  expected=${t.expected}`);
    }
  }

  return { passed, failed, results };
}
