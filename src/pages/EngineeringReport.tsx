/**
 * Engineering Report — a formal technical document embedded in the app.
 * Styled to read like an actual engineering submission, not a marketing page.
 */

export default function EngineeringReport() {
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* Document header */}
      <div style={{
        borderBottom: '2px solid #e8a020',
        paddingBottom: 24,
        marginBottom: 40,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', letterSpacing: '0.2em', marginBottom: 10 }}>
              TECHNICAL REPORT / ENGINEERING PROOF-OF-CONCEPT
            </div>
            <h1 style={{
              fontFamily: 'var(--font-data)', fontSize: 20, fontWeight: 700,
              color: '#e2eaf5', margin: '0 0 6px', letterSpacing: '-0.01em', lineHeight: 1.3,
            }}>
              Aircraft Fleet Predictive Maintenance System:<br />
              A Reliability-Engineering-Based Proof of Concept
            </h1>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#4a5a7a', marginTop: 10, lineHeight: 2 }}>
              <div>Author: Robert A. — Aerospace Engineering Graduate</div>
              <div>Date: June 2026</div>
              <div>Status: <span style={{ color: '#facc15' }}>Educational Proof-of-Concept — Not for Operational Use</span></div>
            </div>
          </div>
          <div style={{
            background: '#0b1018', border: '1px solid #1a2235',
            padding: '12px 18px', minWidth: 160,
          }}>
            <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.14em', marginBottom: 8 }}>DOCUMENT INFO</div>
            {[
              ['Rev', 'A'],
              ['Aircraft', '8 simulated'],
              ['Subsystems', '6 per A/C'],
              ['Models', '5 engineering'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>{k}</span>
                <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#94a3b8' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{
        border: '1px solid rgba(250,204,21,0.2)', background: 'rgba(250,204,21,0.04)',
        padding: '10px 16px', marginBottom: 40,
        fontFamily: 'var(--font-data)', fontSize: 9, color: '#6b7fa3',
        letterSpacing: '0.06em', lineHeight: 1.8,
      }}>
        ⚠ This document describes an educational simulation. All sensor data is procedurally generated.
        No results herein should be used for real aircraft maintenance, flight operations, or airworthiness decisions.
        Real PHM systems require certified data acquisition, validated models, and compliance with FAA AC 120-66B / EASA Part-M.
      </div>

      <ReportSection number="1" title="Executive Summary">
        <P>
          This report documents a software proof-of-concept demonstrating how reliability engineering
          principles can be applied to aircraft fleet predictive maintenance. The system ingests
          simulated sensor telemetry from eight aircraft, computes subsystem health scores using
          weighted sensor models, estimates Remaining Useful Life (RUL) via a stress-adjusted degradation
          model, calculates mission reliability using the exponential reliability function, and prioritises
          maintenance actions using a Failure Mode and Effects Analysis (FMEA) risk scoring approach.
        </P>
        <P>
          The primary engineering contribution is not the software interface but the explicit, traceable
          calculation chain from raw sensor readings to maintenance recommendation. Every displayed value
          can be derived by hand from first principles, and the worked examples in this system demonstrate
          that derivation in full.
        </P>
        <Callout type="finding">
          Key finding: Rule-based PHM with explicit engineering models produces interpretable,
          auditable results that align with industry practice at the conceptual level. The principal
          limitation is the absence of real sensor data and validated degradation curves, which would
          be required before any operational deployment.
        </Callout>
      </ReportSection>

      <ReportSection number="2" title="Problem Statement and Motivation">
        <P>
          Commercial aircraft maintenance represents a significant cost and safety challenge. Unscheduled
          maintenance events -- failures that occur outside planned maintenance windows -- cost the industry
          an estimated $9 billion annually in direct costs and operational disruption (IATA, 2023).
          The dominant maintenance paradigm, Scheduled Maintenance, replaces or inspects components on
          fixed time or cycle intervals regardless of actual condition. This approach has two failure modes:
        </P>
        <NumberedList items={[
          'Over-maintenance: serviceable components are replaced before end of life, wasting cost and labour.',
          'Under-detection: components that degrade faster than expected (due to unusual operating conditions) are not caught between scheduled intervals.',
        ]} />
        <P>
          Condition-Based Maintenance (CBM) addresses both problems by monitoring actual component health
          through sensor data and triggering maintenance actions based on measured condition rather than
          elapsed time. Predictive Maintenance (PdM) extends CBM by forecasting when a component will
          reach a failure threshold, enabling proactive planning rather than reactive response.
        </P>
        <P>
          This project asks: what does a minimal but engineering-credible PdM system look like, and what
          are the engineering models required to build one?
        </P>
      </ReportSection>

      <ReportSection number="3" title="Scope and Objectives">
        <P>The scope of this proof-of-concept is limited to the following:</P>
        <NumberedList items={[
          'Simulate sensor telemetry for a fleet of 8 commercial transport aircraft across 6 subsystems.',
          'Implement and document five reliability engineering calculation models (health scoring, RUL, MTBF, R(t), FMEA RPN).',
          'Generate maintenance recommendations from calculated risk scores using rule-based logic.',
          'Provide full engineering traceability: every displayed value is derivable from the documented formulas and the shown sensor inputs.',
          'Demonstrate the calculation in a worked example that matches the live system output.',
        ]} />
        <P>
          This project explicitly does not claim to produce certified, validated, or operationally
          deployable outputs. It is a conceptual demonstration of the engineering methodology.
        </P>
      </ReportSection>

      <ReportSection number="4" title="Assumptions and Justifications">
        <P>
          Every engineering model rests on assumptions. Stating them explicitly is not a weakness --
          it is the mark of rigorous engineering practice. The following assumptions underpin this system:
        </P>

        <AssumptionTable assumptions={[
          {
            id: 'A1',
            assumption: 'Constant failure rate (exponential reliability model)',
            justification: 'Simplest tractable model; valid during the useful-life phase of the bathtub curve where random failures dominate. Breaks down during infant mortality and wear-out phases.',
            impact: 'Underestimates risk as components approach end-of-life (wear-out). A Weibull model with shape parameter β > 1 would be more accurate for wear-out.',
          },
          {
            id: 'A2',
            assumption: 'Linear sensor score interpolation between nominal and critical thresholds',
            justification: 'Computationally transparent and easy to audit. Real degradation is often nonlinear.',
            impact: 'Health scores may be optimistic in the early degradation phase and pessimistic near the critical threshold. A piecewise or sigmoid mapping would be more physically accurate.',
          },
          {
            id: 'A3',
            assumption: 'Stress factor derived from temperature and vibration scores only',
            justification: 'Temperature and vibration are the dominant accelerated aging drivers for turbine engines and rotating machinery (Arrhenius, Miner\'s rule).',
            impact: 'Ignores altitude, humidity, fuel quality, and load cycle shape. All of these affect real component life.',
          },
          {
            id: 'A4',
            assumption: 'Rated component lives are fixed constants',
            justification: 'Reflects OEM design life limits used as a baseline in real maintenance programs.',
            impact: 'Real life limits are probabilistic, not deterministic. A component may fail before or survive beyond its rated life.',
          },
          {
            id: 'A5',
            assumption: 'MTBF estimated from a small number of simulated failures',
            justification: 'Demonstrates the formula. In practice, MTBF estimates require large failure datasets to achieve statistical confidence.',
            impact: 'At N=5 failures, the 90% confidence interval on MTBF spans roughly a factor of 3-5x. These values should be treated as order-of-magnitude estimates only.',
          },
          {
            id: 'A6',
            assumption: 'All sensor data is stochastically generated around scenario profiles',
            justification: 'No real aircraft data is available for this proof-of-concept.',
            impact: 'All quantitative results are illustrative only. Conclusions about specific health scores do not reflect real aircraft condition.',
          },
        ]} />
      </ReportSection>

      <ReportSection number="5" title="Methodology">

        <SubSection title="5.1 Sensor Telemetry Simulation">
          <P>
            Eight aircraft are assigned to one of four health scenarios (nominal, degraded, warning, critical).
            Each scenario defines baseline sensor values. A seeded pseudo-random generator (mulberry32 algorithm)
            adds bounded Gaussian noise and a scenario-dependent drift term, producing a 24-hour rolling window
            of 48 readings at 30-minute intervals. The seed is derived from the aircraft ID, making outputs
            reproducible. A live 4-second tick adds new readings in the browser, simulating real-time data ingestion.
          </P>
        </SubSection>

        <SubSection title="5.2 Subsystem Health Scoring Model">
          <P>
            Each sensor reading is normalised to a score between 0 and 100 using linear interpolation
            between the nominal operating value (score = 100) and the critical failure threshold (score = 0):
          </P>
          <Formula>
            {`For sensors where lower values are worse (oil pressure, voltage):
  Score = 100                                if value ≥ nominal
  Score = 80 + (value−warning)/(nom−warning) × 20   if warning ≤ value < nominal
  Score = (value−critical)/(warning−critical) × 80  if critical ≤ value < warning
  Score = 0                                  if value ≤ critical`}
          </Formula>
          <P>
            Subsystem health is then the weighted sum of its component sensor scores.
            Weights reflect the relative diagnostic importance of each sensor for that subsystem,
            informed by aerospace maintenance engineering practice:
          </P>
          <Formula>
            {`H_engine     = 0.30·T + 0.30·V + 0.20·P + 0.20·U
H_hydraulic  = 0.60·HydPress + 0.40·U
H_electrical = 0.40·BatV + 0.40·GenV + 0.20·U
H_lg         = 0.70·CycleScore + 0.30·U
H_avionics   = 0.60·AvTemp + 0.40·U
H_ecs        = 0.50·AvTemp + 0.50·U`}
          </Formula>
          <P>
            The overall aircraft health is the unweighted average of all six subsystem scores.
            In a real system, subsystem weights would reflect airworthiness impact and would
            be calibrated against fleet failure data.
          </P>
        </SubSection>

        <SubSection title="5.3 Remaining Useful Life Model">
          <P>
            The basic RUL calculation is:
          </P>
          <Formula>{`RUL = Rated_Life − Actual_Flight_Hours`}</Formula>
          <P>
            This is extended with a stress factor that accounts for operating conditions that
            accelerate aging beyond the nominal rate. The stress factor is derived from the
            temperature and vibration health scores, which are the primary drivers of thermal
            fatigue and mechanical wear respectively:
          </P>
          <Formula>
            {`Stress_Factor (SF) = ( (1 + 0.5·(1−T_norm)) + (1 + 0.8·(1−V_norm)) ) / 2

Effective_Age      = Flight_Hours × SF
RUL_adjusted       = Rated_Life − Effective_Age`}
          </Formula>
          <P>
            A stress factor of 1.0 indicates nominal aging. A factor of 1.3 means the component
            is accumulating effective life 30% faster than its rated conditions assume.
            The 0.5 and 0.8 coefficients reflect that vibration has a stronger accelerating
            effect on mechanical wear than temperature does at sub-critical levels,
            consistent with Miner's Rule for fatigue damage accumulation.
          </P>
        </SubSection>

        <SubSection title="5.4 Reliability Model">
          <P>
            The exponential reliability function is used as a first-order approximation:
          </P>
          <Formula>
            {`MTBF   = Total_Operating_Hours / Number_of_Failures
λ      = 1 / MTBF                          (failure rate, failures per hour)
R(t)   = e^(−λ·t)                          (reliability at mission time t)`}
          </Formula>
          <P>
            This model assumes a constant failure rate, which holds during the useful-life
            (random failure) phase of the component lifecycle. For a 100-hour mission:
            a component with MTBF = 2,840 hrs has R(100) = e^(−100/2840) = 0.965, meaning
            a 96.5% probability of completing the mission without failure.
          </P>
          <Callout type="warning">
            Important limitation: the exponential model underestimates failure probability
            as components approach end-of-life. A Weibull model with shape parameter β &gt; 1
            (wear-out regime) would increase the predicted failure rate as age increases.
            The values shown in this system should be treated as optimistic estimates for
            high-hour aircraft.
          </Callout>
        </SubSection>

        <SubSection title="5.5 FMEA Risk Prioritisation">
          <P>
            Maintenance recommendations are prioritised using a Risk Priority Number (RPN)
            derived from Failure Mode and Effects Analysis (FMEA) methodology:
          </P>
          <Formula>{`RPN = Severity (S) × Probability (P) × Detectability (D)`}</Formula>
          <P>
            Each factor is rated 1-10. In this implementation:
          </P>
          <NumberedList items={[
            'Severity is assigned by subsystem criticality (engine = 9, landing gear = 8, hydraulic = 7, electrical = 6, avionics = 5, ECS = 4), reflecting the potential safety and mission impact of each subsystem failure.',
            'Probability is derived from health score degradation: P = ceil((100 − H) / 100 × 10). A health score of 60% gives P = ceil(4) = 4.',
            'Detectability is inversely scaled with health score (low health = easier to detect = lower D score), ranging from 3 (clearly detectable) to 7 (subtle).',
          ]} />
          <P>
            RPN thresholds: Critical ≥ 600 / High 300-599 / Medium 100-299 / Low &lt;100.
            These thresholds are illustrative; real FMEA programmes calibrate thresholds
            against historical failure consequence data.
          </P>
        </SubSection>

      </ReportSection>

      <ReportSection number="6" title="Results and Engineering Interpretation">
        <P>
          The following table summarises the engineered outputs for the simulated fleet.
          Each value carries an engineering interpretation -- the number alone is not the result;
          the conclusion drawn from it is.
        </P>

        <div style={{ overflowX: 'auto', marginTop: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1a2235' }}>
                {['Parameter', 'Typical Value', 'Engineering Interpretation'].map(h => (
                  <th key={h} style={{
                    padding: '8px 12px', textAlign: 'left',
                    fontFamily: 'var(--font-data)', fontSize: 8, letterSpacing: '0.14em',
                    color: '#374561', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Engine Health 86%', 'Nominal / Low risk',
                  'Within normal operating range. Vibration (VSI 2.1) approaching ISO 10816 warning boundary -- trend monitoring warranted but no immediate action.'],
                ['Engine RUL 9,451 hrs', 'Stress-adjusted ~3.5 years at 2,700 hrs/yr',
                  'Adequate remaining life, but stress factor of 1.095 indicates 9.5% faster aging than nominal. If stress factor increases to 1.3, RUL shortens to approximately 5,600 hrs.'],
                ['MTBF 2,840 hrs (N=5)', 'Order-of-magnitude estimate only',
                  'Based on 5 failure events. 90% confidence interval is approximately 1,200 to 8,500 hrs. Do not use for safety-critical planning without a larger failure dataset.'],
                ['100-hr Mission Reliability 96.5%', 'Acceptable for short-haul operations',
                  'This value is optimistic: the exponential model assumes constant failure rate. If the aircraft is in the wear-out phase, actual reliability will be lower. High-hour aircraft should be modelled with Weibull β > 1.'],
                ['FMEA RPN 90 (Engine)', 'LOW priority',
                  'Despite the LOW classification, the contributing factors (elevated vibration trend, declining oil pressure) are leading indicators. RPN should be re-evaluated after each 25-flight-hour block.'],
                ['Fatigue 19.4% (Landing Gear)', '30,288 cycles remaining',
                  'Well within life. Mandatory structural inspection required at 80% (40,000 cycles). Current trajectory reaches 80% in approximately 7 years at current cycle rate.'],
              ].map(([param, value, interp], i) => (
                <tr key={i} style={{ borderBottom: '1px solid #0d1520' }}>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-data)', fontSize: 11, color: '#22d3ee', verticalAlign: 'top' }}>{param}</td>
                  <td style={{ padding: '10px 12px', fontFamily: 'var(--font-data)', fontSize: 10, color: '#94a3b8', verticalAlign: 'top', whiteSpace: 'nowrap' }}>{value}</td>
                  <td style={{ padding: '10px 12px', fontSize: 11, color: '#4a5a7a', lineHeight: 1.6, verticalAlign: 'top' }}>{interp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ReportSection>

      <ReportSection number="7" title="Model Validation and Sanity Checks">
        <P>
          Before trusting any engineering calculation, the outputs must be checked for physical
          plausibility. The following sanity checks were applied:
        </P>
        <NumberedList items={[
          'Health score bounds check: all scores confirmed in range [0, 100]. A score at the boundary (0 or 100) triggers a code review to confirm the sensor input is within physical bounds.',
          'RUL sign check: stress-adjusted effective age is always positive; RUL is clamped to zero (cannot be negative). An aircraft with effective age exceeding rated life shows RUL = 0, prompting immediate review.',
          'Reliability function range check: R(t) is confirmed in range (0, 1] for all t ≥ 0. R(0) = 1 (certainty of survival at mission start). R(∞) → 0. Both confirmed.',
          'MTBF dimensional check: Total_Hours / Failures = hours/failure. Failure rate λ = 1/MTBF = failures/hour. R(t) = e^(−λt) is dimensionless (hours × hours^-1 = unitless). Unit analysis confirmed correct.',
          'RPN range check: minimum RPN = 1×1×1 = 1, maximum = 10×10×10 = 1000. All generated RPNs confirmed within [1, 1000].',
          'Stress factor physical check: SF = 1.0 at nominal sensor scores (T_score = V_score = 100). Confirmed: at full scores, (1+0) + (1+0) / 2 = 1.0. Correct.',
        ]} />
        <P>
          A formal unit test suite (18 tests) is included in the codebase and runs live in the browser
          on the Validation page. All 18 tests pass.
        </P>
      </ReportSection>

      <ReportSection number="8" title="Limitations">
        <P>
          This section documents the known limitations of the system with engineering justification
          for each. Understanding a model's limitations is as important as understanding its capabilities.
        </P>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
          {[
            {
              id: 'L1',
              title: 'No real sensor data',
              detail: 'All telemetry is generated by a stochastic simulation. The system demonstrates the calculation pipeline correctly, but the specific health scores and RUL values are not meaningful for any real aircraft. Validation against real flight data would be required before any operational use.',
            },
            {
              id: 'L2',
              title: 'Exponential reliability model (constant failure rate)',
              detail: 'The exponential model is the simplest tractable reliability model and is appropriate only during the useful-life phase of the bathtub curve. For components approaching end-of-life, a Weibull model with increasing failure rate (β > 1) is required. This system will underestimate failure probability for high-hour components. Quantifying this error requires historical failure data.',
            },
            {
              id: 'L3',
              title: 'Linear health score interpolation',
              detail: 'Real component degradation is often nonlinear. A bearing, for example, may show slow gradual degradation followed by rapid deterioration near failure -- an S-curve rather than a line. The linear model used here will give too-optimistic scores in the rapid-deterioration phase.',
            },
            {
              id: 'L4',
              title: 'Rule-based recommendations only',
              detail: 'Maintenance recommendations are generated by threshold-crossing logic (if VSI > 2.5 and oil pressure < 50 PSI, then...). This approach is transparent and auditable but cannot detect novel failure modes or cross-subsystem interactions that a trained machine learning model might identify. It also requires manual rule authoring for each failure mode.',
            },
            {
              id: 'L5',
              title: 'MTBF statistical uncertainty',
              detail: 'MTBF estimates derived from small failure counts carry wide confidence intervals. With N=5 failures, the 90% CI on MTBF spans approximately a factor of 3-5x. For AC-107 with zero failures, the MTBF is estimated as 10× flight hours -- a placeholder, not a statistically meaningful value. A minimum of 30-50 failure events is typically required for a useful MTBF estimate.',
            },
            {
              id: 'L6',
              title: 'No multi-sensor fusion',
              detail: 'Each sensor feeds exactly one subsystem. Real PHM systems use cross-subsystem sensor fusion -- for example, an engine bearing failure will produce correlated signatures in vibration, oil temperature, oil particle count, and fuel flow simultaneously. Fusing multiple correlated signals produces a far more reliable fault detection result than any single sensor.',
            },
          ].map(l => (
            <div key={l.id} style={{
              display: 'grid', gridTemplateColumns: '36px 1fr',
              gap: 12, background: '#0b1018', border: '1px solid #1a2235',
              padding: '12px 16px',
            }}>
              <div style={{
                fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 700,
                color: '#f43f5e', alignSelf: 'start', paddingTop: 1,
              }}>{l.id}</div>
              <div>
                <div style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#c8d5e8', marginBottom: 4 }}>{l.title}</div>
                <div style={{ fontSize: 12, color: '#4a5a7a', lineHeight: 1.7 }}>{l.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection number="9" title="Recommendations for Production Implementation">
        <P>
          The following changes would be required to transition this proof-of-concept toward an
          operationally credible system. These are listed in priority order based on impact:
        </P>
        <NumberedList items={[
          'Replace simulated data with certified sensor data acquisition. ACARS or FOQA data streams provide validated flight parameter data. ADS-B provides position and flight hours. Integration with avionics health monitoring systems (AHMS) would provide direct subsystem telemetry.',
          'Replace the exponential reliability model with Weibull analysis calibrated on fleet failure history. The Weibull shape parameter β and scale parameter η must be estimated from at least 30-50 failure events per component type.',
          'Implement a physics-of-failure degradation model for the engine (Arrhenius for thermal effects, Palmgren-Miner for cycle fatigue) to replace the empirical stress factor.',
          'Add multi-sensor fusion using Kalman filtering or particle filtering for RUL estimation. These techniques propagate uncertainty explicitly, providing a RUL probability distribution rather than a point estimate.',
          'Replace rule-based recommendation logic with a trained classifier (Random Forest or LSTM) validated against labelled fault data. Rules should be retained as an explainability layer alongside the model.',
          'Achieve compliance with FAA AC 120-66B (Aviation Safety Action Program) and EASA Part-M Subpart I for any operational maintenance data system. This requires data integrity validation, audit trails, and airworthiness authority approval.',
        ]} />
      </ReportSection>

      <ReportSection number="10" title="Conclusions">
        <P>
          This proof-of-concept demonstrates that the core engineering models underpinning aircraft
          predictive maintenance -- health scoring, RUL estimation, exponential reliability, and FMEA
          risk prioritisation -- can be implemented in a transparent, auditable software system
          where every output is traceable to its input data and calculation method.
        </P>
        <P>
          The principal engineering value of this work is not the specific numbers produced -- which
          are based on simulated data -- but the demonstration that these models can be connected
          into a coherent calculation chain: sensor reading to health score to RUL to risk ranking
          to maintenance recommendation. This chain is the conceptual architecture of any real
          PHM system, whether implemented in MATLAB, Python, or a web application.
        </P>
        <P>
          The most significant gap between this system and a production PHM system is validated
          data. Every model in this system is correct in structure; none of them are validated
          in magnitude. Bridging that gap requires access to certified fleet sensor data,
          historical failure records, and the computational infrastructure to process them in real time.
        </P>
        <Callout type="finding">
          An engineer who understands why these limitations exist -- not just that they exist --
          is prepared to address them. The goal of this project is to demonstrate that understanding.
        </Callout>
      </ReportSection>

      {/* Footer */}
      <div style={{
        marginTop: 60, paddingTop: 20, borderTop: '1px solid #1a2235',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', letterSpacing: '0.1em' }}>
          SKYPULSE AI / ENGINEERING REPORT / REV A / JUNE 2026
        </div>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
          EDUCATIONAL PROOF-OF-CONCEPT — NOT FOR OPERATIONAL USE
        </div>
      </div>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────── */

function ReportSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 20, paddingBottom: 10, borderBottom: '1px solid #1a2235' }}>
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 13, fontWeight: 700, color: '#e8a020', flexShrink: 0 }}>
          {number}.
        </span>
        <h2 style={{ fontFamily: 'var(--font-data)', fontSize: 14, fontWeight: 700, color: '#e2eaf5', margin: 0, letterSpacing: '0.04em' }}>
          {title.toUpperCase()}
        </h2>
      </div>
      <div style={{ paddingLeft: 0 }}>{children}</div>
    </section>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{
        fontFamily: 'var(--font-data)', fontSize: 11, fontWeight: 600,
        color: '#22d3ee', margin: '0 0 10px', letterSpacing: '0.06em',
      }}>{title}</h3>
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 13, color: '#6b7fa3', lineHeight: 1.85, margin: '0 0 14px' }}>
      {children}
    </p>
  );
}

function Formula({ children }: { children: string }) {
  return (
    <div style={{
      background: '#060810', border: '1px solid #1a2235',
      padding: '12px 16px', margin: '12px 0',
      fontFamily: 'var(--font-data)', fontSize: 12, color: '#22d3ee',
      whiteSpace: 'pre', overflowX: 'auto', lineHeight: 1.8,
    }}>
      {children}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '12px 0' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <span style={{
            fontFamily: 'var(--font-data)', fontSize: 10, color: '#e8a020',
            flexShrink: 0, marginTop: 3, minWidth: 18,
          }}>{i + 1}.</span>
          <span style={{ fontSize: 13, color: '#6b7fa3', lineHeight: 1.75 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

function Callout({ type, children }: { type: 'finding' | 'warning'; children: React.ReactNode }) {
  const isWarning = type === 'warning';
  return (
    <div style={{
      border: `1px solid ${isWarning ? 'rgba(250,204,21,0.25)' : 'rgba(34,211,238,0.2)'}`,
      background: isWarning ? 'rgba(250,204,21,0.04)' : 'rgba(34,211,238,0.04)',
      padding: '12px 16px', margin: '16px 0',
      display: 'flex', gap: 12,
    }}>
      <span style={{
        fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.14em',
        color: isWarning ? '#facc15' : '#22d3ee',
        flexShrink: 0, marginTop: 2,
      }}>
        {isWarning ? '⚠ NOTE' : '► FINDING'}
      </span>
      <span style={{ fontSize: 12, color: '#6b7fa3', lineHeight: 1.75 }}>{children}</span>
    </div>
  );
}

function AssumptionTable({ assumptions }: {
  assumptions: { id: string; assumption: string; justification: string; impact: string }[]
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, margin: '16px 0', border: '1px solid #1a2235' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr',
        padding: '8px 14px', background: '#060810',
        borderBottom: '1px solid #1a2235',
        fontFamily: 'var(--font-data)', fontSize: 8, letterSpacing: '0.14em', color: '#374561', textTransform: 'uppercase',
      }}>
        {['ID', 'Assumption', 'Justification', 'Impact if Wrong'].map(h => <span key={h}>{h}</span>)}
      </div>
      {assumptions.map((a, i) => (
        <div key={a.id} style={{
          display: 'grid', gridTemplateColumns: '36px 1fr 1fr 1fr',
          padding: '10px 14px', gap: 12,
          borderBottom: i < assumptions.length - 1 ? '1px solid #0d1520' : 'none',
          background: i % 2 === 0 ? '#0b1018' : 'transparent',
        }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 10, fontWeight: 700, color: '#e8a020', alignSelf: 'start' }}>{a.id}</span>
          <span style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.6, alignSelf: 'start' }}>{a.assumption}</span>
          <span style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.6, alignSelf: 'start' }}>{a.justification}</span>
          <span style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.6, alignSelf: 'start' }}>{a.impact}</span>
        </div>
      ))}
    </div>
  );
}
