/**
 * Remaining Useful Life (RUL) Calculations
 *
 * Two approaches:
 *   Basic:    RUL = Rated Life - Actual Hours
 *   Advanced: RUL = Rated Life - Effective Age
 *             Effective Age = Flight Hours * Stress Factor
 *
 * Stress factors account for operating conditions that accelerate aging:
 * high temperature, high vibration, heavy cycles, etc.
 */

/**
 * Stress factor multiplier.
 * A value > 1.0 means the component is aging faster than its nominal rate.
 *
 * @param tempScore    - temperature health score 0-100 (lower = hotter)
 * @param vibScore     - vibration health score 0-100
 */
export function calcStressFactor(tempScore: number, vibScore: number): number {
  // Map degraded scores to accelerated aging
  const tempFactor = 1.0 + ((100 - tempScore) / 100) * 0.5;  // up to 1.5x
  const vibFactor  = 1.0 + ((100 - vibScore) / 100) * 0.8;   // up to 1.8x
  return (tempFactor + vibFactor) / 2;
}

/**
 * Effective age of a component accounting for stress.
 *
 * Effective Age = Flight Hours * Stress Factor
 */
export function calcEffectiveAge(flightHours: number, stressFactor: number): number {
  return flightHours * stressFactor;
}

/**
 * Remaining Useful Life (basic).
 *
 * RUL = Rated Life - Actual Hours
 */
export function calcBasicRUL(ratedLife: number, actualHours: number): number {
  return Math.max(0, ratedLife - actualHours);
}

/**
 * Remaining Useful Life (stress-adjusted).
 *
 * RUL = Rated Life - Effective Age
 */
export function calcStressAdjustedRUL(
  ratedLife: number,
  flightHours: number,
  stressFactor: number
): number {
  const effectiveAge = calcEffectiveAge(flightHours, stressFactor);
  return Math.max(0, ratedLife - effectiveAge);
}

/** Fatigue consumption as a percentage. */
export function calcFatigueConsumed(actualCycles: number, ratedCycles: number): number {
  return Math.min(100, (actualCycles / ratedCycles) * 100);
}
