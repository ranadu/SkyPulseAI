import { Calculator } from 'lucide-react';

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: 36 }}>
      <div style={{ width: 2, height: 12, background: '#e8a020' }} />
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em', color: '#e8a020', textTransform: 'uppercase' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border-dim)' }} />
    </div>
  );
}

function CalcStep({ step, formula, result, judgment }: {
  step: string; formula?: string; result: string; judgment?: string;
}) {
  return (
    <div style={{ borderLeft: '2px solid #1a2235', paddingLeft: 16, paddingTop: 6, paddingBottom: 8, marginBottom: 6 }}>
      <p style={{ fontSize: 12, color: '#6b7fa3', lineHeight: 1.7, margin: '0 0 6px' }}>{step}</p>
      {formula && (
        <div style={{
          background: 'var(--bg-inset)', border: '1px solid var(--border-dim)',
          padding: '8px 14px', fontFamily: 'var(--font-data)', fontSize: 12, color: '#22d3ee',
          margin: '6px 0', whiteSpace: 'pre', overflowX: 'auto', lineHeight: 1.7,
        }}>{formula}</div>
      )}
      <p style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#22c55e', margin: '4px 0 0', letterSpacing: '0.06em' }}>
        RESULT: {result}
      </p>
      {judgment && (
        <div style={{
          display: 'flex', gap: 8, marginTop: 8,
          borderTop: '1px solid rgba(232,160,32,0.15)', paddingTop: 8,
        }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#e8a020', flexShrink: 0, paddingTop: 1, letterSpacing: '0.1em' }}>
            ► ENG JUDGMENT
          </span>
          <p style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.65, margin: 0 }}>{judgment}</p>
        </div>
      )}
    </div>
  );
}

function EngineerNote({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      border: '1px solid rgba(34,211,238,0.15)', background: 'rgba(34,211,238,0.03)',
      padding: '12px 16px', margin: '12px 0 0',
      fontFamily: 'var(--font-data)', fontSize: 9, color: '#4a5a7a',
      lineHeight: 1.9, letterSpacing: '0.04em',
    }}>
      {children}
    </div>
  );
}

