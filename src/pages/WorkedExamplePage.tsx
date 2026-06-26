import { Calculator } from 'lucide-react';

function SectionLabel({ children }: { children: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, marginTop: 32 }}>
      <div style={{ width: 2, height: 12, background: '#e8a020' }} />
      <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.18em', color: '#e8a020', textTransform: 'uppercase' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--border-dim)' }} />
    </div>
  );
}

interface StepProps {
  step: string;
  formula?: string;
  result: string;
}

function CalcStep({ step, formula, result }: StepProps) {
  return (
    <div style={{
      borderLeft: '2px solid #1a2235',
      paddingLeft: 16,
      paddingTop: 6,
      paddingBottom: 6,
      marginBottom: 4,
    }}>
      <p style={{ fontSize: 12, color: '#6b7fa3', lineHeight: 1.6, margin: '0 0 6px' }}>{step}</p>
      {formula && (
        <div style={{
          background: 'var(--bg-inset)',
          border: '1px solid var(--border-dim)',
          padding: '8px 14px',
          fontFamily: 'var(--font-data)',
          fontSize: 12,
          color: '#22d3ee',
          margin: '6px 0',
          whiteSpace: 'pre',
          overflowX: 'auto',
          lineHeight: 1.7,
        }}>{formula}</div>
      )}
      <p style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: '#22c55e', margin: 0, letterSpacing: '0.06em' }}>
        RESULT: {result}
      </p>
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
          WORKED ENGINEERING EXAMPLES
        </h1>
        <p style={{ fontSize: 12, color: '#374561', marginTop: 4, maxWidth: 600 }}>
          Full derivations for Aircraft AC-102. Every formula used in the system demonstrated step-by-step.
        </p>
      </div>

      {/* Input state */}
      <div className="panel" style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, #22d3ee, transparent 70%)' }} />
        <div style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.16em', color: '#22d3ee', marginBottom: 14 }}>
          AIRCRAFT AC-102 / N7734W / AIRBUS A320-200 — INPUT STATE
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 10 }}>
          {[
            ['FH', '14,200 hrs'],
            ['CYCLES', '9,800'],
            ['ENG TEMP', '720 C'],
            ['VIBRATION', '4.2 mm/s'],
            ['OIL PRESS', '51 PSI'],
            ['HYD PRESS', '2,650 PSI'],
            ['BAT VOLT', '26.5 V'],
            ['GEN VOLT', '113.2 V AC'],
            ['AV TEMP', '57 C'],
            ['LG CYCLES', '9,712'],
            ['FAILURES', '5'],
            ['ENGINE LIFE', '25,000 hrs'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg-inset)', padding: '8px 12px' }}>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.14em', marginBottom: 3 }}>{k}</div>
              <div style={{ fontFamily: 'var(--font-data)', fontSize: 13, color: '#e2eaf5' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ex 1: Engine Health */}
      <SectionLabel>Example 1 — Engine Health Score</SectionLabel>
      <div style={{ fontFamily: 'var(--font-data)', fontSize: 10, color: '#4a5a7a', marginBottom: 12, letterSpacing: '0.06em' }}>
        FORMULA: H_engine = 0.30·T + 0.30·V + 0.20·P + 0.20·U
      </div>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CalcStep
            step="Temperature score. Engine temp = 720 C. Range: nominal=650, warning=750, critical=850. Value is between nominal and warning."
            formula={`Score = 80 + ((750 − 720) / (750 − 650)) × 20\n      = 80 + (30/100) × 20\n      = 80 + 6 = 86`}
            result="T_score = 86"
          />
          <CalcStep
            step="Vibration score. Vibration = 4.2 mm/s. Range: nominal=2.0, warning=5.0, critical=10.0."
            formula={`Score = 80 + ((5.0 − 4.2) / (5.0 − 2.0)) × 20\n      = 80 + (0.8/3.0) × 20\n      = 80 + 5.3 = 85.3`}
            result="V_score = 85"
          />
          <CalcStep
            step="Oil pressure score. Oil = 51 PSI. Higher is better. Range: nominal=60, warning=45, critical=30."
            formula={`Score = 80 + ((51 − 45) / (60 − 45)) × 20\n      = 80 + (6/15) × 20\n      = 80 + 8 = 88`}
            result="P_score = 88"
          />
          <CalcStep
            step="Usage score. Hours = 14,200. Rated life = 25,000 hrs. Fraction = 0.568 (56.8% consumed, in 0-75% range)."
            formula={`Fraction = 14200 / 25000 = 0.568\nScore = 80 + 20 × (0.75 − 0.568) / 0.75 = 80 + 4.9 = 84.9`}
            result="U_score = 85"
          />
          <CalcStep
            step="Final weighted engine health score."
            formula={`H_engine = 0.30(86) + 0.30(85) + 0.20(88) + 0.20(85)\n        = 25.8 + 25.5 + 17.6 + 17.0\n        = 85.9`}
            result="Engine Health = 86%"
          />
        </div>
      </div>

      {/* Ex 2: RUL */}
      <SectionLabel>Example 2 — Stress Factor and Remaining Useful Life</SectionLabel>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CalcStep
            step="Temperature stress factor. T_score = 86 (normalized: 0.86)."
            formula={`T_factor = 1.0 + (1 − 0.86) × 0.5 = 1.0 + 0.07 = 1.07`}
            result="T_factor = 1.07"
          />
          <CalcStep
            step="Vibration stress factor. V_score = 85 (normalized: 0.85)."
            formula={`V_factor = 1.0 + (1 − 0.85) × 0.8 = 1.0 + 0.12 = 1.12`}
            result="V_factor = 1.12"
          />
          <CalcStep
            step="Combined stress factor — average of both contributions."
            formula={`SF = (1.07 + 1.12) / 2 = 2.19 / 2 = 1.095`}
            result="Stress Factor = 1.095 (9.5% faster aging than nominal)"
          />
          <CalcStep
            step="Effective age and RUL. Engine rated life = 25,000 hrs."
            formula={`Effective_Age = 14,200 × 1.095 = 15,549 hrs\nRUL          = 25,000 − 15,549 = 9,451 hrs`}
            result="Engine RUL = 9,451 flight hours"
          />
        </div>
      </div>

      {/* Ex 3: VSI */}
      <SectionLabel>Example 3 — Vibration Severity Index</SectionLabel>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CalcStep
            step="Vibration = 4.2 mm/s. Nominal reference = 2.0 mm/s."
            formula={`VSI = 4.2 / 2.0 = 2.10`}
            result="VSI = 2.10 — approaching ISO 10816 warning threshold (2.5)"
          />
          <div style={{
            background: 'var(--bg-inset)', border: '1px solid var(--border-dim)',
            padding: '10px 14px', marginTop: 8,
            fontFamily: 'var(--font-data)', fontSize: 9, color: '#4a5a7a', lineHeight: 1.8,
          }}>
            ISO 10816 SEVERITY ZONES: 1.0-1.8 Good / 1.8-2.8 Acceptable /
            2.8-4.5 Unsatisfactory / &gt;4.5 Unacceptable
            {'\n'}AT VSI = 2.10: Acceptable zone. Monitor trend. Reassess at VSI 2.5.
          </div>
        </div>
      </div>

      {/* Ex 4: MTBF */}
      <SectionLabel>Example 4 — MTBF and Mission Reliability</SectionLabel>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CalcStep
            step="Mean Time Between Failures. 14,200 flight hours, 5 recorded failures."
            formula={`MTBF = 14,200 / 5 = 2,840 hrs`}
            result="MTBF = 2,840 hrs"
          />
          <CalcStep
            step="Failure rate lambda (failures per flight hour)."
            formula={`λ = 1 / MTBF = 1 / 2,840 = 3.52 × 10⁻⁴ failures/hr`}
            result="λ = 0.000352 / hr"
          />
          <CalcStep
            step="100-hour mission reliability. R(t) = e^(−λt)."
            formula={`R(100) = e^(−0.000352 × 100)\n       = e^(−0.0352)\n       = 0.9654`}
            result="100-hr Mission Reliability = 96.5%"
          />
        </div>
      </div>

      {/* Ex 5: RPN */}
      <SectionLabel>Example 5 — FMEA Risk Priority Number</SectionLabel>
      <p style={{ fontSize: 12, color: '#4a5a7a', marginBottom: 12 }}>
        Failure mode: Engine bearing wear on AC-102.
      </p>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CalcStep step="Severity. Engine failure is safety-critical. Assign S = 9 (catastrophic potential)." result="S = 9" />
          <CalcStep
            step="Probability. Engine health = 86%. Degradation = 14%."
            formula={`P = ceil((100 − 86) / 100 × 10) = ceil(1.4) = 2`}
            result="P = 2"
          />
          <CalcStep step="Detectability. Health at 86%: degradation is moderately detectable. Assign D = 5." result="D = 5" />
          <CalcStep
            step="Risk Priority Number."
            formula={`RPN = S × P × D = 9 × 2 × 5 = 90`}
            result="RPN = 90 — LOW risk (threshold: < 100)"
          />
        </div>
      </div>

      {/* Ex 6: Fatigue */}
      <SectionLabel>Example 6 — Landing Gear Fatigue Consumed</SectionLabel>
      <div className="panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <CalcStep
            step="Landing gear actual cycles = 9,712. Rated cycles = 50,000."
            formula={`Fatigue_% = (9,712 / 50,000) × 100 = 19.4%`}
            result="19.4% fatigue life consumed — within service life"
          />
          <div style={{
            background: 'var(--bg-inset)', border: '1px solid var(--border-dim)',
            padding: '10px 14px', marginTop: 8,
            fontFamily: 'var(--font-data)', fontSize: 9, color: '#4a5a7a', lineHeight: 1.8,
          }}>
            REMAINING: ~40,288 cycles (~30,216 hrs at 0.75 hr/cycle avg)
            {'\n'}MANDATORY INSPECTION TRIGGER: 80% = 40,000 cycles
          </div>
        </div>
      </div>

      {/* Summary table */}
      <SectionLabel>Summary — AC-102 Engineering Results</SectionLabel>
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 2fr',
          padding: '8px 18px', borderBottom: '1px solid var(--border-dim)',
          fontFamily: 'var(--font-data)', fontSize: 8, letterSpacing: '0.14em', color: '#374561', textTransform: 'uppercase',
        }}>
          {['Parameter', 'Value', 'Interpretation'].map(h => <span key={h}>{h}</span>)}
        </div>
        {[
          ['Engine Health Score', '86%', 'Good — within normal range'],
          ['Vibration Severity Index', '2.10', 'Acceptable — monitor trend'],
          ['Stress Factor', '1.095', '9.5% faster aging than nominal conditions'],
          ['Effective Age', '15,549 hrs', 'Equivalent nominal-condition hours'],
          ['Engine RUL', '9,451 hrs', 'Remaining service hours (stress-adjusted)'],
          ['MTBF', '2,840 hrs', 'Moderate reliability history (5 failures)'],
          ['100-hr Mission Reliability', '96.5%', 'Good for near-term mission planning'],
          ['Engine RPN', '90', 'LOW — continue monitoring, no immediate action'],
          ['Landing Gear Fatigue', '19.4%', 'Well within service life'],
        ].map(([p, v, i], idx, arr) => (
          <div key={p} style={{
            display: 'grid', gridTemplateColumns: '2fr 1fr 2fr',
            padding: '9px 18px',
            borderBottom: idx < arr.length - 1 ? '1px solid var(--border-dim)' : 'none',
          }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{p}</span>
            <span style={{ fontFamily: 'var(--font-data)', fontSize: 12, color: '#22d3ee' }}>{v}</span>
            <span style={{ fontSize: 11, color: '#4a5a7a' }}>{i}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
