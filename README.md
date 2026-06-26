# SkyPulse AI - Aircraft Predictive Maintenance Platform

A full-stack engineering proof-of-concept demonstrating aircraft predictive maintenance
using simulated telemetry, reliability engineering, subsystem health scoring, and FMEA-style
risk analysis.

> **Disclaimer:** This project uses simulated data and is not certified for real aircraft
> maintenance, flight safety, or operational aviation decision-making.

---

## Features

- Fleet health dashboard with 8 simulated aircraft
- Per-aircraft subsystem health scores (Engine, Hydraulics, Electrical, Landing Gear, Avionics, ECS)
- 24-hour telemetry charts for engine and electrical systems
- Active alerts with severity classification
- Maintenance recommendations with engineering reasoning and Risk Priority Numbers
- Engineering Methodology page with all formulas documented
- Worked engineering examples with full hand calculations
- Calculation validation page running unit tests live in the browser
- Portfolio case study page

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Routing | React Router v6 |
| Icons | Lucide React |

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

To build for production:

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
  simulation/
    telemetrySimulator.ts    Seeded stochastic sensor data generation
  calculations/
    healthScore.ts           Weighted sensor scoring for each subsystem
    reliability.ts           MTBF, failure rate lambda, R(t)
    rul.ts                   Stress factor, effective age, RUL
    risk.ts                  VSI, RPN (FMEA), FMEA factor derivation
    __tests__/
      calculations.test.ts   Unit test suite for all formulas
  data/
    fleet.ts                 Aircraft factory tying calculations to telemetry
  pages/                     React pages for each view
  components/                Reusable UI components
  types/index.ts             TypeScript interfaces
  utils/format.ts            Color helpers and formatting
```

---

## Engineering Formulas

### Health Score (Engine)

```
H_engine = 0.30 * T_score + 0.30 * V_score + 0.20 * P_score + 0.20 * U_score
```

### Remaining Useful Life (Stress-Adjusted)

```
Effective_Age = Flight_Hours * Stress_Factor
RUL = Rated_Life - Effective_Age

Stress_Factor = ((1 + 0.5*(1-T_norm)) + (1 + 0.8*(1-V_norm))) / 2
```

### Reliability Function

```
R(t) = e^(-lambda * t)
lambda = 1 / MTBF
MTBF = Total_Operating_Hours / Number_of_Failures
```

### Vibration Severity Index

```
VSI = V_measured / V_nominal    (nominal = 2.0 mm/s RMS)
```

ISO 10816 guidance: VSI > 2.5 = Warning, VSI > 4.0 = Critical

### FMEA Risk Priority Number

```
RPN = Severity * Probability * Detectability    (each factor 1-10)

RPN < 100   = Low
100 - 299   = Medium
300 - 599   = High
>= 600      = Critical
```

### Fatigue Consumed

```
Fatigue_% = (Actual_Cycles / Rated_Cycles) * 100
```

---

## Example Calculation (AC-102)

Input: Engine Temp = 720 C, Vibration = 4.2 mm/s, Oil = 51 PSI, Hours = 14,200

```
T_score = 80 + ((750-720)/(750-650))*20 = 86
V_score = 80 + ((5.0-4.2)/(5.0-2.0))*20 = 85
P_score = 80 + ((51-45)/(60-45))*20 = 88
U_score = 85  (14200/25000 = 56.8% of rated life)

Engine Health = 0.30(86) + 0.30(85) + 0.20(88) + 0.20(85)
             = 25.8 + 25.5 + 17.6 + 17.0
             = 85.9%  ->  86%

MTBF = 14200 / 5 = 2,840 hrs
R(100) = e^(-100/2840) = 0.965  ->  96.5% mission reliability
```

---

## Limitations

- All sensor data is procedurally generated, not from real aircraft
- Rule-based maintenance logic, not machine learning inference
- Exponential reliability model assumed; real components follow Weibull distributions
- No backend or database; all data lives in the browser
- Simplified linear health scoring hides nonlinear degradation dynamics

---

## Future Improvements

- LSTM or Transformer model for anomaly detection on raw telemetry sequences
- Weibull degradation modeling with Bayesian MTBF updating
- REST API + PostgreSQL backend for persistent fleet data
- ADS-B / ACARS real-time data integration
- Maintenance scheduling optimizer using reliability-centered logic

---

## Portfolio Description

Designed and built an aircraft predictive maintenance proof-of-concept demonstrating subsystem
health scoring, MTBF analysis, stress-adjusted Remaining Useful Life estimation, Vibration Severity
Index calculation, and FMEA-style risk prioritization using React, TypeScript, and aerospace
reliability engineering principles.
