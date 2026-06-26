interface FormulaCardProps {
  title: string;
  formula: string;
  description: string;
  variables?: { symbol: string; meaning: string }[];
}

export default function FormulaCard({ title, formula, description, variables }: FormulaCardProps) {
  return (
    <div
      className="panel"
      style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}
    >
      {/* Top amber rule */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, #e8a020 0%, transparent 60%)' }} />

      <h3 style={{
        fontFamily: 'var(--font-data)',
        fontSize: 10,
        letterSpacing: '0.15em',
        color: '#e8a020',
        textTransform: 'uppercase',
        marginBottom: 12,
      }}>{title}</h3>

      <div style={{
        background: 'var(--bg-inset)',
        border: '1px solid var(--border-dim)',
        padding: '10px 14px',
        fontFamily: 'var(--font-data)',
        fontSize: 12,
        color: '#22d3ee',
        marginBottom: 12,
        overflowX: 'auto',
        whiteSpace: 'pre',
        lineHeight: 1.7,
      }}>{formula}</div>

      <p style={{ fontSize: 12, color: '#6b7fa3', marginBottom: variables?.length ? 12 : 0, lineHeight: 1.6 }}>
        {description}
      </p>

      {variables && variables.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {variables.map(v => (
            <div key={v.symbol} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
              <span style={{
                fontFamily: 'var(--font-data)',
                fontSize: 11,
                color: '#22d3ee',
                width: 52,
                flexShrink: 0,
              }}>{v.symbol}</span>
              <span style={{ fontSize: 11, color: '#4a5a7a' }}>{v.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
