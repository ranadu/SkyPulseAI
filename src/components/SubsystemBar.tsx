import { segmentColors, healthHex } from '../utils/format';
import type { SubsystemHealth } from '../types';

const SEGMENTS = 16;

interface Props {
  sub: SubsystemHealth;
  showMeta?: boolean;
}

export default function SubsystemBar({ sub, showMeta = false }: Props) {
  const segs = segmentColors(sub.score, SEGMENTS);
  const color = healthHex(sub.score);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
        <span style={{
          fontFamily: 'var(--font-data)',
          fontSize: 9,
          letterSpacing: '0.12em',
          color: '#4a5a7a',
          width: 130,
          flexShrink: 0,
          textTransform: 'uppercase',
        }}>{sub.displayName}</span>

        {/* Segmented bar */}
        <div style={{ display: 'flex', gap: 2, flex: 1 }}>
          {segs.map((c, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 5,
                background: c,
                opacity: c === '#1a2235' ? 1 : 0.85 + (i / SEGMENTS) * 0.15,
              }}
            />
          ))}
        </div>

        <span style={{
          fontFamily: 'var(--font-data)',
          fontSize: 11,
          fontWeight: 700,
          color,
          width: 32,
          textAlign: 'right',
          flexShrink: 0,
        }}>{sub.score}%</span>
      </div>

      {showMeta && (
        <div style={{ display: 'flex', gap: 16, paddingLeft: 140, marginBottom: 2 }}>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
            RUL <span style={{ color: '#4a5a7a' }}>{sub.rul.toLocaleString()} hrs</span>
          </span>
          <span style={{ fontFamily: 'var(--font-data)', fontSize: 9, color: '#374561' }}>
            FAT <span style={{ color: '#4a5a7a' }}>{sub.fatiqueConsumed}%</span>
          </span>
        </div>
      )}
    </div>
  );
}