export default function WorkedExamplePage() {
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Calculator size={13} style={{ color: '#e8a020' }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.2em', color: '#e8a020' }}>
            HAND CALCULATIONS
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 700, color: '#e2eaf5', margin: 0 }}>
          WORKED ENGINEERING EXAMPLES — AC-102
        </h1>
        <p style={{ fontSize: 12, color: '#374561', marginTop: 6, maxWidth: 700, lineHeight: 1.7 }}>
          These are not textbook walkthrough steps. They are the calculations I would submit in an engineering analysis —
          where the number matters, but the engineering judgment about what the number means matters more.
          Every result includes an explicit interpretation and a note on where the model assumption could bite you.
        </p>
      </div>

      {/* Input state */}
      <div className="panel" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, #22d3ee, transparent 70%)' }} />
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.16em', color: '#22d3ee', marginBottom: 14 }}>
          AIRCRAFT AC-102 / N7734W / AIRBUS A320-200 — SENSOR SNAPSHOT (SIMULATED)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10, marginBottom: 14 }}>
          {[
            ['FH', '14,200 hrs'],
            ['CYCLES', '9,800'],
            ['ENG TEMP', '720°C'],
            ['VIBRATION', '4.2 mm/s'],
            ['OIL PRESS', '51 PSI'],
            ['HYD PRESS', '2,650 PSI'],
            ['BAT VOLT', '26.5 V'],
            ['GEN VOLT', '113.2 V AC'],
            ['AV TEMP', '57°C'],
            ['LG CYCLES', '9,712'],
            ['FAILURES', '5 recorded'],
            ['ENGINE LIFE', '25,000 hrs (OEM)'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg-inset)', padding: '8px 12px' }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.14em', marginBottom: 3 }}>{k}</div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 13, color: '#e2eaf5' }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', lineHeight: 1.7 }}>
          Note: AC-102 is a mid-life aircraft (14,200 hrs, ~57% of engine rated life consumed) in a degraded scenario.
          The interesting engineering case here is not the final health score of 86% — it is the combination of
          elevated vibration (4.2 mm/s, approaching the warning threshold) with declining oil pressure (51 PSI, 6 PSI above warning limit).
          These two parameters together are a more meaningful signal than either alone.
        </div>
      </div>

      {/* Ex 1: Engine Health */}
      <SectionLabel>Example 1 — Engine Health Score</SectionLabel>
      <p style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 14, lineHeight: 1.7 }}>
        The health score is a weighted composite of four sensor scores. The goal is to
        map each raw sensor reading onto a 0–100 scale, then aggregate with weights that
        reflect engineering judgment about which sensor is most diagnostically significant
        for engine health.
      </p>
      <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561', marginBottom: 12, letterSpacing: '0.06em' }}>
        H_engine = 0.30·T + 0.30·V + 0.20·P + 0.20·U &nbsp;|&nbsp;
        T = temperature, V = vibration, P = oil pressure, U = usage fraction
      </div>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <CalcStep
            step="Temperature score. Measured value 720°C sits in the nominal-to-warning band (650°C → 750°C). Linear interpolation within this band maps it to 80–100."
            formula={`T_score = 80 + ((750 − 720) / (750 − 650)) × 20
         = 80 + (30 / 100) × 20
         = 80 + 6.0 = 86`}
            result="T_score = 86"
            judgment="720°C is 30°C below the warning threshold. On a short-haul A320 cycle, exhaust gas temperatures typically peak during climb and cruise before recovering. A single reading at 720°C is not concerning; a trend of increasing EGT readings over multiple flights would be. I would want to see the EGT margin trend, not just the snapshot."
          />
          <CalcStep
            step="Vibration score. 4.2 mm/s is between nominal (2.0) and warning (5.0). Same interpolation method applies."
            formula={`V_score = 80 + ((5.0 − 4.2) / (5.0 − 2.0)) × 20
         = 80 + (0.8 / 3.0) × 20
         = 80 + 5.3 = 85.3 → 85`}
            result="V_score = 85"
            judgment="This is the reading I pay closest attention to. At 4.2 mm/s, the engine is 0.8 mm/s from the warning threshold. More importantly, the VSI (vibration severity index) is 2.10, which puts it in the ISO 10816 'acceptable' zone — but closer to the boundary than I would like. If this value were drifting upward over the last 5 flights, I would schedule a borescope inspection regardless of the score."
          />
          <CalcStep
            step="Oil pressure score. 51 PSI. Nominal is 60 PSI (higher is better), so the scoring direction is reversed — the score decreases as the value drops."
            formula={`P_score = 80 + ((51 − 45) / (60 − 45)) × 20
         = 80 + (6 / 15) × 20
         = 80 + 8.0 = 88`}
            result="P_score = 88"
            judgment="51 PSI looks acceptable in isolation — it scores 88%. But oil pressure is 9 PSI below nominal and only 6 PSI above the warning threshold of 45 PSI. In maintenance engineering, an oil pressure reading this close to the warning boundary, combined with elevated vibration, is a flag: bearing wear can simultaneously raise vibration and drop oil pressure. The individual scores look fine; the combination is a leading indicator worth noting."
          />
          <CalcStep
            step="Usage fraction score. 14,200 hrs consumed of 25,000 hrs rated life. Fraction = 0.568 (56.8%)."
            formula={`Fraction = 14,200 / 25,000 = 0.568
U_score  = 80 + 20 × (0.75 − 0.568) / 0.75
         = 80 + 20 × 0.243 = 80 + 4.9 = 84.9 → 85`}
            result="U_score = 85"
            judgment="This confirms mid-life status. At 56.8% of rated life consumed, the aircraft is past the early-life burn-in phase but well within its structural and engine TBO limits. Usage alone is not alarming. The stress-adjusted calculation in Example 2 is more informative."
          />
          <CalcStep
            step="Weighted composite."
            formula={`H_engine = 0.30(86) + 0.30(85) + 0.20(88) + 0.20(85)
         = 25.8 + 25.5 + 17.6 + 17.0
         = 85.9 → 86%`}
            result="Engine Health = 86%"
            judgment="86% classifies as nominal / low-risk by our thresholds. I would not dispute that classification for planning purposes. However, the combination of vibration at 85% and oil pressure at 88%, both approaching their warning thresholds, warrants closer monitoring. A composite score of 86% can mask the fact that two inputs are trending toward 80%. This is a model limitation: weighted averages can obscure correlated degradation."
          />
        </div>
      </div>

      {/* Ex 2: RUL */}
      <SectionLabel>Example 2 — Stress Factor and Remaining Useful Life</SectionLabel>
      <p style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 14, lineHeight: 1.7 }}>
        Calendar hours are not the same as equivalent damage hours. An engine running at elevated
        temperature and vibration accumulates fatigue faster than its rated conditions assume.
        The stress factor converts actual flight hours into an effective age that reflects this.
      </p>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <CalcStep
            step="Temperature contribution to stress. T_score = 86 → normalized to 0.86. High T_score (healthy temperature) means low stress contribution."
            formula={`T_factor = 1.0 + (1 − 0.86) × 0.5
         = 1.0 + 0.14 × 0.5
         = 1.0 + 0.07 = 1.07`}
            result="T_factor = 1.07 (7% thermal acceleration)"
            judgment="The 0.5 coefficient reflects that temperature effects on fatigue life follow an Arrhenius relationship — for every 10°C increase, reaction rates roughly double. This coefficient is illustrative; real values are calibrated to specific alloys and failure modes."
          />
          <CalcStep
            step="Vibration contribution to stress. V_score = 85 → 0.85. Higher coefficient (0.8) because vibration drives mechanical fatigue via Miner's rule more directly than temperature at sub-critical levels."
            formula={`V_factor = 1.0 + (1 − 0.85) × 0.8
         = 1.0 + 0.15 × 0.8
         = 1.0 + 0.12 = 1.12`}
            result="V_factor = 1.12 (12% vibration acceleration)"
          />
          <CalcStep
            step="Combined stress factor — average of both contributions."
            formula={`SF = (T_factor + V_factor) / 2
   = (1.07 + 1.12) / 2
   = 2.19 / 2 = 1.095`}
            result="Stress Factor = 1.095"
            judgment="A stress factor of 1.095 means AC-102 is aging approximately 9.5% faster than its nominal rated conditions assume. This is a mild but real effect. For planning purposes: if this aircraft flies 2,700 hours per year, it accumulates 2,957 equivalent hours per year under stress. The OEM's life limit of 25,000 hrs was written assuming nominal stress — we need to account for this."
          />
          <CalcStep
            step="Effective age and remaining useful life."
            formula={`Effective_Age = 14,200 × 1.095 = 15,549 hrs
RUL          = 25,000 − 15,549 = 9,451 hrs`}
            result="Engine RUL = 9,451 stress-adjusted flight hours"
            judgment="Without the stress correction, RUL = 25,000 − 14,200 = 10,800 hrs. The stress factor reduces this by 1,349 hrs — not a crisis, but meaningful over the remaining service life. At 9.5% acceleration and current utilisation of ~2,700 hrs/year, this means the engine approaches its life limit approximately 6 months earlier than the un-adjusted calculation would predict. Important uncertainty: this model treats all hours equally. Real engine life tracking uses cycle-weighted effective hours, not a single stress scalar."
          />
        </div>
      </div>

      {/* Ex 3: VSI */}
      <SectionLabel>Example 3 — Vibration Severity Index</SectionLabel>
      <p style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 14, lineHeight: 1.7 }}>
        The raw vibration score (85) is a relative metric that only makes sense within our
        health model. The Vibration Severity Index (VSI) is an absolute metric derived from
        ISO 10816, which is the international standard for evaluating machine vibration in non-rotating parts.
        It gives us an independent, physically-grounded reference point.
      </p>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <CalcStep
            step="VSI is the ratio of measured vibration to the nominal reference value (2.0 mm/s, chosen as the mid-point of ISO Zone A — 'Good' condition for large turbomachinery)."
            formula={`VSI = V_measured / V_nominal
    = 4.2 / 2.0
    = 2.10`}
            result="VSI = 2.10"
            judgment="VSI = 2.10 places AC-102 firmly in ISO 10816 Zone B ('Acceptable for unrestricted long-term operation'). It is not in Zone C ('Acceptable for short-term operation') yet, but the rate of change matters more than the point value. If VSI has increased from 1.8 to 2.1 over the last 300 flight hours, that is a 0.1 mm/s per 100 hour trend — and at that rate, Zone C (VSI 2.8) would be reached in approximately 700 flight hours. I would establish a vibration trend plot and define a specific intervention threshold before that point."
          />
          <EngineerNote>
            ISO 10816 SEVERITY ZONES (turbomachinery, rotating mass &gt;15 kW){'\n'}
            Zone A (New machine): VSI ≤ 1.8 — Good{'\n'}
            Zone B (Unrestricted long-term): 1.8 &lt; VSI ≤ 2.8 — Acceptable{'\n'}
            Zone C (Short-term only, investigate): 2.8 &lt; VSI ≤ 4.5 — Unsatisfactory{'\n'}
            Zone D (Immediate shutdown risk): VSI &gt; 4.5 — Unacceptable{'\n\n'}
            AC-102 STATUS: VSI 2.10 → Zone B. Acceptable. 0.70 margin to Zone C boundary.{'\n'}
            Recommended action: establish trend monitoring, schedule borescope at next C-check.
          </EngineerNote>
        </div>
      </div>

      {/* Ex 4: MTBF */}
      <SectionLabel>Example 4 — MTBF and Mission Reliability</SectionLabel>
      <p style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 14, lineHeight: 1.7 }}>
        MTBF is the most commonly misused metric in reliability engineering.
        The number itself is only as good as the failure history behind it.
        For AC-102, five recorded failures over 14,200 hours gives us a usable estimate —
        but the confidence interval is wide. I will show the calculation and then quantify
        exactly how much to trust it.
      </p>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <CalcStep
            step="Mean Time Between Failures. Simplest point estimate: divide total operating hours by number of failures."
            formula={`MTBF = Total_Operating_Hours / N_failures
     = 14,200 / 5
     = 2,840 hrs`}
            result="MTBF = 2,840 hrs"
            judgment="This is a point estimate. With only N=5 failures, the underlying chi-squared confidence interval on MTBF (at 90% confidence) spans roughly 1,200 to 8,500 hours — a factor of 7x range. The point estimate of 2,840 is our best guess, but it is not precise. This is normal for early fleet data. Real PHM programmes typically require 30-50 failure events before MTBF estimates are used for safety-critical planning."
          />
          <CalcStep
            step="Failure rate. The inverse of MTBF gives failures per flight hour (assuming constant rate — exponential model)."
            formula={`λ = 1 / MTBF
  = 1 / 2,840
  = 3.52 × 10⁻⁴ failures/hr`}
            result="λ = 0.000352 failures per flight hour"
            judgment="A failure rate of 3.52 × 10⁻⁴ / hr means that on average, over any 2,840-hour period, we expect one failure event. This is the constant-rate assumption of the exponential model — it treats every hour as equally risky. This is only valid during the 'useful life' phase of the bathtub curve. As the engine approaches its 25,000-hour life limit, the wear-out failure rate will increase, and this λ will be an underestimate."
          />
          <CalcStep
            step="100-hour mission reliability. The probability that the aircraft completes a 100-hour mission block without a failure."
            formula={`R(100) = e^(−λ · t)
       = e^(−0.000352 × 100)
       = e^(−0.0352)
       = 0.9654`}
            result="R(100) = 96.5% — 96.5% probability of completing 100-flight-hour block without failure"
            judgment="96.5% sounds excellent. It is — for this aircraft, at this life stage, under constant-failure-rate assumptions. The caveat: for the remaining ~9,451 hours of service life, this number will decline as wear-out effects increase the failure rate. If a Weibull model were calibrated with β=2.5 (typical engine wear-out), the 100-hr reliability at 22,000 hours would be substantially lower. The 96.5% figure is valid today; do not assume it holds through the end of the engine's life."
          />
        </div>
      </div>

      {/* Ex 5: RPN */}
      <SectionLabel>Example 5 — FMEA Risk Priority Number</SectionLabel>
      <p style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 14, lineHeight: 1.7 }}>
        FMEA RPN is a structured way to prioritise maintenance actions when you have multiple
        competing risks and limited maintenance windows. The RPN is not an absolute measure of risk
        — it is a relative ranking tool. The absolute values depend on how you assign the Severity,
        Probability, and Detectability scores.
      </p>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <CalcStep
            step="Severity (S). The engine subsystem is safety-critical — a failure in flight could be catastrophic. Maximum severity per standard FMEA tables for loss-of-thrust events."
            result="S = 9 (catastrophic safety impact)"
            judgment="Severity is fixed by subsystem type in this implementation. In a real FMEA, severity is assigned by failure mode, not subsystem — an engine fire has different severity than an oil chip detector alert, even though both are 'engine' events. The single severity value of 9 is conservative and appropriate for the worst-case failure mode."
          />
          <CalcStep
            step="Probability (P). Derived from current health score. Engine at 86% health means 14% degradation from nominal."
            formula={`P = ceil((100 − H_score) / 100 × 10)
  = ceil((100 − 86) / 100 × 10)
  = ceil(14 / 100 × 10)
  = ceil(1.4)
  = 2`}
            result="P = 2 (low probability of failure in near term)"
            judgment="A probability of 2/10 reflects that the engine is still in good health. This is where the FMEA method can give false comfort: P=2 is mathematically correct given an 86% health score, but it does not account for the trend. An engine at 86% health with worsening vibration and declining oil pressure has a higher near-term failure probability than an engine at 86% health with stable sensors. The RPN model treats the current snapshot, not the trajectory."
          />
          <CalcStep
            step="Detectability (D). At 86% health, the degradation is moderately visible in sensor data — not subtle, not yet alarming."
            result="D = 5 (moderate detectability — degradation visible but not obvious)"
          />
          <CalcStep
            step="Risk Priority Number."
            formula={`RPN = S × P × D
    = 9 × 2 × 5
    = 90`}
            result="RPN = 90 — LOW risk tier (threshold: Critical ≥600 / High 300–599 / Medium 100–299 / Low <100)"
            judgment="RPN = 90 classifies this as LOW priority. That is technically correct — the health score is good and the failure probability is low. But I would not use RPN alone to make this scheduling decision. The combination of elevated vibration (VSI 2.10, approaching Zone C) and declining oil pressure (51 PSI, 6 PSI above warning) represents a correlated degradation pattern that the RPN arithmetic doesn't capture. My recommendation: keep LOW classification for formal tracking, but flag for close monitoring and add to the next scheduled borescope inspection list."
          />
        </div>
      </div>

      {/* Ex 6: Fatigue */}
      <SectionLabel>Example 6 — Landing Gear Fatigue Life</SectionLabel>
      <p style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 14, lineHeight: 1.7 }}>
        Landing gear fatigue is cycle-counted, not hour-counted. Each takeoff and landing applies
        a specific load spectrum to the gear structure and actuators. The OEM specifies a design
        life in cycles based on the structural fatigue analysis and regulatory certification.
      </p>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <CalcStep
            step="Fatigue consumed. 9,712 actual landings out of a 50,000-cycle structural certification limit."
            formula={`Fatigue_consumed = (9,712 / 50,000) × 100 = 19.4%
Remaining_cycles = 50,000 − 9,712 = 40,288 cycles`}
            result="19.4% of fatigue life consumed — 40,288 cycles remaining"
            judgment="19.4% fatigue is genuinely low. At this aircraft's average cycle rate (9,800 cycles over ~8 years implies roughly 1,225 cycles/year), the structural life limit would not be reached for approximately 33 years — well beyond any realistic service life. The binding life limit for this aircraft is the engine (9,451 hours of RUL), not the structure. Landing gear fatigue is a non-issue here."
          />
          <EngineerNote>
            KEY REGULATORY THRESHOLDS (illustrative){'\n'}
            20% consumed → Scheduled first fatigue inspection per AMM{'\n'}
            50% consumed → Increased inspection frequency, NDT required at critical locations{'\n'}
            80% consumed → Mandatory structural inspection; operator must demonstrate fatigue clearance{'\n'}
            100% consumed → Life limit reached. Component must be retired or receive regulatory life extension approval{'\n\n'}
            AC-102 at 19.4%: next significant milestone is the 20% inspection threshold — approximately 144 cycles away at current rate.
          </EngineerNote>
        </div>
      </div>

      {/* Overall assessment */}
      <SectionLabel>Engineering Assessment — AC-102</SectionLabel>
      <div style={{
        border: '1px solid rgba(34,211,238,0.2)', background: 'rgba(34,211,238,0.03)',
        padding: '16px 20px', marginBottom: 24,
        fontSize: 12, color: '#6b7fa3', lineHeight: 1.85,
      }}>
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#22d3ee', marginBottom: 10, letterSpacing: '0.1em' }}>
          OVERALL ENGINEERING JUDGMENT
        </div>
        The headline number — Engine Health 86% — places AC-102 in the LOW risk category,
        and that classification is defensible. The aircraft is mid-life, the reliability is good,
        and fatigue life is plentiful.
        <br /><br />
        What the headline does not show is the combination of two parameters, both healthy but
        both trending toward their warning thresholds: engine vibration at VSI 2.10 (Zone B, boundary
        at 2.8) and oil pressure at 51 PSI (6 PSI above the warning threshold of 45 PSI). In isolation,
        each is acceptable. Together, they are consistent with early bearing wear — a failure mode
        where vibration increases and oil pressure decreases simultaneously as the bearing surface
        degrades and oil flow partially bypasses through the worn clearance.
        <br /><br />
        This is the kind of pattern a health score can miss because the weighted average is dragged
        upward by the healthy sensors. My recommendation would be: maintain LOW classification for
        formal scheduling, but flag for borescope inspection at the next opportunity and establish
        a trend plot for both vibration and oil pressure. If either crosses its warning threshold
        before the next scheduled inspection, escalate immediately.
        <br /><br />
        <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#e8a020', letterSpacing: '0.1em' }}>
          PRIMARY LIFE LIMIT: Engine RUL = 9,451 hrs (stress-adjusted) — binding constraint.{'\n'}
          MONITOR CLOSELY: Vibration (VSI 2.10) + Oil Pressure (51 PSI) — correlated degradation pattern.{'\n'}
          NOT CONCERNING: Landing gear (19.4% fatigue), electrical, hydraulic — all nominal.
        </span>
      </div>

      {/* Summary table */}
      <SectionLabel>Summary — AC-102 Engineering Results</SectionLabel>
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 2fr',
          padding: '8px 18px', borderBottom: '1px solid var(--border-dim)',
          fontFamily: 'var(--font-data)', fontSize: 8, letterSpacing: '0.14em', color: '#374561', textTransform: 'uppercase',
        }}>
          {['Parameter', 'Value', 'Engineering Interpretation'].map(h => <span key={h}>{h}</span>)}
        </div>
        {[
          ['Engine Health Score', '86%', 'Nominal — LOW risk tier. Masks correlated vibration + oil pressure degradation.'],
          ['Vibration Severity Index', '2.10', 'ISO Zone B (Acceptable). 0.70 margin to Zone C. Trend monitoring warranted.'],
          ['Stress Factor', '1.095', 'Engine aging 9.5% faster than nominal. Valid; driven by above-nominal vibration.'],
          ['Effective Age', '15,549 hrs', 'Equivalent nominal-condition hours. Used for RUL, not FH, in life planning.'],
          ['Engine RUL', '9,451 hrs', 'Primary life constraint. ~3.5 years at 2,700 hrs/yr. Stress-adjusted.'],
          ['MTBF', '2,840 hrs', 'Based on 5 failures. 90% CI: ~1,200–8,500 hrs. Order-of-magnitude only.'],
          ['100-hr Mission Reliability', '96.5%', 'Good. Valid under constant-failure-rate assumption (useful-life phase only).'],
          ['Engine FMEA RPN', '90 (LOW)', 'Correct classification. Does not capture correlated vibration+oil trend. Monitor.'],
          ['Landing Gear Fatigue', '19.4%', 'Non-binding. Structural life limit will not be reached before engine life limit.'],
        ].map(([p, v, i], idx, arr) => (
          <div key={p} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 2fr',
            padding: '9px 18px',
            borderBottom: idx < arr.length - 1 ? '1px solid var(--border-dim)' : 'none',
            alignItems: 'start',
          }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{p}</span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: '#22d3ee' }}>{v}</span>
            <span style={{ fontSize: 11, color: '#4a5a7a', lineHeight: 1.6 }}>{i}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
