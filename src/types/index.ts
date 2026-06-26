export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type SubsystemName =
  | 'engine'
  | 'hydraulic'
  | 'electrical'
  | 'landing_gear'
  | 'avionics'
  | 'ecs';

export interface SensorReading {
  timestamp: number;
  engineTemp: number;        // degrees C
  engineVibration: number;   // mm/s RMS
  oilPressure: number;       // PSI
  fuelFlow: number;          // kg/hr
  hydraulicPressure: number; // PSI
  batteryVoltage: number;    // V
  generatorVoltage: number;  // V
  avionicsTemp: number;      // degrees C
  landingGearCycles: number; // count
}

export interface TelemetryHistory {
  readings: SensorReading[];
}

export interface SubsystemHealth {
  name: SubsystemName;
  displayName: string;
  score: number;          // 0-100
  status: RiskLevel;
  rul: number;            // Remaining Useful Life in flight hours
  fatiqueConsumed: number; // percent 0-100
}

export interface Alert {
  id: string;
  aircraftId: string;
  subsystem: SubsystemName;
  severity: RiskLevel;
  message: string;
  detectedAt: number;     // timestamp
  acknowledged: boolean;
}

export interface MaintenanceRecommendation {
  id: string;
  aircraftId: string;
  subsystem: SubsystemName;
  issue: string;
  engineeringReason: string;
  riskLevel: RiskLevel;
  action: string;
  windowHours: number;    // "within X flight hours"
  riskScore: number;      // RPN: Severity x Probability x Detectability
}

export interface Aircraft {
  id: string;
  registration: string;
  model: string;
  flightHours: number;
  flightCycles: number;
  lastMaintenance: number;  // timestamp
  overallHealth: number;    // 0-100 weighted average
  riskLevel: RiskLevel;
  subsystems: SubsystemHealth[];
  telemetry: TelemetryHistory;
  alerts: Alert[];
  recommendations: MaintenanceRecommendation[];
  mtbf: number;             // hours
  reliability: number;      // R(t) probability 0-1
}

export interface FleetSummary {
  totalAircraft: number;
  averageHealth: number;
  activeAlerts: number;
  criticalAircraft: number;
  pendingMaintenance: number;
}
