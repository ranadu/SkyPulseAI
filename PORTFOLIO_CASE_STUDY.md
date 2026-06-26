# SkyPulse AI - Portfolio Case Study

## Problem Statement

Aviation maintenance is a critical safety and operational efficiency challenge.
Unscheduled maintenance events cost airlines an estimated $9 billion annually
(IATA industry estimate). Traditional scheduled maintenance replaces components on
fixed time intervals, ignoring actual component condition. Predictive maintenance
using real-time sensor data can reduce unexpected failures by 25-30% and lower
total maintenance costs by up to 12%.

This project asks: how can aerospace reliability engineering principles be
implemented in a software system that processes sensor telemetry, calculates
health scores, estimates Remaining Useful Life, and generates prioritized
maintenance recommendations?

---

## Why Predictive Maintenance Matters in Aviation

- Safety: undetected component degradation can lead to in-flight failures
- Cost: scheduled replacement wastes serviceable component life
- Efficiency: CBM (Condition-Based Maintenance) maximizes aircraft availability
- Regulatory: FAA and EASA encourage data-driven maintenance programs
- Industry direction: MRO 4.0 integrates IoT sensors with digital twin platforms

---

## Project Objectives

1. Demonstrate aerospace reliability engineering calculations in working code
2. Build a complete fleet health dashboard for a simulated maintenance operations center
3. Show sensor-to-subsystem-to-recommendation data flow with full engineering traceability
4. Provide clear engineering documentation proving the math behind every displayed value
5. Produce a portfolio-quality application demonstrating full-stack engineering capability

---

## Tools and Technologies

| Tool | Purpose |
|---|---|
| React 18 + TypeScript | Frontend framework with strict typing |
| Vite | Build tool and dev server |
| Tailwind CSS | Utility-first styling, dark aerospace theme |
| Recharts | Time-series telemetry visualization |
| React Router v6 | Single-page application routing |
| Lucide React | Icon library |

---

## System Architecture

The application is structured in four layers:

**Simulation layer** (`src/simulation/`): Generates reproducible sensor time-series
data using seeded pseudo-random noise around scenario profiles (nominal, degraded,
warning, critical).

**Calculation layer** (`src/calculations/`): Pure TypeScript functions implementing
health scoring, reliability, RUL, and risk formulas. No side effects; fully testable.

**Data layer** (`src/data/`): Aircraft factory that combines telemetry with all
calculations to build complete `Aircraft` objects used throughout the UI.

**UI layer** (`src/pages/`, `src/components/`): React components consuming the data
layer, with no engineering logic embedded in the UI.

---

## Engineering Models Used

| Model | Formula | Purpose |
|---|---|---|
| Subsystem Health Score | Weighted sensor sum | Overall subsystem condition |
| Stress Factor | f(temperature, vibration) | Adjusts aging rate |
| Remaining Useful Life | Rated_Life - Effective_Age | Failure horizon |
| MTBF | Operating_Hours / Failures | Fleet reliability history |
| Failure Rate | lambda = 1/MTBF | Exponential model parameter |
| Reliability | R(t) = e^(-lambda*t) | Mission success probability |
| Vibration Severity Index | VSI = V_meas / V_nom | ISO 10816 vibration assessment |
| FMEA Risk Priority Number | RPN = S * P * D | Maintenance prioritization |
| Fatigue Consumed | Cycles / Rated_Cycles * 100 | Structural life tracking |

---

## Data Simulation Approach

Each aircraft has a `HealthScenario` (nominal, degraded, warning, critical) that sets
base sensor values. A seeded pseudo-random generator (mulberry32 algorithm) adds noise
and drift to each reading, creating realistic-looking time-series data that is
reproducible for any given aircraft ID.

The simulator generates 48 readings at 30-minute intervals (24 hours of history)
per aircraft. Degraded and critical scenarios include positive trend drift, simulating
progressive component wear.

---

## Key Features

- 8 simulated aircraft across 4 health scenarios
- 6 subsystems per aircraft with individual health scores
- 24-hour telemetry charts for engine and electrical systems
- FMEA-style maintenance recommendations with RPN scores
- Engineering Methodology page with all formulas
- Worked Examples page with full hand calculations
- Live validation page running unit tests in the browser

---

## Resume Bullet Points

- Designed and built an aircraft predictive maintenance proof-of-concept using
  simulated telemetry, reliability engineering, subsystem health scoring, and
  FMEA-style risk analysis.

- Implemented engineering calculation modules for Remaining Useful Life, MTBF,
  reliability probability, vibration severity, fatigue usage, and maintenance risk
  prioritization using TypeScript.

- Developed a full-stack fleet health dashboard to visualize aircraft sensor trends,
  subsystem degradation, active alerts, and recommended maintenance actions across
  8 simulated aircraft.

- Applied aerospace engineering formulas (exponential reliability model, stress-adjusted
  effective age, VSI per ISO 10816, fatigue consumed) in production-quality code with
  engineering documentation.

- Architected a modular React + TypeScript application separating simulation,
  calculations, data layer, and UI to demonstrate software engineering best practices
  in an aerospace context.

---

## What I Learned

- Translating engineering formulas into software requires explicit edge-case handling
  (zero failures, out-of-range sensors, zero-denominator conditions)
- Weighted scoring models are interpretable but hide nonlinear failure mode interactions
- The gap between a rule-based demo and a certified PHM system is substantial: data
  quality, sensor fusion, and airworthiness validation are the hard problems
- Engineering documentation (Methodology page, Worked Examples) is as important as the
  code itself for an aerospace project
- Visualization choices matter: a trend chart showing rate of degradation is more
  actionable than a static health percentage

---

## Limitations

- All data is simulated, not from real aircraft sensors
- Rule-based recommendation logic, not machine learning inference
- Exponential reliability model assumed (constant failure rate); real components follow
  Weibull distributions with increasing failure rate during wear-out phase
- No backend or database; all state is in-memory
- Single-sensor-to-subsystem mapping; real PHM uses multi-sensor fusion
- No environmental context (altitude, load, temperature) in degradation model

---

## Future Improvements

- Replace linear health model with Weibull-based degradation and particle filter RUL
- Integrate LSTM or Transformer-based anomaly detection on raw telemetry sequences
- Connect to ADS-B data streams for real flight hours and cycle tracking
- Add Bayesian MTBF updating as failure events arrive in real time
- Implement maintenance scheduling optimizer with reliability-centered logic
- Export reports in iSpec 2200 or MIL-STD-1388 format

---

*This is an educational engineering proof of concept using simulated data.
It is not certified for real aircraft maintenance, flight safety, or operational
aviation decision-making.*
