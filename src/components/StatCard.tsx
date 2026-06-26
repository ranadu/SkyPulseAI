interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: string;
  icon?: React.ReactNode;
  accent?: boolean;
}

export default function StatCard({ label, value, sub, color = '#22d3ee', icon, accent }: StatCardProps) {
  return (
    <div
      className="panel relative overflow-hidden"
      style={{ padding: '16px 18px' }}
    >
      {/* Top accent stripe */}
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${color} 0%, transparent 80%)`,
        }} />
      )}

      {/* Corner mark */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 12, height: 12,
        borderTop: '1px solid #1a2235',
        borderRight: '1px solid #1a2235',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <span style={{
          fontFamily: 'var(--font-data)',
          fontSize: 9,
          letterSpacing: '0.18em',
          color: '#374561',
          textTransform: 'uppercase',
        }}>{label}</span>
        {icon && <span style={{ color: '#374561', opacity: 0.6 }}>{icon}</span>}
      </div>

      <div style={{
        fontFamily: 'var(--font-data)',
        fontSize: 28,
        fontWeight: 700,
        color,
        lineHeight: 1,
        letterSpacing: '-0.02em',
      }}>{value}</div>

      {sub && (
        <div style={{
          fontFamily: 'var(--font-data)',
          fontSize: 9,
          color: '#374561',
          marginTop: 6,
          letterSpacing: '0.1em',
        }}>{sub}</div>
      )}
    </div>
  );
}
