import { useEffect, useState } from 'react';
import { FlaskConical } from 'lucide-react';
import { runAllTests } from '../calculations/__tests__/calculations.test';

export default function ValidationPage() {
  const [results, setResults] = useState<{ passed: number; failed: number; results: string[] } | null>(null);

  useEffect(() => { setResults(runAllTests()); }, []);

  if (!results) return null;

  const allPass = results.failed === 0;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px' }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <FlaskConical size={13} style={{ color: '#e8a020' }} />
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.2em', color: '#e8a020' }}>
            CALCULATION VALIDATION
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-data)', fontSize: 22, fontWeight: 700, color: '#e2eaf5', margin: 0 }}>
          UNIT TESTS
        </h1>
        <p style={{ fontSize: 12, color: '#374561', marginTop: 4 }}>
          Running live in the browser. Tests all engineering calculation modules.
        </p>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <div className="panel" style={{ padding: '14px 18px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, #22c55e, transparent)' }} />
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.16em', marginBottom: 4 }}>PASSED</div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 28, fontWeight: 700, color: '#22c55e' }}>{results.passed}</div>
        </div>
        <div className="panel" style={{ padding: '14px 18px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${allPass ? '#374561' : '#f43f5e'}, transparent)` }} />
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 8, color: '#374561', letterSpacing: '0.16em', marginBottom: 4 }}>FAILED</div>
          <div style={{ fontFamily: 'var(--font-data)', fontSize: 28, fontWeight: 700, color: allPass ? '#374561' : '#f43f5e' }}>{results.failed}</div>
        </div>
        <div className="panel" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-data)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em',
            color: allPass ? '#22c55e' : '#f43f5e',
          }}>
            {allPass ? 'ALL TESTS PASS' : 'TESTS FAILED'}
          </div>
        </div>
      </div>

      {/* Results list */}
      <div className="panel" style={{ overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '60px 1fr',
          padding: '8px 18px', borderBottom: '1px solid var(--border-dim)',
          fontFamily: 'var(--font-data)', fontSize: 8, letterSpacing: '0.16em', color: '#374561', textTransform: 'uppercase',
        }}>
          <span>Status</span><span>Test Name</span>
        </div>
        {results.results.map((line, i) => {
          const pass = line.startsWith('PASS');
          const name = line.replace(/^(PASS|FAIL)\s+/, '');
          return (
            <div
              key={i}
              style={{
                display: 'grid', gridTemplateColumns: '60px 1fr',
                padding: '9px 18px',
                borderBottom: i < results.results.length - 1 ? '1px solid var(--border-dim)' : 'none',
                alignItems: 'center',
              }}
            >
              <span style={{
                fontFamily: 'var(--font-data)', fontSize: 9, letterSpacing: '0.1em',
                color: pass ? '#22c55e' : '#f43f5e',
              }}>
                {pass ? 'PASS' : 'FAIL'}
              </span>
              <span style={{ fontFamily: 'var(--font-data)', fontSize: 11, color: pass ? '#6b7fa3' : '#f43f5e' }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
