/**
 * Reliability and Failure Rate Calculations
 *
 * Based on exponential reliability model (constant failure rate).
 * Suitable for electronic and mechanical systems in steady-state operation.
 */

/**
 * Mean Time Between Failures.
 *
 * MTBF = Total Operating Hours / Number of Failures
 *
 * @param totalHours  - cumulative operating hours
 * @param failures    - number of recorded failures
 */
export function calcMTBF(totalHours: number, failures: number): number {
  if (failures <= 0) return totalHours * 10; // no failures: generous estimate
  return totalHours / failures;
}

/**
 * Failure rate (failures per hour).
 *
 * lambda = 1 / MTBF
 */
export function calcFailureRate(mtbf: number): number {
  if (mtbf <= 0) return 1;
  return 1 / mtbf;
}

/**
 * Reliability probability at time t.
 *
 * R(t) = e^(-lambda * t)
 *
 * @param lambda  - failure rate (1/hr)
 * @param t       - mission time in hours
 */
export function calcReliability(lambda: number, t: number): number {
  return Math.exp(-lambda * t);
}

/**
 * Reliability at future time given current state.
 * Uses a health-adjusted failure rate: degraded health raises the failure rate.
 *
 * Effective lambda = base_lambda / (health_score / 100)
 *
 * @param baseMtbf    - baseline MTBF for this subsystem
 * @param healthScore - current health score 0-100
 * @param missionHours - hours to project into the future
 */
export function calcAdjustedReliability(
  baseMtbf: number,
  healthScore: number,
  missionHours: number
): number {
  const healthFactor = Math.max(0.01, healthScore / 100);
  const effectiveLambda = calcFailureRate(baseMtbf) / healthFactor;
  return calcReliability(effectiveLambda, missionHours);
}
