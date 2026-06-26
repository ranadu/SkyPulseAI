/**
 * Health Score Calculations
 *
 * Each subsystem health score is a weighted sum of normalized sensor scores.
 * Sensor scores are scaled 0-100 based on distance from normal operating range.
 * A score of 100 = perfectly nominal. A score of 0 = at or beyond failure threshold.
 */

// Normal operating ranges for each sensor
export const SENSOR_LIMITS = {
  engineTemp:        { nominal: 650,  warning: 750,  critical: 850  }, // degrees C
  engineVibration:   { nominal: 2.0,  warning: 5.0,  critical: 10.0 }, // mm/s RMS
  oilPressure:       { nominal: 60,   warning: 45,   critical: 30   }, // PSI (lower is worse)
  fuelFlow:          { nominal: 850,  warning: 950,  critical: 1100 }, // kg/hr
  hydraulicPressure: { nominal: 3000, warning: 2400, critical: 1800 }, // PSI
  batteryVoltage:    { nominal: 28.0, warning: 25.5, critical: 23.0 }, // V
  generatorVoltage:  { nominal: 115,  warning: 112,  critical: 108  }, // V
  avionicsTemp:      { nominal: 45,   warning: 60,   critical: 75   }, // degrees C
};

/**
 * Linearly interpolates a 0-100 score for a sensor value.
 * higherIsBetter: true if nominal > warning (e.g., oil pressure, voltage).
 * higherIsBetter: false if nominal < warning (e.g., temperature, vibration).
 */
export function sensorScore(
  value: number,
  nominal: number,
  warning: number,
  critical: number,
  higherIsBetter: boolean
): number {
  if (higherIsBetter) {
    // Score drops as value falls below nominal
    if (value >= nominal) return 100;
    if (value <= critical) return 0;
    if (value >= warning) {
      return 80 + ((value - warning) / (nominal - warning)) * 20;
    }
    return ((value - critical) / (warning - critical)) * 80;
  } else {
    // Score drops as value rises above nominal
    if (value <= nominal) return 100;
    if (value >= critical) return 0;
    if (value <= warning) {
      return 80 + ((warning - value) / (warning - nominal)) * 20;
    }
    return ((critical - value) / (critical - warning)) * 80;
  }
}

/** Usage score based on flight hours as a fraction of rated life. */
export function usageScore(flightHours: number, ratedLifeHours: number): number {
  const fraction = flightHours / ratedLifeHours;
  if (fraction >= 1.0) return 0;
  if (fraction >= 0.9) return 20 * (1 - fraction) / 0.1;
  if (fraction >= 0.75) return 20 + 60 * (0.9 - fraction) / 0.15;
  return 80 + 20 * (0.75 - fraction) / 0.75;
}

/**
 * Engine health score (weighted sum).
 *
 * Engine Health = 0.30*Temp + 0.30*Vibration + 0.20*OilPressure + 0.20*Usage
 */
export function engineHealthScore(
  engineTemp: number,
  engineVibration: number,
  oilPressure: number,
  flightHours: number,
  engineRatedLife = 25000
): number {
  const tempScore = sensorScore(engineTemp, 650, 750, 850, false);
  const vibScore  = sensorScore(engineVibration, 2.0, 5.0, 10.0, false);
  const oilScore  = sensorScore(oilPressure, 60, 45, 30, true);
  const usage     = usageScore(flightHours, engineRatedLife);

  return 0.30 * tempScore + 0.30 * vibScore + 0.20 * oilScore + 0.20 * usage;
}

/**
 * Hydraulic health score.
 *
 * Hydraulic Health = 0.60*HydPressure + 0.40*Usage
 */
export function hydraulicHealthScore(
  hydraulicPressure: number,
  flightHours: number,
  hydRatedLife = 20000
): number {
  const pressScore = sensorScore(hydraulicPressure, 3000, 2400, 1800, true);
  const usage      = usageScore(flightHours, hydRatedLife);
  return 0.60 * pressScore + 0.40 * usage;
}

/**
 * Electrical health score.
 *
 * Electrical Health = 0.40*Battery + 0.40*Generator + 0.20*Usage
 */
export function electricalHealthScore(
  batteryVoltage: number,
  generatorVoltage: number,
  flightHours: number,
  elecRatedLife = 15000
): number {
  const batScore = sensorScore(batteryVoltage, 28.0, 25.5, 23.0, true);
  const genScore = sensorScore(generatorVoltage, 115, 112, 108, true);
  const usage    = usageScore(flightHours, elecRatedLife);
  return 0.40 * batScore + 0.40 * genScore + 0.20 * usage;
}

/**
 * Landing gear health score based on cycle fatigue.
 *
 * Landing Gear Health = 0.70*CycleScore + 0.30*Usage
 */
export function landingGearHealthScore(
  landingGearCycles: number,
  ratedCycles = 50000,
  flightHours: number,
  lgRatedLife = 30000
): number {
  const fatigue = landingGearCycles / ratedCycles;
  const cycleScore = Math.max(0, Math.min(100, (1 - fatigue) * 100));
  const usage = usageScore(flightHours, lgRatedLife);
  return 0.70 * cycleScore + 0.30 * usage;
}

/**
 * Avionics health score.
 *
 * Avionics Health = 0.60*AvionicsTemp + 0.40*Usage
 */
export function avionicsHealthScore(
  avionicsTemp: number,
  flightHours: number,
  avionicsRatedLife = 20000
): number {
  const tempScore = sensorScore(avionicsTemp, 45, 60, 75, false);
  const usage     = usageScore(flightHours, avionicsRatedLife);
  return 0.60 * tempScore + 0.40 * usage;
}

/**
 * ECS (Environmental Control System) health score.
 *
 * Uses avionics temp as a proxy indicator plus usage.
 */
export function ecsHealthScore(
  avionicsTemp: number,
  flightHours: number,
  ecsRatedLife = 18000
): number {
  const tempScore = sensorScore(avionicsTemp, 45, 58, 72, false);
  const usage     = usageScore(flightHours, ecsRatedLife);
  return 0.50 * tempScore + 0.50 * usage;
}

/** Clamps and rounds a health score to integer 0-100. */
export function clampScore(score: number): number {
  return Math.round(Math.max(0, Math.min(100, score)));
}
